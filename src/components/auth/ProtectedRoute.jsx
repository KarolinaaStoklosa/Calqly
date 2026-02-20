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

// STATUS OSTATECZNY: AuthContext ustalił, czy dostęp jest ważny (również jednorazowy)
  const hasValidAccess =
    subscriptionStatus === 'active' ||
    subscriptionStatus === 'trialing' ||
    subscriptionStatus === 'manual_paid';
  
  // Czy trasa to jedna ze stron płatności?
  const isSubscriptionRoute = ['/subscribe', '/success', '/cancel'].includes(location.pathname);

  // 1. BLOKADA DOSTĘPU DO APLIKACJI: Użytkownik bez aktywnego dostępu próbuje wejść do /
  if (!hasValidAccess && !isSubscriptionRoute) {
    return <Navigate to="/subscribe" replace />;
  }

  // 2. BLOKADA DOSTĘPU DO PŁATNOŚCI: Użytkownik z aktywnym dostępem próbuje wejść na /subscribe
  const isFullyActive = subscriptionStatus === 'active' || subscriptionStatus === 'manual_paid'; 

if (isFullyActive && isSubscriptionRoute) {
  return <Navigate to="/" replace />;
}

  return children;
};

export default ProtectedRoute;
