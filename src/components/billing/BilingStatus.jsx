import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// ✅ Komponent przyjmuje nowy prop: `variant` z domyślną wartością 'card'
const BillingStatus = ({ variant = 'card' }) => {
  const { subscriptionStatus, userData } = useAuth();
  const navigate = useNavigate();
  const [isPortalLoading, setIsPortalLoading] = React.useState(false);

  const handleManageSubscription = async () => {
    // Logika wywołująca createPortalLink
    const functions = getFunctions();
    const createPortalLink = httpsCallable(functions, 'createPortalLink');
    try {
      const { data } = await createPortalLink();
      window.location.href = data.url;
    } catch (error) {
      console.error("Błąd otwierania portalu Stripe:", error);
      alert("Nie można otworzyć portalu zarządzania subskrypcją. Spróbuj ponownie później.");
    }
  };

  const renderContent = () => {
    const { accessExpiresAt } = userData || {};
    const trial_end = userData?.subscription?.trial_end;
    
    // Logika renderowania jest teraz opakowana w style zależne od wariantu
    const baseClasses = {
        container: variant === 'card' ? "p-6 bg-white rounded-lg shadow-md border" : "px-4 py-2 text-sm",
        title: variant === 'card' ? "text-lg font-semibold text-gray-800 mb-2" : "font-semibold",
        text: variant === 'card' ? "text-gray-600" : "text-gray-600 dark:text-gray-300",
        button: variant === 'card' ? "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" : "text-blue-600 font-semibold mt-1"
    };

    switch (subscriptionStatus) {
      case 'trialing':
        return (
          <div className={baseClasses.container}>
            {variant === 'card' && <h3 className={baseClasses.title}>Status Twojego Konta</h3>}
            <p className={baseClasses.text}>
              Okres próbny aktywny do: <strong>{trial_end?.toDate().toLocaleDateString('pl-PL')}</strong>.
            </p>
            <button onClick={handleManageSubscription} disabled={isPortalLoading} className={baseClasses.button}>
              {isPortalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Zarządzaj'}
            </button>
          </div>
        );
      
      case 'active':
        if (accessExpiresAt) {
          return (
            <div className={baseClasses.container}>
              {variant === 'card' && <h3 className={baseClasses.title}>Status Twojego Konta</h3>}
              <p className={baseClasses.text}>Dostęp jednorazowy do: <strong>{accessExpiresAt?.toDate().toLocaleDateString('pl-PL')}</strong></p>
            </div>
          );
        }
        return (
          <div className={baseClasses.container}>
            {variant === 'card' && <h3 className={baseClasses.title}>Status Twojego Konta</h3>}
            <p className={baseClasses.text}>Subskrypcja aktywna</p>
            <button onClick={handleManageSubscription} disabled={isPortalLoading} className={baseClasses.button}>
              {isPortalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Zarządzaj'}
            </button>
          </div>
        );

      default:
        return (
          <div className={baseClasses.container}>
            {variant === 'card' && <h3 className={baseClasses.title}>Status Twojego Konta</h3>}
            <p className={baseClasses.text}>Brak aktywnego planu</p>
            <button onClick={() => navigate('/subscribe')} className={baseClasses.button}>Wykup dostęp</button>
          </div>
        );
    }
  }

  return renderContent();
};

export default BillingStatus;