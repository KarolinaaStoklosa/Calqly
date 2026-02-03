// src/components/layout/CookieConsentBanner.jsx

import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm text-white p-4 shadow-lg z-[9999] flex items-center justify-center gap-4 flex-wrap">
      <Cookie className="w-6 h-6 text-brand-400 flex-shrink-0" />
      <p className="text-sm text-center">
        Używamy plików cookie, aby zapewnić najlepszą jakość korzystania z naszej aplikacji. 
        <Link to="/polityka-prywatnosci" className="underline hover:text-brand-300 ml-1">Dowiedz się więcej</Link>.
      </p>
      <button 
        onClick={handleAccept}
        // ✅ ZMIANA: Zastosowano style z przycisku "Nowy Projekt"
        className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold shadow-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 transform hover:scale-105 text-sm"
      >
        Rozumiem i akceptuję
      </button>
    </div>
  );
};

export default CookieConsentBanner;