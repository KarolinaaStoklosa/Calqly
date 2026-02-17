import React, { useState } from 'react';
import { AlertTriangle, Wand2, CheckCircle2, Loader2 } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext';
import { DROPDOWN_DATA } from '../../data/dropdowns';

const CategoryPriceAlert = ({ category, extraCategories = [], setActiveTab }) => {
  const { materials, updateMaterials } = useMaterials();
  const [isFixing, setIsFixing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const allTargetCategories = [category, ...extraCategories];

  // Sprawdzamy, czy cokolwiek wymaga naprawy (cena 0 i nie jest to "BRAK")
  const hasZeroPrices = allTargetCategories.some(cat => {
    const items = materials[cat] || [];
    return items.some(item => {
      const isZero = !item.cena || parseFloat(item.cena) === 0;
      const upperName = item.nazwa?.toUpperCase() || '';
      const isPlaceholder = upperName.includes('BRAK') || item.kategoria === 'brak' || item.typ === 'brak';
      const isSystemZero = item.kategoria === 'korpus' || item.typ === 'korpus';
      const isAllowedZero =
        (cat === 'okleina' && (upperName.includes('BRAK OKLEINY') || isPlaceholder)) ||
        ((cat === 'fronty' || cat === 'tyly') && isSystemZero);
      return isZero && !isAllowedZero;
    });
  });

  const handleAutoFix = async () => {
    const confirmMsg = `Produkcyjna synchronizacja danych dla: ${allTargetCategories.join(', ')}.\n\n` +
                       `• Uzgodnienie cen i kategorii usług.\n` +
                       `• Usunięcie błędnych wpisów 0zł.\n` +
                       `• Zachowanie Twoich unikalnych pozycji.\n\n` +
                       `Czy kontynuować?`;

    if (!window.confirm(confirmMsg)) return;

    setIsFixing(true);
    try {
      for (const cat of allTargetCategories) {
        const freshDataFromDB = DROPDOWN_DATA[cat] || [];
        const userItems = materials[cat] || [];
        
        // Mapa dla szybkiego dostępu (klucze w małych literach dla bezpieczeństwa)
        const dbMap = new Map(freshDataFromDB.map(item => [item.nazwa.toLowerCase().trim(), item]));

        // 1. Przetworzenie istniejących elementów użytkownika
        let updatedList = userItems.map(userItem => {
          const cleanName = userItem.nazwa?.toLowerCase().trim();
          const dbMatch = dbMap.get(cleanName);

          // Jeśli element jest w bazie i ma cenę 0 lub brak ceny -> aktualizujemy
          if (dbMatch && (!userItem.cena || parseFloat(userItem.cena) === 0)) {
            return {
              ...userItem,
              cena: Number(dbMatch.cena) || 0,
              // Gwarancja braku undefined dla Firebase:
              opis: dbMatch.opis || userItem.opis || "",
              kategoria: dbMatch.kategoria || userItem.kategoria || "material"
            };
          }
          
          // Jeśli nie ma go w bazie, upewniamy się tylko, że nie ma undefined
          return {
            ...userItem,
            cena: Number(userItem.cena) || 0,
            opis: userItem.opis || "",
            kategoria: userItem.kategoria || "material"
          };
        });

        // 2. Dodanie brakujących elementów z bazy (których użytkownik w ogóle nie ma)
        const userNames = new Set(updatedList.map(i => i.nazwa?.toLowerCase().trim()));
        const newItems = freshDataFromDB
          .filter(dbItem => !userNames.has(dbItem.nazwa.toLowerCase().trim()))
          .map(newItem => ({
            nazwa: newItem.nazwa,
            cena: Number(newItem.cena) || 0,
            opis: newItem.opis || "",
            kategoria: newItem.kategoria || "material"
          }));

        // 3. Finalne łączenie, filtrowanie i sanityzacja danych
        const finalList = [...updatedList, ...newItems]
          .filter(item => {
            const price = parseFloat(item.cena);
            const nameUpper = item.nazwa?.toUpperCase() || "";
            // Zostawiamy tylko to co ma cenę > 0 LUB jest placeholderem "BRAK"
            return price > 0 || nameUpper.includes('BRAK');
          })
          .map(item => {
            // DEEP CLEAN: Usuwa absolutnie każde pole undefined przed zapisem do Firebase
            return Object.fromEntries(
              Object.entries(item).filter(([_, v]) => v !== undefined)
            );
          });

        // Wywołanie zapisu do Firebase przez Context
        await updateMaterials(cat, finalList);
      }

      setSuccessMsg(`Dane zaktualizowane pomyślnie!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error("Błąd produkcyjny synchronizacji:", error);
      alert("Błąd krytyczny: " + (error.message || "Sprawdź połączenie z bazą."));
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
        <div className="flex items-start gap-4 w-full">
          <div className={`p-2.5 rounded-lg shrink-0 ${
            successMsg ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {successMsg ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div className="min-w-0">
            <h4 className={`text-sm font-bold ${successMsg ? 'text-green-800' : 'text-amber-800'}`}>
              {successMsg || "Wykryto brakujące ceny"}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${successMsg ? 'text-green-600' : 'text-amber-700/80'}`}>
              {successMsg || "Niektóre materiały lub usługi oklejania mają cenę 0zł. Kliknij aktualizuj, aby pobrać dane rynkowe."}
            </p>
          </div>
        </div>

        {!successMsg && (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleAutoFix}
              disabled={isFixing}
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 md:py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm md:text-xs font-bold rounded-xl md:rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isFixing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              <span>Aktualizuj wszystko</span>
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 md:py-2 bg-white border-2 border-amber-200 hover:bg-amber-50 text-amber-700 text-sm md:text-xs font-bold rounded-xl md:rounded-lg transition-all"
            >
              Ustaw ręcznie
            </button>
          </div>
        )}
      </div>
      {isFixing && (
        <div className="h-1 bg-amber-200 overflow-hidden">
          <div className="h-full bg-amber-600 animate-[progress_1.5s_infinite_linear] w-1/3" />
        </div>
      )}
    </div>
  );
};

export default CategoryPriceAlert;