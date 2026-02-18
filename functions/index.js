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

// ✅ POMOCNICZA: Szukanie usera po Stripe Customer ID (z 3 fallback'ami!)
async function findUidByCustomerId(customerId, subscriptionMetadata = {}) {
    const usersRef = admin.firestore().collection('users');
    
    logger.info(`🔍 findUidByCustomerId START | customerId: ${customerId} | hasMetadata: ${!!subscriptionMetadata}`);
    
    // 1. Najpierw spróbuj znaleźć po stripeCustomerId (najszybciej) - fallback po Firebase save
    const snapshot = await usersRef.where('stripeCustomerId', '==', customerId).limit(1).get();
    if (!snapshot.empty) {
        logger.info(`✅ Fallback 1: Znaleziono usera po stripeCustomerId`);
        return snapshot.docs[0].id;
    }
    
    // 2. Fallback: Spróbuj znaleźć po userId z metadanych subscription (jeśli istnieją)
    if (subscriptionMetadata && typeof subscriptionMetadata === 'object' && subscriptionMetadata.userId) {
        logger.warn(`⚠️ Fallback 2: Szukam po metadata.userId: ${subscriptionMetadata.userId}`);
        try {
            const userDoc = await usersRef.doc(subscriptionMetadata.userId).get();
            if (userDoc.exists()) {
                logger.info(`✅ Fallback 2: Znaleziono usera po metadata.userId`);
                return subscriptionMetadata.userId;
            } else {
                // ⚠️ WAŻNE: metadata.userId istnieje ale dokument nie! Może być błąd w danych
                logger.error(`❌ Fallback 2 FAIL: metadata.userId="${subscriptionMetadata.userId}" ale dokument nie istnieje w Firebase!`);
            }
        } catch (err) {
            logger.error(`❌ Fallback 2 ERROR: ${err.message}`);
        }
    } else {
        logger.warn(`⚠️ Fallback 2: POMINIĘTY (brak metadata.userId)`);
    }
    
    // 3. Fallback: Weź email ze Stripe i szukaj po emailu (najpewniejszy, ale najwolniejszy)
    logger.warn(`⚠️ Fallback 3: Nie znaleziono po stripeCustomerId. Szukam po emailu...`);
    
    try {
        const stripeCustomer = await stripe.customers.retrieve(customerId);
        if (!stripeCustomer) {
            logger.error(`❌ Fallback 3: Stripe customer ${customerId} nie istnieje!`);
            return null;
        }
        
        if (!stripeCustomer.email) {
            logger.error(`❌ Fallback 3: Stripe customer ${customerId} nie ma emaila!`);
            return null;
        }
        
        logger.info(`📧 Fallback 3: Email z Stripe: ${stripeCustomer.email}`);
        const emailSnapshot = await usersRef.where('email', '==', stripeCustomer.email).limit(1).get();
        
        if (!emailSnapshot.empty) {
            const foundUid = emailSnapshot.docs[0].id;
            logger.info(`✅ Fallback 3: Znaleziono usera po emailu: ${stripeCustomer.email} → uid: ${foundUid}`);
            
            // 🎁 BONUS: Oprawiamy brakujący stripeCustomerId na przyszłość!
            logger.info(`🆙 UPDATE: Uzupełniam brakujący stripeCustomerId dla szybszych zapytań w przyszłości`);
            await usersRef.doc(foundUid).set({ stripeCustomerId: customerId }, { merge: true }).catch(err => 
                logger.error(`⚠️ Nie udało się zsynchronizować stripeCustomerId: ${err.message}`)
            );
            
            return foundUid;
        } else {
            logger.error(`❌ Fallback 3: Email ${stripeCustomer.email} nie znaleziony w Firebase!`);
        }
    } catch (err) {
        logger.error(`❌ Fallback 3: Błąd pobierania Stripe customera: ${err.message}`);
    }
    
    logger.error(`🔴 KRITYCZNE: Nie znaleziono usera dla customerId: ${customerId} (wszystkie fallback'i zawaliły się)`);
    return null;
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

  logger.info(`🛒 Checkout START | userId: ${userId} | email: ${userEmail} | priceId: ${priceId} | mode: ${mode}`);

  // 1. Walidacja planu
  const planConfig = PRICING_MAP[priceId];
  if (!planConfig) {
      logger.error(`❌ Nieznany priceId: ${priceId}`);
      throw new HttpsError('invalid-argument', 'Nieprawidłowy identyfikator planu (priceId).');
  }

  // 2. Decyzja: Którego ID ceny użyć?
  let finalPriceId = priceId; // Domyślnie: Subskrypcja
  
  if (mode === 'payment') {
      logger.info(`💳 Mode: BLIK/Jednorazowe | oneTimePriceId: ${planConfig.oneTimePriceId}`);
      // Jeśli BLIK -> podmieniamy na cenę Jednorazową
      finalPriceId = planConfig.oneTimePriceId;
      
      // Walidacja konfiguracji (żeby nie wysłać śmieci do Stripe)
      if (!finalPriceId || finalPriceId.includes('TUTAJ_WKLEJ')) {
          logger.error('❌ Brak konfiguracji oneTimePriceId dla:', priceId);
          throw new HttpsError('internal', 'Błąd konfiguracji cen jednorazowych na serwerze.');
      }
  } else {
      logger.info(`📦 Mode: Subskrypcja`);
  }

  try {
    // 3. Znajdź lub stwórz klienta Stripe
    logger.info(`🔍 Szukam Stripe customera dla email: ${userEmail}`);
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      logger.info(`✅ Znaleziono customera: ${customer.id}`);
      if (!customer.metadata.userId) {
          logger.info(`📌 Dodaję userId do customera metadata`);
          await stripe.customers.update(customer.id, { metadata: { userId: userId } });
      }
    } else {
      logger.info(`➕ Tworzę nowego customera`);
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId: userId },
      });
      logger.info(`✅ Stworzono nowego customera: ${customer.id}`);
    }

    // Zapisz ID klienta w bazie
    const userRef = admin.firestore().collection('users').doc(userId);
    logger.info(`💾 Zapisuję stripeCustomerId: ${customer.id} do Firebase`);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
    logger.info(`✅ CustomerID zapisany w Firebase`);

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

    logger.info(`🔗 Tworzę sesję Stripe | finalPriceId: ${finalPriceId}`);
    const session = await stripe.checkout.sessions.create(sessionParams);
    logger.info(`✅ Sesja Stripe stworzona! | sessionId: ${session.id}`);
    return { id: session.id };

  } catch (error) {
    logger.error(`❌ Błąd tworzenia sesji Stripe: ${error.message}`, error);
    // Przekazujemy błąd ze Stripe (np. błędne ID ceny) do frontendu
    throw new HttpsError("internal", error.message);
  }
});

/**
 * Funkcja 2: Portal Klienta
 */
exports.createPortalLink = onCall({ cors: true }, async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
    
    const uid = request.auth.uid;
    logger.info(`🔐 Portal START | userId: ${uid}`);
    
    // Ważne: return_url powinien prowadzić do miejsca, gdzie klient widzi faktury
    const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl";
    const RETURN_URL = `${YOUR_DOMAIN}/company-settings`;

    logger.info(`🔍 Szukam stripeCustomerId dla userId: ${uid}`);
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        logger.error(`❌ Nie znaleziono stripeCustomerId dla userId: ${uid}`);
        throw new HttpsError("not-found", "Nie znaleziono konta klienta Stripe. Dokonaj najpierw zakupu.");
    }

    logger.info(`✅ Znaleziono customerId: ${stripeCustomerId}`);

    try {
      logger.info(`🔗 Tworzę portal session`);
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: RETURN_URL,
      });
      logger.info(`✅ Portal URL wygenerowany`);
      return { url: portalSession.url };
    } catch (error) {
      logger.error(`❌ Błąd tworzenia portalu: ${error.message}`, error);
      throw new HttpsError("internal", error.message);
    }
});


/**
 * Funkcja 3: Webhook (Kluczowa dla aktualizacji uprawnień)
 */
