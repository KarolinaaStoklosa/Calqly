import React, { useState } from 'react';
import { AlertTriangle, Wand2, CheckCircle2, Loader2 } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext';
import { DROPDOWN_DATA } from '../../data/dropdowns';

const CategoryPriceAlert = ({ category, extraCategories = [], setActiveTab }) => {
  const { materials, updateMaterials } = useMaterials();
  const [isFixing, setIsFixing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Łączymy główną kategorię z dodatkowymi (np. dla korpusów: płyty + fronty)
  const allTargetCategories = [category, ...extraCategories];

  // Sprawdzamy, czy w którejkolwiek z tych kategorii są ceny 0zł
  const hasZeroPrices = allTargetCategories.some(cat => {
    const items = materials[cat] || [];
    return items.some(item => {
      const isZero = !item.cena || parseFloat(item.cena) === 0;
      const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK');
      return isZero && isNotPlaceholder;
    });
  });

  const handleAutoFix = async () => {
    const confirmMsg = `Czy chcesz zsynchronizować ceny dla kategorii: ${allTargetCategories.join(', ')}?\n\n` +
                       `1. Brakujące ceny zostaną pobrane z bazy.\n` +
                       `2. Twoje własne wycenione produkty zostaną zachowane.\n` +
                       `3. Nieaktualne pozycje (cena 0zł i brak w bazie) zostaną usunięte.`;

    if (!window.confirm(confirmMsg)) return;

    setIsFixing(true);
    try {
      // Iterujemy po wszystkich powiązanych kategoriach
      for (const cat of allTargetCategories) {
        const freshDataFromDB = DROPDOWN_DATA[cat] || [];
        const userItems = materials[cat] || [];
        
        // Mapa nowej bazy dla szybkiego wyszukiwania
        const dbMap = new Map(freshDataFromDB.map(item => [item.nazwa.toLowerCase().trim(), item]));

        // A. Aktualizacja: Jeśli jest w bazie i user ma 0zł -> wstawiamy cenę z bazy
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

        // B. Nowości: Szukamy rzeczy w bazie, których użytkownik w ogóle nie ma
        const userNames = new Set(updatedList.map(i => i.nazwa.toLowerCase().trim()));
        const newItems = freshDataFromDB.filter(dbItem => 
          !userNames.has(dbItem.nazwa.toLowerCase().trim())
        );

        // C. Łączenie i czyszczenie: usuwamy wszystko co ma cenę 0 (i nie jest placeholderem "BRAK")
        const combinedList = [...updatedList, ...newItems];
        const finalList = combinedList.filter(item => {
          const price = parseFloat(item.cena);
          const isNotPlaceholder = !item.nazwa.toUpperCase().includes('BRAK');
          return price > 0 || !isNotPlaceholder;
        });

        // D. Zapis do bazy dla danej kategorii
        await updateMaterials(cat, finalList);
      }

      setSuccessMsg(`Zaktualizowano pomyślnie!`);
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
    <div className={`mb-6 rounded-xl border transition-all duration-300 ${
      successMsg ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${
            successMsg ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {successMsg ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <h4 className={`text-sm font-bold ${successMsg ? 'text-green-800' : 'text-amber-800'}`}>
              {successMsg || "Wymagana aktualizacja cen"}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              {successMsg || "Niektóre materiały (płyty/fronty) nie mają cen. Wczytaj dane rynkowe, aby kalkulacja była poprawna."}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {!successMsg && (
            <>
              <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className="flex-1 md:flex-none whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isFixing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Wczytaj ceny i wyczyść
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className="flex-1 md:flex-none whitespace-nowrap px-4 py-2 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-50 transition-all"
              >
                Ustaw ręcznie
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPriceAlert;