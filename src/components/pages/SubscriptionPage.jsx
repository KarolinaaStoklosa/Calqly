import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Star, LogOut, AlertTriangle, CreditCard } from 'lucide-react';


// bezpieczny klucz z .env.production
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ID cen ze Stripe (produkcyjne)
const RECURRING_PRICE_ID = 'price_1SXSltB04sIrbcnlVFSpqfp3' ; // 199 PLN/mies.
const ONE_TIME_PRICE_ID = 'price_1SXSnVB04sIrbcnlr5JhvxW0'; // 249 PLN/jednorazowo

const AuthHeader = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!currentUser) return null;

    return (
        <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{currentUser.email}</span>
                <button onClick={handleLogout} className="flex items-center gap-2 font-semibold text-gray-700 hover:text-red-600 transition-colors">
                    <LogOut size={16} />
                    Wyloguj
                </button>
            </div>
        </div>
    );
};

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const { subscription } = useAuth(); 

  const handleSubscribe = async (priceId, mode) => {
    setLoading(mode);
    setError('');

    try {
      const functions = getFunctions();
      const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
      
      const { data } = await createStripeCheckout({ priceId, mode });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });

    } catch (err) {
      console.error("Błąd tworzenia sesji Stripe:", err);
      setError('Wystąpił błąd. Spróbuj ponownie później.');
      setLoading(null);
    }
  };
   const handleUpdatePayment = async () => {
    setLoading('portal');
    try {
      const functions = getFunctions();
      const createPortalLink = httpsCallable(functions, 'createPortalLink');
      const { data } = await createPortalLink();
      window.location.href = data.url;
    } catch (err) {
      console.error("Błąd otwierania portalu Stripe:", err);
      setError('Nie udało się otworzyć portalu płatności. Spróbuj ponownie.');
      setLoading(null);
    }
  };

   if (subscription?.status === 'past_due' || subscription?.status === 'unpaid') {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <AuthHeader />
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-800">Problem z płatnością</h1>
          <p className="text-gray-600">
            Wygląda na to, że ostatnia próba obciążenia Twojej karty nie powiodła się. Aby odzyskać pełen dostęp do aplikacji, prosimy o zaktualizowanie metody płatności.
          </p>
          <button 
            onClick={handleUpdatePayment} 
            disabled={!!loading} 
            className="w-full mt-4 py-3 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            {loading === 'portal' ? 'Przekierowuję...' : 'Zaktualizuj Metodę Płatności'}
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <AuthHeader />
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Wybierz Swój Plan Dostępu</h1>
        <p className="text-gray-600">Uzyskaj pełen dostęp do wszystkich funkcji aplikacji, aby tworzyć wyceny szybciej niż kiedykolwiek.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 border-2 border-gray-200 rounded-lg text-left">
            <h2 className="text-xl font-semibold text-gray-900">Subskrypcja</h2>
            <p className="text-gray-500 text-sm mb-4">Płatność cykliczna, wygoda i niższa cena.</p>
            <p className="text-4xl font-bold text-gray-900">199 <span className="text-xl font-medium">zł</span><span className="text-base font-normal text-gray-500"> / miesiąc</span></p>
            <button onClick={() => handleSubscribe(RECURRING_PRICE_ID, 'subscription')} disabled={!!loading} className="w-full mt-6 py-3 font-semibold text-white bg-gray-800 rounded-md hover:bg-black disabled:bg-gray-400">
              {loading === 'subscription' ? 'Przetwarzanie...' : 'Wybieram Subskrypcję'}
            </button>
          </div>
          
          <div className="p-6 border-2 border-blue-600 rounded-lg text-left relative bg-blue-50">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1"><Star size={12}/> Popularne</div>
            <h2 className="text-xl font-semibold text-gray-900">Dostęp Jednorazowy</h2>
            <p className="text-gray-500 text-sm mb-4">Jedna opłata, dostęp na 30 dni. Płatność kartą lub P24.</p>
            <p className="text-4xl font-bold text-gray-900">249 <span className="text-xl font-medium">zł</span><span className="text-base font-normal text-gray-500"> / 30 dni</span></p>
            <button onClick={() => handleSubscribe(ONE_TIME_PRICE_ID, 'payment')} disabled={!!loading} className="w-full mt-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {loading === 'one-time' ? 'Przetwarzanie...' : 'Kup Dostęp Jednorazowy'}
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SubscriptionPage;