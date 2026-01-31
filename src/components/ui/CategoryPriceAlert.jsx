import React, { useState } from 'react';
import { Info, Wand2, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext';
import { DROPDOWN_DATA } from '../../data/dropdowns';

const CategoryPriceAlert = ({ category, setActiveTab }) => {
  const { materials, updateMaterials } = useMaterials();
  const [isFixing, setIsFixing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Pobieramy elementy użytkownika z danej kategorii
  const userItems = materials[category] || [];
  
  // 2. Sprawdzamy czy są jakieś z ceną 0 (lub pustą) - to decyduje o wyświetlaniu Alertu
  const hasZeroPrices = userItems.some(item => {
    const isZero = !item.cena || parseFloat(item.cena) === 0;
    const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK'); 
    return isZero && isNotPlaceholder;
  });

  // 3. Inteligentna aktualizacja i czyszczenie
  const handleAutoFix = async () => {
    const confirmMsg = `Czy chcesz zsynchronizować ceny w kategorii "${category}"?\n\n` +
                       `• Brakujące ceny (0zł) zostaną uzupełnione.\n` +
                       `• Nowe produkty z bazy zostaną dodane.\n` +
                       `• Twoje własne wycenione produkty zostaną zachowane.\n` +
                       `• Nieaktualne pozycje z ceną 0zł zostaną usunięte.`;

    if (!window.confirm(confirmMsg)) return;

    setIsFixing(true);
    try {
      const freshDataFromDB = DROPDOWN_DATA[category] || [];
      
      // Mapa nowej bazy (klucz: nazwa małe litery)
      const dbMap = new Map(freshDataFromDB.map(item => [item.nazwa.toLowerCase().trim(), item]));

      // Kopia listy użytkownika
      let updatedList = [...userItems];

      // A. Aktualizacja istniejących: jeśli w bazie jest taka nazwa i cena u usera = 0 -> wstaw cenę z bazy
      updatedList = updatedList.map(userItem => {
        const cleanName = userItem.nazwa.toLowerCase().trim();
        const dbMatch = dbMap.get(cleanName);

        if (dbMatch && (!userItem.cena || parseFloat(userItem.cena) === 0)) {
          return { 
            ...userItem, 
            cena: dbMatch.cena, 
            opis: dbMatch.opis || userItem.opis 
          };
        }
        return userItem;
      });

      // B. Nowości: produkty z bazy, których użytkownik nie ma w ogóle
      const userNames = new Set(updatedList.map(i => i.nazwa.toLowerCase().trim()));
      const newItems = freshDataFromDB.filter(dbItem => 
        !userNames.has(dbItem.nazwa.toLowerCase().trim())
      );

      // C. Łączenie i ostateczne czyszczenie pozycji 0zł
      const combinedList = [...updatedList, ...newItems];
      
      const finalList = combinedList.filter(item => {
        const price = parseFloat(item.cena);
        const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK');
        
        // Zostawiamy tylko produkty z ceną > 0 (własne lub zaktualizowane)
        // oraz ewentualne wiersze typu "Brak" jeśli ich używasz
        return price > 0 || !isNotPlaceholder;
      });

      // D. Zapis do Firebase
      await updateMaterials(category, finalList);

      setSuccessMsg(`Zaktualizowano! Twoja lista jest teraz aktualna.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error("Błąd aktualizacji cen:", error);
      alert("Wystąpił błąd podczas wczytywania danych rynkowych.");
    } finally {
      setIsFixing(false);
    }
  };

  if (!hasZeroPrices && !successMsg) return null;

  return (
    <div className={`
      relative overflow-hidden mb-6 rounded-xl border transition-all duration-300
      ${successMsg ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}
    `}>
      <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`
            p-2.5 rounded-lg flex-shrink-0
            ${successMsg ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}
          `}>
            {successMsg ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
          </div>
          
          <div>
            <h4 className={`text-sm font-bold ${successMsg ? 'text-green-800' : 'text-amber-800'}`}>
              {successMsg || `Niekompletne ceny: ${category}`}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${successMsg ? 'text-green-600' : 'text-amber-700/80'}`}>
              {successMsg ? (
                  successMsg
              ) : (
                  <>
                    Niektóre materiały w tej kategorii mają cenę <strong>0.00 zł</strong>.<br className="hidden md:block" />
                    Kliknij przycisk poniżej, aby zsynchronizować listę z aktualnymi cenami rynkowymi.
                  </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
          {!successMsg && (
            <>
              <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className="whitespace-nowrap px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isFixing ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
                Wczytaj i wyczyść listę
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className="whitespace-nowrap px-5 py-2.5 bg-white border border-amber-200 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-all"
              >
                Ustaw ręcznie
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Pasek postępu przy fixowaniu */}
      {isFixing && (
        <div className="absolute bottom-0 left-0 h-1 bg-amber-500 animate-progress-indefinite w-full" />
      )}
    </div>
  );
};


export default CategoryPriceAlert;