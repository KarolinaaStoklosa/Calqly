
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Info } from 'lucide-react';

const ExpirationNotifier = () => {
  // Ponownie, zakładamy że AuthContext dostarcza nam datę wygaśnięcia
  const { subscriptionStatus, currentUserData } = useAuth();
  
  if (subscriptionStatus !== 'active' || !currentUserData?.accessExpiresAt) {
    return null; // Nie pokazuj nic, jeśli to nie jest dostęp jednorazowy
  }

  const expiresAt = currentUserData.accessExpiresAt.toDate();
  const now = new Date();
  const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

  // Pokazuj baner tylko, jeśli zostało 5 dni lub mniej
  if (daysLeft > 5 || daysLeft < 0) {
    return null;
  }

  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4" role="alert">
      <div className="flex items-center">
        <Info className="w-5 h-5 mr-3" />
        <p className="font-bold">
          Twój dostęp jednorazowy wygasa za {daysLeft} {daysLeft === 1 ? 'dzień' : 'dni'}. 
          <a href="/subscribe" className="underline ml-2">Odnów teraz</a>, aby uniknąć przerwy w dostępie.
        </p>
      </div>
    </div>
  );
};

export default ExpirationNotifier;