import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext';

const CategoryPriceAlert = ({ category, setActiveTab }) => {
  const { materials } = useMaterials();

  // 1. Pobieramy elementy z danej kategorii
  const items = materials[category] || [];
  
  // 2. Sprawdzamy czy są jakieś z ceną 0 (lub pustą)
  // Ignorujemy te z nazwą "BRAK", bo one mogą mieć cenę 0
  const hasZeroPrices = items.some(item => {
    const isZero = !item.cena || parseFloat(item.cena) === 0;
    const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK');
    return isZero && isNotPlaceholder;
  });

  // Jeśli wszystko ma ceny > 0, nie wyświetlamy nic
  if (!hasZeroPrices) return null;

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2 shadow-sm">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
          <Info size={24} />
        </div>
        <div>
          <p className="text-blue-900 font-medium text-sm">
            Przed dodaniem elementów uaktualnij ceny w zakładce <strong>Zarządzaj Materiałami</strong>.
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('materials')} // To przenosi do zakładki MaterialsManager
        className="whitespace-nowrap px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm active:scale-95"
      >
        Uaktualnij ceny
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default CategoryPriceAlert;