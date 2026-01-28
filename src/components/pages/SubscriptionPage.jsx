import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';
import { Star, LogOut, AlertTriangle, CreditCard, CheckCircle2 } from 'lucide-react';

// bezpieczny klucz z .env.production
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// NOWE ID CEN (Miesięczna 119 zł / Roczna 499 zł)
const MONTHLY_PRICE_ID = 'price_1Suf3OB04sIrbcnlndeX0zVh'; 
const YEARLY_PRICE_ID = 'price_1Suf41B04sIrbcnlJr0QqJ9m';

const AuthHeader = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!currentUser) return null;

    return (
        <div className="absolute top-0 right-0 p-4 z-10">
            <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 hidden sm:inline">{currentUser.email}</span>
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
    setLoading(priceId); // Ustawiamy loading na konkretny ID, żeby wiedzieć który przycisk kręcić
    setError('');

    try {
      const functions = getFunctions();
      const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
      
      // ✅ OBA PLANY SĄ TERAZ SUBSKRYPCJAMI
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

   // UI DLA PROBLEMÓW Z PŁATNOŚCIĄ (PAST_DUE / UNPAID)
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

  // GŁÓWNY UI WYBORU PLANU
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <AuthHeader />
      
      <div className="w-full max-w-5xl p-4 md:p-8 space-y-8 bg-white rounded-2xl shadow-xl text-center mt-12 md:mt-0">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Wybierz Swój Plan Dostępu</h1>
            <p className="text-gray-600 mt-3 text-lg">Twórz profesjonalne wyceny szybciej i zarabiaj więcej.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          
          {/* === PLAN MIESIĘCZNY === */}
          <div className="p-8 border-2 border-gray-100 rounded-2xl text-left hover:border-gray-300 transition-all duration-300 flex flex-col relative bg-white">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Plan Miesięczny</h2>
                <p className="text-gray-500 text-sm mt-1">Elastyczność. Rezygnujesz kiedy chcesz.</p>
            </div>
            
            <div className="mb-6">
                <p className="text-5xl font-extrabold text-gray-900">119 <span className="text-2xl font-medium">zł</span></p>
                <p className="text-gray-500 text-sm mt-1">płatne co miesiąc</p>
            </div>

            <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={18} className="text-green-500"/> <span>Pełen dostęp do kalkulatora</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={18} className="text-green-500"/> <span>Generowanie ofert PDF</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={18} className="text-green-500"/> <span>Baza materiałów i cen</span></div>
            </div>

            <div className="mt-auto">
                <div className="flex justify-center gap-3 text-xs text-gray-400 mb-3 uppercase font-semibold tracking-wider">
                    <span>Karta</span> • <span>BLIK</span> • <span>Google Pay</span>
                </div>
                <button 
                    onClick={() => handleSubscribe(MONTHLY_PRICE_ID, 'subscription')} 
                    disabled={!!loading} 
                    className="w-full py-4 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-300"
                >
                {loading === MONTHLY_PRICE_ID ? 'Przetwarzanie...' : 'Wybieram Miesięczny'}
                </button>
            </div>
          </div>
          
          {/* === PLAN ROCZNY (BEST VALUE) === */}
          <div className="p-8 border-2 border-blue-600 rounded-2xl text-left relative bg-blue-50/50 flex flex-col transform md:-translate-y-2 shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 text-sm font-bold rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                <Star size={14} fill="white" /> Oszczędzasz 65%
            </div>
            
            <div className="mb-4 mt-2">
                <h2 className="text-2xl font-bold text-gray-900">Plan Roczny</h2>
                <p className="text-blue-600 text-sm mt-1 font-medium">Najlepszy wybór dla profesjonalistów.</p>
            </div>
            
            <div className="mb-6">
                <p className="text-5xl font-extrabold text-gray-900">499 <span className="text-2xl font-medium">zł</span></p>
                <p className="text-gray-500 text-sm mt-1">płatne raz na rok</p>
                <div className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                    To tylko 41,58 zł / mies.
                </div>
            </div>

            <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 size={18} className="text-blue-600"/> <span>Wszystko co w planie miesięcznym</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 size={18} className="text-blue-600"/> <span>Gwarancja stałej ceny przez rok</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 size={18} className="text-blue-600"/> <span>Faktura zbiorcza raz w roku</span></div>
            </div>

            <div className="mt-auto">
                <div className="flex justify-center gap-3 text-xs text-blue-400 mb-3 uppercase font-semibold tracking-wider">
                    <span>Karta</span> • <span>BLIK</span> • <span>Przelewy24</span>
                </div>
                <button 
                    onClick={() => handleSubscribe(YEARLY_PRICE_ID, 'subscription')} 
                    disabled={!!loading} 
                    className="w-full py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                {loading === YEARLY_PRICE_ID ? 'Przetwarzanie...' : 'Wybieram Roczny'}
                </button>
            </div>
          </div>

        </div>
        {error && <p className="text-red-600 font-medium mt-4 bg-red-50 p-3 rounded-lg">{error}</p>}
      </div>

      {/* STOPKA PRAWNA */}
      <div className="mt-12 text-center max-w-2xl px-4">
        <p className="text-[11px] leading-relaxed text-gray-400">
          Operatorem płatności i dostawcą usługi jest <strong>TREEO ART</strong> (właściciel marki Woodly Group).<br/>
          Faktura VAT zostanie wystawiona przez podmiot: <br/>
          TREEO ART Bartłomiej Stokłosa, Sebastian Rzepecki S.C., ul. Limanowska 28A, 32-720 Nowy Wiśnicz, NIP 868-198-75-13.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;