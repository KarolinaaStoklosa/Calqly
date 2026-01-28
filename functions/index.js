const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// Inicjalizacja Stripe z kluczem z .env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, { 
  apiVersion: '2024-06-20', 
});

admin.initializeApp();

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
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].id;
}

const ALLOWED_ORIGINS = [
    'https://qalqly.woodlygroup.pl', 
    'http://localhost:5174' 
];

/**
 * Funkcja 1: Tworzenie sesji Checkout (Miesięczny lub Roczny)
 */
exports.createStripeCheckout = onCall({ cors: ALLOWED_ORIGINS }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
  }

  const { priceId, mode } = request.data; 
  // UWAGA: Teraz mode powinno być ZAWSZE 'subscription' (dla obu planów)
  
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

    // Zapisz ID klienta w bazie, żeby webhook wiedział czyje to konto
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });

    // 2. Konfiguracja sesji
    const sessionParams = {
      // ✅ ZMIANA: Włączamy 'automatic_payment_methods' -> to pozwoli na BLIK/P24 jeśli włączyłaś je w Stripe Dashboard
      automatic_payment_methods: { enabled: true },
      mode: 'subscription', // Wymuszamy tryb subskrypcji dla obu planów
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/subscribe?canceled=true`,
      customer: customer.id, 
      client_reference_id: userId,
      metadata: { userId: userId },
      // Wymuszamy pobieranie adresu do faktury (wymóg prawny B2B)
      billing_address_collection: 'required',
    };
    
    // Opcjonalnie: Trial 7 dni (działa tylko jeśli użytkownik nie korzystał wcześniej)
    // Jeśli chcesz trial tylko dla miesięcznego, możesz dodać warunek if (priceId === 'ID_MIESIECZNEGO')
    sessionParams.subscription_data = {
        trial_period_days: 7, 
        metadata: { userId: userId }
    };
    
    // Zapisanie karty na przyszłość (dla subskrypcji jest to domyślne, ale warto ustawić)
    sessionParams.payment_method_collection = 'always';

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { id: session.id };

  } catch (error) {
    logger.error("Błąd tworzenia sesji Stripe:", error);
    const status = error.statusCode || 500;
    throw new HttpsError("internal", `Wystąpił błąd serwera (${status}): ${error.message}`);
  }
});

/**
 * Funkcja 2: Portal Klienta (Zarządzanie subskrypcją / fakturami)
 */
exports.createPortalLink = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
    }
    const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl";
    try {
      const uid = request.auth.uid;
      const userDoc = await admin.firestore().collection("users").doc(uid).get();

      const stripeCustomerId = userDoc.data()?.stripeCustomerId;
      if (!stripeCustomerId) {
        throw new HttpsError("not-found", "Nie znaleziono konta klienta Stripe.");
      }
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${YOUR_DOMAIN}/company-settings`,
      });
      return { url: portalSession.url };
    } catch (error) {
      logger.error("Błąd tworzenia sesji portalu:", error);
      throw new HttpsError("internal", error.message);
    }
});


/**
 * Funkcja 3: Webhook (Kluczowa dla aktualizacji statusu w bazie)
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
      // ✅ OBSŁUGA SUBSKRYPCJI (TWORZENIE / AKTUALIZACJA / ANULOWANIE)
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = dataObject;
        const customerId = subscription.customer;
        
        const userId = await findUidByCustomerId(customerId);

        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Mapowanie statusów Stripe na statusy aplikacji
            // 'active', 'trialing' -> dostęp
            // 'past_due', 'canceled', 'unpaid' -> brak dostępu
            
            const subscriptionData = {
                status: subscription.status,
                priceId: subscription.items?.data?.[0]?.price?.id || null,
                customerId: customerId,
                trial_end: toFirestoreTimestamp(subscription.trial_end),
                current_period_end: toFirestoreTimestamp(subscription.current_period_end),
                cancel_at_period_end: subscription.cancel_at_period_end // Czy anulowano na koniec okresu?
            };

            await userRef.set({ subscription: subscriptionData }, { merge: true });
            
            // ✅ WAŻNE: Aktualizacja daty wygaśnięcia dostępu w głównym dokumencie usera
            // Dzięki temu ProtectedRoute.jsx działa szybciej bez zagłębiania się w obiekt subscription
            if (subscription.status === 'active' || subscription.status === 'trialing') {
                 // Ustawiamy datę końca okresu jako accessExpiresAt
                 await userRef.set({ 
                     accessExpiresAt: toFirestoreTimestamp(subscription.current_period_end) 
                 }, { merge: true });
            }

            logger.info(`Status subskrypcji zaktualizowany dla ${userId}: ${subscription.status}`);
        } else {
             logger.warn(`Nie znaleziono UID dla Customer ID: ${customerId}. Webhook ignorowany.`);
        }
        break;
      }

      // ✅ OBSŁUGA ZAKOŃCZENIA SESJI CHECKOUT
      // Przydatne do powiązania Customer ID przy pierwszej płatności
      case 'checkout.session.completed': {
        const session = dataObject;
        const userId = session.client_reference_id || session.metadata.userId;
        
        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            // Zapisujemy ID klienta, żeby kolejne webhooki działały
            await userRef.set({ stripeCustomerId: session.customer }, { merge: true });
            logger.info(`Checkout zakończony. Powiązano klienta ${session.customer} z userem ${userId}`);
        }
        break;
      }
      
      // ✅ OBSŁUGA NIEUDANEJ PŁATNOŚCI (np. karta odrzucona przy odnowieniu)
      case 'invoice.payment_failed': {
          const invoice = dataObject;
          const customerId = invoice.customer;
          const userId = await findUidByCustomerId(customerId);
          
          if (userId) {
              logger.warn(`Płatność nieudana dla usera ${userId}. Subskrypcja może przejść w stan past_due.`);
              // Tutaj można dodać logikę wysyłania maila do klienta
          }
          break;
      }

      default:
        res.status(200).send();
        return;
    }
  } catch (error) {
    logger.error('KRYTYCZNY BŁĄD W WEBHOOKU:', error);
    return res.status(500).send('Błąd serwera wewnętrznego.');
  }

  res.status(200).send();
});