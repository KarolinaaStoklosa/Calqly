import React, { useState } from 'react';
import { AlertTriangle, Wand2, CheckCircle2, Loader2 } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext';
import { DROPDOWN_DATA } from '../../data/dropdowns';

const CategoryPriceAlert = ({ category, extraCategories = [], setActiveTab }) => {
  const { materials, updateMaterials } = useMaterials();
  const [isFixing, setIsFixing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Łączymy główną kategorię z dodatkowymi
  const allTargetCategories = [category, ...extraCategories];

  // Sprawdzamy, czy w którejkolwiek kategorii są ceny 0zł
  const hasZeroPrices = allTargetCategories.some(cat => {
    const items = materials[cat] || [];
    return items.some(item => {
      const isZero = !item.cena || parseFloat(item.cena) === 0;
      const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK');
      return isZero && isNotPlaceholder;
    });
  });

  const handleAutoFix = async () => {
    const confirmMsg = `Czy chcesz zsynchronizować ceny dla: ${allTargetCategories.join(', ')}?\n\n` +
                       `• Brakujące ceny zostaną uzupełnione z bazy.\n` +
                       `• Nowe produkty zostaną dopisane.\n` +
                       `• Twoje własne wycenione produkty zostaną zachowane.\n` +
                       `• Nieaktualne pozycje z ceną 0zł zostaną usunięte.`;

    if (!window.confirm(confirmMsg)) return;

    setIsFixing(true);
    try {
      for (const cat of allTargetCategories) {
        const freshDataFromDB = DROPDOWN_DATA[cat] || [];
        const userItems = materials[cat] || [];
        
        const dbMap = new Map(freshDataFromDB.map(item => [item.nazwa.toLowerCase().trim(), item]));

        // A. Aktualizacja istniejących (jeśli user ma 0zł)
        let updatedList = userItems.map(userItem => {
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

        // B. Dodawanie nowości z bazy
        const userNames = new Set(updatedList.map(i => i.nazwa.toLowerCase().trim()));
        const newItems = freshDataFromDB.filter(dbItem => 
          !userNames.has(dbItem.nazwa.toLowerCase().trim())
        );

        // C. Łączenie i czyszczenie końcowe (usuwamy wszystko co zostało z ceną 0)
        const combinedList = [...updatedList, ...newItems];
        const finalList = combinedList.filter(item => {
          const price = parseFloat(item.cena);
          const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK');
          return price > 0 || !isNotPlaceholder;
        });

        await updateMaterials(cat, finalList);
      }

      setSuccessMsg(`Baza została pomyślnie zaktualizowana!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error("Błąd synchronizacji:", error);
      alert("Wystąpił błąd podczas aktualizacji danych.");
    } finally {
      setIsFixing(false);
    }
  };

  if (!hasZeroPrices && !successMsg) return null;

  return (
    <div className={`mb-6 rounded-xl border transition-all duration-300 shadow-sm overflow-hidden ${
      successMsg ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* LEWA STRONA: INFO */}
        <div className="flex items-start gap-4 w-full">
          <div className={`p-2.5 rounded-lg shrink-0 ${
            successMsg ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {successMsg ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div className="min-w-0">
            <h4 className={`text-sm font-bold ${successMsg ? 'text-green-800' : 'text-amber-800'}`}>
              {successMsg || "Wymagana aktualizacja bazy"}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${successMsg ? 'text-green-600' : 'text-amber-700/80'}`}>
              {successMsg || "Niektóre produkty nie mają cen lub ich nazwy są nieaktualne. Zsynchronizuj listę z bazą systemową."}
            </p>
          </div>
        </div>

        {/* PRAWA STRONA: PRZYCISKI (Zoptymalizowane pod Mobile) */}
        {!successMsg && (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleAutoFix}
              disabled={isFixing}
              className="
                inline-flex items-center justify-center gap-2
                w-full md:w-auto 
                px-6 py-3 md:py-2
                bg-gradient-to-r from-amber-600 to-orange-600 
                hover:from-amber-700 hover:to-orange-700 
                text-white text-sm md:text-xs font-bold 
                rounded-xl md:rounded-lg 
                transition-all shadow-md active:scale-95 
                disabled:opacity-50
              "
            >
              {isFixing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Wand2 size={16} />
              )}
              <span>Wczytaj i wyczyść listę</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className="
                inline-flex items-center justify-center
                w-full md:w-auto 
                px-6 py-3 md:py-2
                bg-white border-2 border-amber-200 
                hover:bg-amber-50 
                text-amber-700 text-sm md:text-xs font-bold 
                rounded-xl md:rounded-lg 
                transition-all
              "
            >
              Ustaw ręcznie
            </button>
          </div>
        )}
      </div>

      {/* Pasek postępu na samym dole */}
      {isFixing && (
        <div className="h-1 bg-amber-200 overflow-hidden">
          <div className="h-full bg-amber-600 animate-[progress_1.5s_infinite_linear] w-1/3 shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
        </div>
      )}
    </div>
  );
};

export default CategoryPriceAlert;