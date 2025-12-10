const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// --- KRYTYCZNA POPRAWKA STRIPE ---
// Wracamy do process.env - Zmienne muszą być ustawione w pliku .env/firebase config.
// const stripeConfig = functions.config().stripe;
// const stripeKey = stripeConfig ? stripeConfig.secret_key : null;

// if (!stripeKey) {
//   logger.error("KRYTYCZNY BŁĄD: Nie znaleziono klucza Stripe w konfiguracji!");
// }

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, { 
  apiVersion: '2024-06-20', 
});

admin.initializeApp();

// ✅ NOWA FUNKCJA POMOCNICZA: Gwarantuje bezpieczną konwersję na Timestamp
const toFirestoreTimestamp = (seconds) => {
  if (typeof seconds === 'number' && !isNaN(seconds)) {
    return admin.firestore.Timestamp.fromMillis(seconds * 1000);
  }
  return null;
};

// NOWA FUNKCJA POMOCNICZA: Znajduje UID na podstawie Stripe Customer ID
async function findUidByCustomerId(customerId) {
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('stripeCustomerId', '==', customerId).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].id; // Zwraca UID
}

/**
 * Funkcja Callable: Tworzy sesję Stripe Checkout.
 * Zabezpieczenia: Wymusza Cors, Autoryzację Firebase.
 */
const ALLOWED_ORIGINS = [
    'https://qalqly.woodlygroup.pl', 
    'http://localhost:5174' 
];

exports.createStripeCheckout = onCall({ cors: ALLOWED_ORIGINS }, async (request) => {
// exports.createStripeCheckout = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
  }

  const { priceId, mode } = request.data;
  // Używamy HTTPS i konfiguracji (APP_DOMAIN ustawiliśmy w .env)
  const YOUR_DOMAIN = process.env.APP_DOMAIN || "https://qalqly.woodlygroup.pl"; 
  const userId = request.auth.uid;
  const userEmail = request.auth.token.email;

  try {
    // Krok 1 & 2: Wyszukanie lub utworzenie klienta Stripe
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      // Aktualizacja metadanych, jeśli to konieczne
      if (!customer.metadata.userId) {
          await stripe.customers.update(customer.id, { metadata: { userId: userId } });
      }
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId: userId },
      });
    }

    // Zapisujemy stripeCustomerId w Firebase od razu (ułatwia to logikę Webhooka)
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });

    // Używamy "auto" do payment_method_types, aby Stripe sam wybierał aktywne metody (w tym BLIK)
    const sessionParams = {
      payment_method_types: ['card'], // Zostawiamy 'card' jako minimum - BLIK zostanie dodany przez auto/dashboard
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`, // Dodano session_id
      cancel_url: `${YOUR_DOMAIN}/subscribe?canceled=true`, // Kierowanie na subscribe po anulowaniu
      customer: customer.id, 
      client_reference_id: userId, // ID dla Webhooka checkout.session.completed
      metadata: { userId: userId },
    };
    
    if (mode === 'subscription') {
        sessionParams.subscription_data = {
            trial_period_days: 7,
            metadata: { userId: userId }
        };
        sessionParams.payment_method_collection = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { id: session.id };
  } catch (error) {
    logger.error("Błąd tworzenia sesji Stripe:", error);
    // Używamy statusu z błędu Stripe, jeśli jest dostępny, np. 401
    const status = error.statusCode || 500;
    throw new HttpsError("internal", `Wystąpił błąd serwera (${status}): ${error.message}`);
  }
});

/**
 * Funkcja Callable: Otwiera Portal Klienta Stripe.
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
 * Funkcja HTTP: Webhook obsługujący zdarzenia od Stripe.
 */
exports.stripeWebhook = onRequest(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  // Webhook Secret jest odczytywany bezpośrednio z .env, co jest standardem dla Gen 2
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
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = dataObject;
        const customerId = subscription.customer;
        
        // Krok 1: WZMOCNIONE WYSZUKIWANIE UID (Szukamy w Firestore po zapisanym Customer ID)
        const userId = await findUidByCustomerId(customerId);

        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Krok 2: Bezpieczne budowanie danych subskrypcji
            const subscriptionData = {
                status: subscription.status,
                priceId: subscription.items?.data?.[0]?.price?.id || null, // Używamy opcjonalnego łańcuchowania
                customerId: customerId,
                trial_end: toFirestoreTimestamp(subscription.trial_end),
                current_period_end: toFirestoreTimestamp(subscription.current_period_end)
            };

            await userRef.set({ subscription: subscriptionData }, { merge: true });
            logger.info(`Status subskrypcji zaktualizowany (UserId: ${userId}, Status: ${subscription.status})`);
        } else {
             logger.warn(`Nie znaleziono UID dla Customer ID: ${customerId}. Webhook ignorowany.`);
        }
        break;
      }
      case 'checkout.session.completed': {
        const session = dataObject;
        const userId = session.client_reference_id || session.metadata.userId;
        
        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // Sprawdzenie trybu płatności
            if (session.mode === 'payment') {
                // Płatność jednorazowa (249 PLN) - przyznanie dostępu na 30 dni
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                
                await userRef.set({
                    stripeCustomerId: session.customer,
                    subscription: { status: 'active' }, 
                    accessExpiresAt: admin.firestore.Timestamp.fromDate(thirtyDaysFromNow)
                }, { merge: true });

                logger.info(`Jednorazowy dostęp przyznany dla ${userId}`);

            } else if (session.mode === 'subscription') {
                // Subskrypcja (199 PLN) - wystarczy zapisać ID klienta, resztę zrobi Webhook customer.subscription.created
                await userRef.set({ stripeCustomerId: session.customer }, { merge: true });
                logger.info(`Zapisano stripeCustomerId: ${session.customer}`);
            }
        } else {
            logger.warn(`Brak userId w sesji checkout ${session.id}`);
        }
        break;
      }
      default:
        // Ignorujemy nieobsługiwane zdarzenia
        res.status(200).send();
        return;
    }
  } catch (error) {
    logger.error('KRYTYCZNY BŁĄD W WEBHOOKU:', error);
    // W przypadku błędu wewnętrznego, zwracamy 500, aby Stripe próbował ponownie
    return res.status(500).send('Błąd serwera wewnętrznego.');
  }

  res.status(200).send();
});