// src/components/ExpirationNotifier.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpirationNotifier = () => {
  const { subscriptionStatus, userData } = useAuth();
  
  if ((subscriptionStatus !== 'active' && subscriptionStatus !== 'manual_paid') || !userData?.accessExpiresAt) {
    return null;
  }

  const expiresAt = userData.accessExpiresAt.toDate();
  const now = new Date();
  const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

  if (daysLeft > 5 || daysLeft <= 0) {
    return null;
  }

  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 m-6 rounded-r-lg shadow-md" role="alert">
      <div className="flex items-center">
        <Info className="w-6 h-6 mr-3" />
        <div>
            <p className="font-bold">
            Twój dostęp jednorazowy wygasa za {daysLeft} {daysLeft === 1 ? 'dzień' : 'dni'}. 
            </p>
            <Link to="/subscribe" className="text-sm font-semibold underline hover:text-amber-900">Odnów teraz</Link>, aby uniknąć przerwy w dostępie.
        </div>
      </div>
    </div>
  );
};

export default ExpirationNotifier;