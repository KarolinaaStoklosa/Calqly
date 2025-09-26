const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// Inicjalizacja Stripe z zablokowaną wersją API dla stabilności
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // ✅ BEST PRACTICE: Używamy stałej wersji API
});
admin.initializeApp();

// ✅ NOWA FUNKCJA POMOCNICZA: Gwarantuje bezpieczną konwersję na Timestamp
const toFirestoreTimestamp = (seconds) => {
  // Sprawdzamy, czy wartość jest faktycznie liczbą
  if (typeof seconds === 'number' && !isNaN(seconds)) {
    return admin.firestore.Timestamp.fromMillis(seconds * 1000);
  }
  // W każdym innym przypadku zwracamy null, aby uniknąć błędu
  return null;
};

/**
 * Tworzy sesję Stripe Checkout.
 * Kluczowe zmiany:
 * 1. Wyszukuje lub tworzy klienta Stripe.
 * 2. Zapisuje `userId` w metadanych klienta Stripe dla maksymalnej niezawodności.
 * 3. Przekazuje ID klienta do sesji checkout.
 */
exports.createStripeCheckout = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
  }

  const { priceId, mode } = request.data;
  // TODO: Zmień na docelowy URL produkcyjny przed wdrożeniem
  const YOUR_DOMAIN = "http://localhost:5174"; 
  const userId = request.auth.uid;
  const userEmail = request.auth.token.email;

  try {
    // ✅ KROK 1: Wyszukajmy klientów z tym samym adresem email, aby uniknąć duplikatów
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      // Upewnijmy się, że metadane są aktualne
      if (!customer.metadata.userId) {
          await stripe.customers.update(customer.id, { metadata: { userId: userId } });
      }
    } else {
      // ✅ KROK 2: Jeśli klient nie istnieje, tworzymy nowego z metadanymi
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
        },
      });
    }

    // Zapisujemy stripeCustomerId w Firebase od razu
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });


    const sessionParams = {
      payment_method_types: mode === 'subscription' ? ["card"] : ["card", "p24"],
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      customer: customer.id, // ✅ KLUCZOWA ZMIANA: Przekazujemy ID istniejącego/nowego klienta
      client_reference_id: userId, // Pozostawiamy dla zdarzenia checkout.session.completed
      metadata: { userId: userId },
    };
    
    if (mode === 'subscription') {
        sessionParams.subscription_data = {
            trial_period_days: 7,
            metadata: {
                userId: userId // Metadane na poziomie subskrypcji - bardzo ważne!
            }
        };
        sessionParams.payment_method_collection = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { id: session.id };
  } catch (error) {
    logger.error("Błąd tworzenia sesji Stripe:", error);
    throw new HttpsError("internal", `Wystąpił błąd serwera: ${error.message}`);
  }
});

// exports.createPortalLink = onCall({ cors: true }, async (request) => {
//     // ... (ta funkcja pozostaje bez zmian, ale warto upewnić się, że pobiera stripeCustomerId)
//     if (!request.auth) {
//       throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
//     }
//     const YOUR_DOMAIN = "http://localhost:5174"; 
//     try {
//       const uid = request.auth.uid;
//       const userDoc = await admin.firestore().collection("users").doc(uid).get();
//       const stripeCustomerId = userDoc.data()?.stripeCustomerId; // ✅ Używamy jednolitego pola
//       if (!stripeCustomerId) {
//         throw new HttpsError("not-found", "Nie znaleziono konta klienta Stripe.");
//       }
//       const portalSession = await stripe.billingPortal.sessions.create({
//         customer: stripeCustomerId,
//         return_url: `${YOUR_DOMAIN}/company-settings`,
//       });
//       return { url: portalSession.url };
//     } catch (error) {
//       logger.error("Błąd tworzenia sesji portalu:", error);
//       throw new HttpsError("internal", error.message);
//     }
// });
exports.createPortalLink = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
    }
    const YOUR_DOMAIN = "http://localhost:5174"; 
    try {
      const uid = request.auth.uid;
      const userDoc = await admin.firestore().collection("users").doc(uid).get();

      // ✅ KROK DEBUGOWANIA: Dodaj tę linię, aby zalogować dane
      logger.info("Pobrane dane użytkownika z Firestore:", userDoc.data());

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
 * Webhook obsługujący zdarzenia od Stripe.
 * Kluczowe zmiany:
 * 1. Uproszczona i bardziej niezawodna logika pobierania userId.
 * 2. Obsługa zdarzeń `created` i `updated` w jednym bloku.
 * 3. Wykorzystanie metadanych z obiektu customer jako ostatecznego źródła prawdy.
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
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = dataObject;
        let userId = subscription.metadata.userId;

        if (!userId && subscription.customer) {
            const customer = await stripe.customers.retrieve(subscription.customer);
            userId = customer.metadata.userId;
        }

        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // ✅ KLUCZOWA POPRAWKA: Budujemy obiekt subskrypcji w sposób bezpieczny
            const subscriptionData = {
                status: subscription.status,
                priceId: subscription.items.data[0].price.id,
                customerId: subscription.customer,
                trial_end: toFirestoreTimestamp(subscription.trial_end),
                current_period_end: toFirestoreTimestamp(subscription.current_period_end)
            };

            await userRef.set({ subscription: subscriptionData }, { merge: true });
            logger.info(`Subskrypcja zaktualizowana dla: ${userId}, status: ${subscription.status}`);
        } else {
             logger.error(`KRYTYCZNY BŁĄD: Brak userId dla subskrypcji ${subscription.id}`);
        }
        break;
      }
      case 'checkout.session.completed': {
        const session = dataObject;
        const userId = session.client_reference_id || session.metadata.userId;
        
        if (userId) {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            // ✅ NOWA LOGIKA: Sprawdzamy tryb sesji
            if (session.mode === 'payment') {
                // To jest płatność jednorazowa
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                
                await userRef.set({
                    stripeCustomerId: session.customer,
                    // Ustawiamy status 'active', aby odzwierciedlić aktywny dostęp
                    subscription: { status: 'active' }, 
                    // Zapisujemy konkretną datę wygaśnięcia dostępu
                    accessExpiresAt: admin.firestore.Timestamp.fromDate(thirtyDaysFromNow)
                }, { merge: true });

                logger.info(`Jednorazowy dostęp przyznany dla ${userId}, wygasa: ${thirtyDaysFromNow}`);

            } else if (session.mode === 'subscription') {
                // To jest subskrypcja - wystarczy zapisać ID klienta, resztę zrobią inne webhooki
                await userRef.set({ stripeCustomerId: session.customer }, { merge: true });
                logger.info(`Zapisano stripeCustomerId: ${session.customer} dla subskrypcji użytkownika ${userId}`);
            }
        } else {
            logger.warn(`Brak userId w sesji checkout ${session.id}`);
        }
        break;
      }
      default:
        // Ignorujemy nieobsługiwane zdarzenia
    }
  } catch (error) {
    logger.error('Błąd obsługi webhooka:', { error: error.message, event: event.type });
    return res.status(500).send('Błąd serwera wewnętrznego.');
  }

  res.status(200).send();
});