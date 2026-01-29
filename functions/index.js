const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

// Inicjalizacja Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_deploy_analysis";
const stripe = require("stripe")(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

// Inicjalizacja Admina (musi być raz)
admin.initializeApp();

// 🗺️ PRICING_MAP: Konfiguracja cen Subskrypcja vs Jednorazowe
// Klucz: ID ceny Subskrypcyjnej (Recurring) - to, co wysyła frontend
// Wartość: Obiekt z ID ceny Jednorazowej (One-time) dla BLIKa i liczbą dni dostępu
const PRICING_MAP = {
    // 1. PLAN MIESIĘCZNY
    'price_1Suf3OB04sIrbcnlndeX0zVh': { 
        // ID ceny "One-time" ze Stripe (musisz ją stworzyć w Dashboardzie)
        oneTimePriceId: 'price_1Sv1jbB04sIrbcnlWLJrCuU1', 
        days: 30
    },
    // 2. PLAN ROCZNY
    'price_1Suf41B04sIrbcnlJr0QqJ9m': { 
        // ID ceny "One-time" ze Stripe
        oneTimePriceId: 'price_1Sv1nLB04sIrbcnlOjeD2svl', 
        days: 365
    }
};

// ✅ POMOCNICZA: Bezpieczna konwersja timestamp ze Stripe na Firestore
const toFirestoreTimestamp = (seconds) => {
  if (typeof seconds === 'number' && !isNaN(seconds)) {
    return admin.firestore.Timestamp.fromMillis(seconds * 1000);
  }
  return null;
};

// ✅ POMOCNICZA: Szukanie usera po Stripe Customer ID
async function findUidByCustomerId(customerId) {
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('stripeCustomerId', '==', customerId).limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].id;
}

const ALLOWED_ORIGINS = [
    'https://qalqly.woodlygroup.pl', 
    'http://localhost:5174' 
];

/**
 * Funkcja 1: Tworzenie sesji Checkout (Hybrydowa: Karta lub BLIK)
 */
