// src/pages/LegalPage.jsx

import React from 'react';
// ✅ KROK 1: Importujemy dodatkowo useLocation
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalPage = ({ title, children }) => {
  const navigate = useNavigate();
  // ✅ KROK 2: Pobieramy informacje o bieżącej lokalizacji i historii
  const location = useLocation();

  const handleGoBack = () => {
    // ✅ KROK 3: Sprawdzamy, czy mamy historię, do której można wrócić
    // klucz 'default' oznacza, że to pierwsza strona w sesji
    if (location.key !== 'default') {
      navigate(-1); // Jeśli tak, cofnij
    } else {
      navigate('/'); // Jeśli nie, idź do strony głównej
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={handleGoBack} 
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Wróć
          </button>
        </div>
        <div className="prose lg:prose-lg max-w-none">
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;