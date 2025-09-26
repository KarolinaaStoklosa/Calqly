import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
   const { currentUser, subscriptionStatus, loading, userData } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ SUPER PROSTA I CZYTELNA LOGIKA
  const hasAccess = ['active', 'trialing'].includes(subscriptionStatus);
  const isSubscriptionRoute = ['/subscribe', '/success', '/cancel'].includes(location.pathname);

  const isRecurringSubscription = hasAccess && !userData?.accessExpiresAt;

  // Przekieruj użytkownika z subskrypcją cykliczną, który próbuje wejść na stronę płatności
  if (isRecurringSubscription && isSubscriptionRoute) {
    return <Navigate to="/" replace />;
  }
  
  // Przekieruj użytkownika bez dostępu, który próbuje wejść do aplikacji
  if (!hasAccess && !isSubscriptionRoute) {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
};

export default ProtectedRoute;