exports.createStripeCheckout = onCall({ cors: ALLOWED_ORIGINS }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
  }

  // Frontend wysyła: priceId (zawsze subskrypcyjne) oraz mode ('subscription' lub 'payment')
  const { priceId, mode, wantsInvoice } = request.data; 
  
  const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl"; 
  const userId = request.auth.uid;
  const userEmail = request.auth.token.email;

  // 1. Walidacja planu
  const planConfig = PRICING_MAP[priceId];
  if (!planConfig) {
      throw new HttpsError('invalid-argument', 'Nieprawidłowy identyfikator planu (priceId).');
  }

  // 2. Decyzja: Którego ID ceny użyć?
  let finalPriceId = priceId; // Domyślnie: Subskrypcja
  
  if (mode === 'payment') {
      // Jeśli BLIK -> podmieniamy na cenę Jednorazową
      finalPriceId = planConfig.oneTimePriceId;
      
      // Walidacja konfiguracji (żeby nie wysłać śmieci do Stripe)
      if (!finalPriceId || finalPriceId.includes('TUTAJ_WKLEJ')) {
          logger.error('Brak konfiguracji oneTimePriceId dla:', priceId);
          throw new HttpsError('internal', 'Błąd konfiguracji cen jednorazowych na serwerze.');
      }
  }

  try {
    // 3. Znajdź lub stwórz klienta Stripe
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      if (!customer.metadata.userId) {
          await stripe.customers.update(customer.id, { metadata: { userId: userId } });
      }
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId: userId },
      });
    }

    // Zapisz ID klienta w bazie
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });

    // 4. Konfiguracja sesji Checkout
    const sessionParams = {
      customer: customer.id,
      client_reference_id: userId,
      
      mode: mode, // 'subscription' lub 'payment'
      
      line_items: [{ 
          price: finalPriceId, 
          quantity: 1 
      }],
      
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/subscribe?canceled=true`,
      
      billing_address_collection: wantsInvoice ? 'required' : 'auto',
      tax_id_collection: { enabled: !!wantsInvoice },
      allow_promotion_codes: true,
    //   customer_update: {
    //       address: 'auto',
    //       name: 'auto',
    //   },
      
      // Przekazujemy metadane (ważne dla Webhooka przy BLIKu)
      metadata: { 
          userId: userId,
          accessDays: planConfig.days.toString() 
      },
    };

    if (wantsInvoice) {
        sessionParams.customer_update = {
            address: 'auto',
            name: 'auto',
        };
    }

    // Specyficzne ustawienia w zależności od trybu
    if (mode === 'subscription') {
        // Tylko karty, zapisujemy na zawsze
        sessionParams.payment_method_types = ['card'];
        sessionParams.payment_method_collection = 'always';
        sessionParams.subscription_data = {
            metadata: { userId: userId }
        };
    } else {
        // BLIK, Karta (jednorazowo)
        sessionParams.payment_method_types = ['card', 'blik'];
        sessionParams.invoice_creation = { enabled: true }; // Wymagane, żeby klient dostał fakturę
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { id: session.id };

  } catch (error) {
    logger.error("Błąd tworzenia sesji Stripe:", error);
    // Przekazujemy błąd ze Stripe (np. błędne ID ceny) do frontendu
    throw new HttpsError("internal", error.message);
  }
});

/**
 * Funkcja 2: Portal Klienta
 */
exports.createPortalLink = onCall({ cors: true }, async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
    
    // Ważne: return_url powinien prowadzić do miejsca, gdzie klient widzi faktury
    const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl";
    const RETURN_URL = `${YOUR_DOMAIN}/company-settings`;

    const uid = request.auth.uid;
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        throw new HttpsError("not-found", "Nie znaleziono konta klienta Stripe. Dokonaj najpierw zakupu.");
    }

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: RETURN_URL,
      });
      return { url: portalSession.url };
    } catch (error) {
      logger.error("Błąd tworzenia portalu:", error);
      throw new HttpsError("internal", error.message);
    }
});


/**
 * Funkcja 3: Webhook (Kluczowa dla aktualizacji uprawnień)
 */
exports.stripeWebhook = onRequest(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
  } catch (err) {
    logger.error("Błąd weryfikacji webhooka:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const dataObject = event.data.object;

  try {
    switch (event.type) {
      
      // 🟢 A. SUBSKRYPCJA (KARTA) - Odnawialna
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = dataObject;
        const userId = await findUidByCustomerId(subscription.customer);

        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // 1. Zapisz szczegóły subskrypcji
            await userRef.set({ 
                subscription: {
                    status: subscription.status,
                    priceId: subscription.items?.data?.[0]?.price?.id || null,
                    current_period_end: toFirestoreTimestamp(subscription.current_period_end),
                    cancel_at_period_end: subscription.cancel_at_period_end
                }
            }, { merge: true });
            
            // 2. Jeśli aktywna -> ustaw globalny dostęp w 'accessExpiresAt'
            if (['active', 'trialing'].includes(subscription.status)) {
                 await userRef.set({ 
                      accessExpiresAt: toFirestoreTimestamp(subscription.current_period_end) 
                 }, { merge: true });
            }
            
            logger.info(`Subskrypcja zaktualizowana dla ${userId}: ${subscription.status}`);
        }
        break;
      }

      // 🔵 B. PŁATNOŚĆ JEDNORAZOWA (BLIK )
      case 'checkout.session.completed': {
        const session = dataObject;
        // userId bierzemy z client_reference_id lub metadanych
        const userId = session.client_reference_id || session.metadata.userId;
        
        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Zapisz ID klienta na przyszłość
            await userRef.set({ stripeCustomerId: session.customer }, { merge: true });

            // Jeśli to tryb 'payment' (jednorazowy) i zapłacono:
            if (session.mode === 'payment' && session.payment_status === 'paid') {
                
                // Odczytujemy liczbę dni z metadanych (którą wstawiliśmy w createStripeCheckout)
                const daysToAdd = parseInt(session.metadata.accessDays || '30');
                
                // Obliczamy nową datę wygaśnięcia (od dzisiaj + X dni)
                const now = new Date();
                const newExpiryDate = new Date(now.setDate(now.getDate() + daysToAdd));
                
                await userRef.set({
                    accessExpiresAt: admin.firestore.Timestamp.fromDate(newExpiryDate),
                    // Ustawiamy status 'manual_paid' (żeby frontend wiedział, że nie ma subskrypcji, ale jest OK)
                    subscription: { status: 'manual_paid' } 
                }, { merge: true });

                logger.info(`BLIK: Przyznano dostęp dla ${userId} na ${daysToAdd} dni.`);
            }
        }
        break;
      }
      
      // 🔴 C. BŁĄD PŁATNOŚCI
      case 'invoice.payment_failed': {
          const userId = await findUidByCustomerId(dataObject.customer);
          if (userId) {
              logger.warn(`Płatność nieudana dla usera ${userId}.`);
              // Tutaj można dodać logikę wysłania maila do klienta
          }
          break;
      }

      default:
        break;
    }
  } catch (error) {
    logger.error('BŁĄD WEWNĘTRZNY W WEBHOOKU:', error);
    return res.status(500).send('Server Error');
  }

  res.status(200).send();
});