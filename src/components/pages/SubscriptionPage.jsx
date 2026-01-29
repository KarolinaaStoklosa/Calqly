import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';
import { Star, LogOut, AlertTriangle, CreditCard, CheckCircle2, Smartphone, Loader2 } from 'lucide-react';

// Bezpieczny klucz z .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ID CEN (Upewnij się, że są poprawne ze Stripe Dashboard)
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
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                    <LogOut size={16} />
                    <span>Wyloguj</span>
                </button>
            </div>
        </div>
    );
};

const SubscriptionPage = () => {
  const { currentUser } = useAuth();
  const functions = getFunctions();
  const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');

  // 'subscription' = Karta (cykliczna)
  // 'payment' = BLIK / Przelewy24 (jednorazowa)
  const [billingMode, setBillingMode] = useState('subscription'); 
  
  const [loading, setLoading] = useState(null); 
  const [error, setError] = useState('');

  const handleSubscribe = async (priceId) => {
    setLoading(priceId);
    setError('');

    try {
      const response = await createStripeCheckout({ 
        priceId: priceId,
        mode: billingMode 
      });
      
      const { id } = response.data;
      
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: id });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setError('Wystąpił błąd połączenia z płatnościami. Spróbuj ponownie.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        
        {/* NAGŁÓWEK */}
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
            <Star className="w-8 h-8 text-blue-600 fill-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Wybierz swój plan
          </h1>
          <p className="text-lg text-gray-600">
            Odblokuj pełny potencjał Qalqly. Twórz nieograniczone wyceny, generuj profesjonalne oferty PDF i oszczędzaj czas.
          </p>
        </div>

        {/* --- PRZEŁĄCZNIK TRYBU PŁATNOŚCI --- */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 mb-10 inline-flex relative z-0">
            {/* Opcja 1: Subskrypcja */}
            <button
                onClick={() => setBillingMode('subscription')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    billingMode === 'subscription' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
                <CreditCard size={18} />
                <span>Karta (Subskrypcja)</span>
            </button>

            {/* Opcja 2: Jednorazowo */}
            <button
                onClick={() => setBillingMode('payment')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    billingMode === 'payment' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
                <Smartphone size={18} />
                <span>Jednorazowo (BLIK)</span>
            </button>
        </div>
        
        {/* Informacja pod przełącznikiem */}
        <p className="text-sm text-gray-500 mb-8 h-6">
            {billingMode === 'subscription' 
                ? "Pobieramy opłatę automatycznie co miesiąc/rok. Możesz anulować w każdej chwili." 
                : "Płacisz raz, korzystasz przez 30 dni lub rok. Brak automatycznego odnawiania."}
        </p>

        {/* KARTY CENOWE */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          
          {/* PLAN MIESIĘCZNY */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col relative overflow-hidden transition-transform hover:scale-[1.02] duration-300">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Miesięczny</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold text-gray-900">119 zł</span>
                <span className="text-gray-500">/ mies.</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">netto (146,37 zł brutto)</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600 text-sm">Pełny dostęp do wszystkich funkcji</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600 text-sm">Nielimitowane wyceny i projekty</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600 text-sm">Eksport PDF z Twoim logo</span>
              </li>
            </ul>

            <button 
                onClick={() => handleSubscribe(MONTHLY_PRICE_ID)} 
                disabled={!!loading} 
                className="w-full py-4 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
               {loading === MONTHLY_PRICE_ID ? (
                   <><Loader2 className="w-4 h-4 animate-spin" /> Przetwarzanie...</>
               ) : (
                   billingMode === 'subscription' ? 'Wybieram Subskrypcję' : 'Kup na 30 dni'
               )}
            </button>
          </div>

          {/* PLAN ROCZNY (Wyróżniony) */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-500 flex flex-col relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              NAJCZĘŚCIEJ WYBIERANY
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 uppercase tracking-wide">Roczny</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold text-gray-900">499 zł</span>
                <span className="text-gray-500">/ rok</span>
              </div>
              <p className="text-sm text-green-600 font-semibold mt-2">Oszczędzasz 929 zł rocznie!</p>
              <p className="text-xs text-gray-400">netto (613,77 zł brutto)</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-gray-700 font-medium text-sm">Wszystko co w pakiecie miesięcznym</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-gray-700 font-medium text-sm">Priorytetowe wsparcie techniczne</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-gray-700 font-medium text-sm">Gwarancja stałej ceny przy odnowieniu</span>
              </li>
            </ul>

            <div className="mt-auto">
                <div className="flex justify-center gap-3 text-xs text-blue-400 mb-3 uppercase font-semibold tracking-wider">
                    {billingMode === 'subscription' 
                        ? <span>Karta • Google Pay • Apple Pay</span> 
                        : <span>BLIK • Przelewy24 • Karty</span>}
                </div>
                <button 
                    onClick={() => handleSubscribe(YEARLY_PRICE_ID)} 
                    disabled={!!loading} 
                    className="w-full py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                {loading === YEARLY_PRICE_ID ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Przetwarzanie...</>
                ) : (
                    billingMode === 'subscription' ? 'Wybieram Roczny' : 'Kup na rok (Jednorazowo)'
                )}
                </button>
            </div>
          </div>

        </div>

        {error && (
            <div className="mt-8 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                <AlertTriangle size={20} />
                <p className="font-medium">{error}</p>
            </div>
        )}
      </div>

      {/* STOPKA PRAWNA */}
      <div className="pb-12 text-center max-w-2xl mx-auto px-4">
        <p className="text-[11px] leading-relaxed text-gray-400">
          Operatorem płatności i dostawcą usługi jest <strong>TREEO ART</strong> (właściciel marki Woodly Group).<br/>
          Faktura VAT zostanie wystawiona automatycznie po dokonaniu płatności.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;