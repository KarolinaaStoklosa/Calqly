import React, { useState } from 'react';
import { Info, ArrowRight, Wand2, CheckCircle2, Loader2 } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext';
import { DROPDOWN_DATA } from '../../data/dropdowns'; // Upewnij się, że ścieżka jest poprawna

const CategoryPriceAlert = ({ category, setActiveTab }) => {
  const { materials, updateMaterials } = useMaterials();
  const [isFixing, setIsFixing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Pobieramy elementy użytkownika z danej kategorii
  const userItems = materials[category] || [];
  
  // 2. Sprawdzamy czy są jakieś z ceną 0 (lub pustą) - to decyduje o wyświetlaniu Alertu
  const hasZeroPrices = userItems.some(item => {
    const isZero = !item.cena || parseFloat(item.cena) === 0;
    const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK'); // Ignorujemy "Brak frontu" itp.
    return isZero && isNotPlaceholder;
  });

  // Logika "Naprawiania" cen
  const handleAutoFix = async () => {
    if (!window.confirm(`Czy chcesz uzupełnić brakujące ceny w kategorii "${category}" średnimi stawkami rynkowymi?\n\nTwoje własne ceny NIE zostaną nadpisane.`)) {
        return;
    }

    setIsFixing(true);
    try {
        // Pobieramy wzorzec rynkowy
        const marketItems = DROPDOWN_DATA[category] || [];
        let updatedCount = 0;

        // Tworzymy nową listę, mapując po starej
        const newList = userItems.map(userItem => {
            // Jeśli cena jest już ustawiona (> 0), zostawiamy ją w spokoju!
            if (userItem.cena && parseFloat(userItem.cena) > 0) {
                return userItem;
            }

            // Jeśli cena to 0, szukamy odpowiednika w bazie rynkowej
            // Szukamy po nazwie (ignoruąc wielkość liter)
            const marketMatch = marketItems.find(
                m => m.nazwa.toLowerCase().trim() === userItem.nazwa.toLowerCase().trim()
            );

            if (marketMatch && marketMatch.cena > 0) {
                updatedCount++;
                return {
                    ...userItem,
                    cena: marketMatch.cena,
                    // Opcjonalnie możemy dodać dopisek w opisie, skąd cena, ale to może śmiecić
                    // opis: userItem.opis || "Cena rynkowa" 
                };
            }

            return userItem;
        });

        if (updatedCount > 0) {
            await updateMaterials(category, newList);
            setSuccessMsg(`Zaktualizowano ${updatedCount} pozycji!`);
            // Komunikat zniknie sam po chwili, bo hasZeroPrices zmieni się na false (jeśli wszystko naprawiliśmy)
            // lub zostanie, jeśli czegoś nie było w bazie rynkowej.
        } else {
            alert("Nie znaleziono cen rynkowych dla brakujących pozycji w tej kategorii.");
        }

    } catch (error) {
        console.error("Błąd aktualizacji cen:", error);
        alert("Wystąpił błąd podczas aktualizacji.");
    } finally {
        setIsFixing(false);
    }
  };

  // Jeśli wszystko ma ceny > 0, Alert znika całkowicie (wymóg: "niech przycisku nie będzie")
  if (!hasZeroPrices) return null;

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm animate-in slide-in-from-top-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LEWA STRONA: IKONA I TEKST */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
            {successMsg ? <CheckCircle2 size={24} className="text-green-600" /> : <Info size={24} />}
          </div>
          <div>
            <p className="text-blue-900 font-medium text-sm">
              {successMsg ? (
                  <span className="text-green-700 font-bold">{successMsg}</span>
              ) : (
                  <>
                    Niektóre materiały mają cenę <strong>0,00 zł</strong>.
                    <span className="block text-blue-700/80 text-xs mt-0.5">
                        Kalkulacja projektu będzie błędna.
                    </span>
                  </>
              )}
            </p>
          </div>
        </div>

        {/* PRAWA STRONA: PRZYCISKI */}
        {!successMsg && (
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            
            {/* PRZYCISK 1: AUTOMAT (CENY RYNKOWE) */}
            <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className="whitespace-nowrap px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
                {isFixing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Wczytaj ceny rynkowe
            </button>

            {/* PRZYCISK 2: RĘCZNIE */}
            <button
                onClick={() => setActiveTab('materials')}
                className="whitespace-nowrap px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                Ustaw ręcznie
                <ArrowRight size={14} />
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPriceAlert;