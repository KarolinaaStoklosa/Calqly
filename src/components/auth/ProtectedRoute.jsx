import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, subscriptionStatus, loading } = useAuth();
  const location = useLocation();

  // Krok 1: Jeśli weryfikujemy stan, zawsze pokazuj ładowanie
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Krok 2: Jeśli nie ma użytkownika, zawsze przekieruj do logowania
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ NOWA, UPROSZCZONA LOGIKA
  // Definiujemy, co to znaczy mieć aktywną subskrypcję
  const hasActiveSubscription = ['active', 'trialing'].includes(subscriptionStatus);
  
  // Definiujemy, czy użytkownik jest na ścieżce związanej z procesem płatności
  const isSubscriptionRoute = ['/subscribe', '/success', '/cancel'].includes(location.pathname);

  // Scenariusz 1: Użytkownik ma subskrypcję i próbuje wejść na stronę płatności.
  // Akcja: Przekieruj go do głównej aplikacji, bo nie musi już nic kupować.
  if (hasActiveSubscription && isSubscriptionRoute) {
    return <Navigate to="/" replace />;
  }
  
  // Scenariusz 2: Użytkownik NIE ma subskrypcji i próbuje wejść do aplikacji.
  // Akcja: Przekieruj go na stronę płatności, bo musi najpierw kupić dostęp.
  if (!hasActiveSubscription && !isSubscriptionRoute) {
    return <Navigate to="/subscribe" replace />;
  }

  // Jeśli żaden z powyższych scenariuszy nie jest prawdziwy, to znaczy, że wszystko jest w porządku.
  // (np. ma subskrypcję i jest w aplikacji, lub nie ma subskrypcji i jest na stronie płatności)
  return children;
};

export default ProtectedRoute;