exports.stripeWebhook = onRequest(async (req, res) => {
  logger.info(`🔔 WEBHOOK RECEIVED`);
  
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 
  
  if (!endpointSecret) {
    logger.error(`❌ STRIPE_WEBHOOK_SECRET nie jest ustawiony!`);
    return res.status(500).send('Webhook Secret not configured');
  }
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
    logger.info(`✅ Webhook podpisany poprawnie | event: ${event.type}`);
  } catch (err) {
    logger.error(`❌ Błąd weryfikacji webhooka: ${err.message}`);
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
        logger.info(`📦 Event: ${event.type} | Subscription ID: ${subscription.id} | Status: ${subscription.status}`);
        
        const userId = await findUidByCustomerId(subscription.customer, subscription.metadata);

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
                 logger.info(`✅ Subskrypcja ${subscription.status} dla ${userId}. Dostęp do: ${new Date(subscription.current_period_end * 1000).toISOString()}`);
            } else {
                 logger.warn(`⚠️ Subskrypcja status: ${subscription.status} dla ${userId} (nie będzie dostęp)`);
            }
        } else {
            logger.error(`❌ Nie znaleziono usera dla Stripe Customer ID: ${subscription.customer}`);
        }
        break;
      }

      // 🔵 B. PŁATNOŚĆ JEDNORAZOWA (BLIK )
      case 'checkout.session.completed': {
        const session = dataObject;
        logger.info(`💳 Checkout session completed | sessionId: ${session.id} | mode: ${session.mode} | payment_status: ${session.payment_status}`);
        
        // userId bierzemy z client_reference_id lub metadanych
        const userId = session.client_reference_id || session.metadata.userId;
        
        if (!userId) {
            logger.error(`❌ Nie znaleziono userId w sesji checkout`);
            break;
        }
        
        logger.info(`👤 userId: ${userId}`);
        
        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Zapisz ID klienta na przyszłość
            logger.info(`💾 Zapisuję stripeCustomerId: ${session.customer}`);
            await userRef.set({ stripeCustomerId: session.customer }, { merge: true });

            // Jeśli to tryb 'payment' (jednorazowy) i zapłacono:
            if (session.mode === 'payment' && session.payment_status === 'paid') {
                
                // Odczytujemy liczbę dni z metadanych (którą wstawiliśmy w createStripeCheckout)
                const daysToAdd = parseInt(session.metadata.accessDays || '30');
                logger.info(`📅 BLIK płatność: +${daysToAdd} dni dostępu`);
                
                // Obliczamy nową datę wygaśnięcia (od dzisiaj + X dni)
                const now = new Date();
                const newExpiryDate = new Date(now.setDate(now.getDate() + daysToAdd));
                
                logger.info(`⏰ accessExpiresAt: ${newExpiryDate.toISOString()}`);
                await userRef.set({
                    accessExpiresAt: admin.firestore.Timestamp.fromDate(newExpiryDate),
                    // Ustawiamy status 'manual_paid' (żeby frontend wiedział, że nie ma subskrypcji, ale jest OK)
                    subscription: { status: 'manual_paid' } 
                }, { merge: true });

                logger.info(`✅ BLIK: Przyznano dostęp dla ${userId} na ${daysToAdd} dni.`);
            }
        }
        break;
      }
      
      // 🔴 C. BŁĄD PŁATNOŚCI
      case 'invoice.payment_failed': {
          logger.warn(`⚠️ invoice.payment_failed | customerId: ${dataObject.customer}`);
          const userId = await findUidByCustomerId(dataObject.customer);
          if (userId) {
              logger.warn(`❌ Płatność nieudana dla usera ${userId}.`);
              // Tutaj można dodać logikę wysłania maila do klienta
          } else {
              logger.error(`❌ Nie znaleziono usera dla failedId: ${dataObject.customer}`);
          }
          break;
      }

      default:
        logger.warn(`⚠️ Nieobsługiwany event type: ${event.type}`);
        break;
    }
  } catch (error) {
    logger.error(`❌ BŁĄD WEWNĘTRZNY W WEBHOOKU: ${error.message}`, error);
    return res.status(500).send('Server Error');
  }

  logger.info(`✅ Webhook zakończony pomyślnie`);
  res.status(200).send();
});