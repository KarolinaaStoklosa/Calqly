const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// Inicjalizacja Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_deploy_analysis";
const stripe = require("stripe")(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

admin.initializeApp();

// ID Twoich cen (Te same co na frontendzie - potrzebne do wyliczenia dni przy BLIKu)
const PRICE_IDS = {
    MONTHLY: 'price_1Suf3OB04sIrbcnlndeX0zVh', 
    YEARLY: 'price_1Suf41B04sIrbcnlJr0QqJ9m'
};

// ✅ POMOCNICZA: Bezpieczna konwersja timestamp
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

  // Frontend wysyła: priceId oraz mode ('subscription' lub 'payment')
  const { priceId, mode } = request.data; 
  
  const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl"; 
  const userId = request.auth.uid;
  const userEmail = request.auth.token.email;

  try {
    // 1. Znajdź lub stwórz klienta Stripe
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

    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });

    // 2. LOGIKA WYBORU METOD PŁATNOŚCI (Zamiast automatic_payment_methods)
    let paymentMethods = ['card']; // Domyślnie tylko karta
    let sessionMode = 'subscription';
    let accessDays = 30; // Domyślnie

    if (mode === 'payment') {
        // Jeśli klient wybrał jednorazowo -> włączamy BLIK i P24
        paymentMethods = ['card', 'blik', 'p24'];
        sessionMode = 'payment';

        // Ustalamy ile dni dostępu dać (dla Webhooka)
        if (priceId === PRICE_IDS.YEARLY) accessDays = 365;
    }

    // 3. Konfiguracja sesji
    const sessionParams = {
      customer: customer.id,
      client_reference_id: userId,
      
      // RĘCZNE DEFINIOWANIE METOD (Najbezpieczniejsza opcja)
      payment_method_types: paymentMethods,
      
      mode: sessionMode,
      line_items: [{ price: priceId, quantity: 1 }],
      
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/subscribe?canceled=true`,
      
      billing_address_collection: 'required',
      allow_promotion_codes: true,

      metadata: { 
          userId: userId,
          // Przekazujemy info o długości dostępu (potrzebne tylko dla BLIKa)
          accessDays: accessDays.toString() 
      },
    };
    
    // Opcje specyficzne dla SUBSKRYPCJI
    if (sessionMode === 'subscription') {
        sessionParams.payment_method_collection = 'always';
        sessionParams.subscription_data = {
            metadata: { userId: userId }
        };
    } 
    // Opcje specyficzne dla JEDNORAZOWYCH (BLIK)
    else if (sessionMode === 'payment') {
        sessionParams.invoice_creation = { enabled: true };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { id: session.id };

  } catch (error) {
    logger.error("Błąd tworzenia sesji Stripe:", error);
    const status = error.statusCode || 500;
    throw new HttpsError("internal", `Wystąpił błąd serwera (${status}): ${error.message}`);
  }
});

/**
 * Funkcja 2: Portal Klienta
 */
exports.createPortalLink = onCall({ cors: true }, async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
    
    const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl";
    const uid = request.auth.uid;
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) throw new HttpsError("not-found", "Nie znaleziono konta klienta Stripe.");

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${YOUR_DOMAIN}/company-settings`,
      });
      return { url: portalSession.url };
    } catch (error) {
      logger.error("Błąd portalu:", error);
      throw new HttpsError("internal", error.message);
    }
});


/**
 * Funkcja 3: Webhook
 */
exports.stripeWebhook = onRequest(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
  } catch (err) {
    logger.error("Błąd webhooka:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const dataObject = event.data.object;

  try {
    switch (event.type) {
      
      // 🟢 A. SUBSKRYPCJA (KARTA)
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = dataObject;
        const userId = await findUidByCustomerId(subscription.customer);

        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Zapisz status subskrypcji
            await userRef.set({ 
                subscription: {
                    status: subscription.status,
                    priceId: subscription.items?.data?.[0]?.price?.id || null,
                    current_period_end: toFirestoreTimestamp(subscription.current_period_end),
                    cancel_at_period_end: subscription.cancel_at_period_end
                }
            }, { merge: true });
            
            // Jeśli aktywna -> ustawiamy globalny dostęp
            if (['active', 'trialing'].includes(subscription.status)) {
                 await userRef.set({ 
                      accessExpiresAt: toFirestoreTimestamp(subscription.current_period_end) 
                 }, { merge: true });
            }
            
            logger.info(`Subskrypcja zaktualizowana dla ${userId}: ${subscription.status}`);
        }
        break;
      }

      // 🔵 B. PŁATNOŚĆ JEDNORAZOWA (BLIK / P24)
      case 'checkout.session.completed': {
        const session = dataObject;
        // userId bierzemy z client_reference_id (ustawione w createStripeCheckout)
        const userId = session.client_reference_id || session.metadata.userId;
        
        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Zapisz Stripe Customer ID (przydatne na przyszłość)
            await userRef.set({ stripeCustomerId: session.customer }, { merge: true });

            // Jeśli to płatność jednorazowa (BLIK/P24)
            if (session.mode === 'payment' && session.payment_status === 'paid') {
                
                // Odczytujemy, na ile dni dać dostęp (z metadanych)
                const daysToAdd = parseInt(session.metadata.accessDays || '30');
                
                // Obliczamy datę wygaśnięcia
                const now = new Date();
                const newExpiryDate = new Date(now.setDate(now.getDate() + daysToAdd));
                
                await userRef.set({
                    accessExpiresAt: admin.firestore.Timestamp.fromDate(newExpiryDate),
                    // Ustawiamy status 'manual_paid', żeby frontend wiedział, że jest OK
                    subscription: { status: 'manual_paid' } 
                }, { merge: true });

                logger.info(`BLIK/P24: Przyznano dostęp dla ${userId} na ${daysToAdd} dni.`);
            }
        }
        break;
      }
      
      // 🔴 C. BŁĄD PŁATNOŚCI
      case 'invoice.payment_failed': {
          const userId = await findUidByCustomerId(dataObject.customer);
          if (userId) logger.warn(`Płatność nieudana dla usera ${userId}`);
          break;
      }

      default:
        break;
    }
  } catch (error) {
    logger.error('BŁĄD W WEBHOOKU:', error);
    return res.status(500).send('Błąd serwera.');
  }

  res.status(200).send();
});