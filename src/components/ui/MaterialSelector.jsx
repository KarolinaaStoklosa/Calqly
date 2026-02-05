import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { useMaterials } from '../../context/MaterialContext'; // ✅ Używamy kontekstu
import { DROPDOWN_DATA } from '../../data/dropdowns'; // Dane statyczne jako backup

const MaterialSelector = ({ 
  category,        // np. 'plytyMeblowe', 'okleina', 'fronty'
  value,           // Aktualnie wybrana nazwa (string)
  onChange,        // Funkcja zmieniająca stan
  placeholder = "Wybierz...", 
  disabled = false, 
  filterFn,        // Opcjonalna funkcja filtrująca
  className = ""   
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  
  // ✅ 1. Pobieramy aktualne dane z bazy (te które edytujesz w MaterialsManager)
  const { materials } = useMaterials();

  // ✅ 2. Łączymy dane: Baza Użytkownika ma priorytet nad plikiem statycznym
  // Używamy useMemo dla wydajności, żeby nie liczyć tego przy każdym kliknięciu
  const allOptions = useMemo(() => {
    // a) Pobierz listę z kontekstu (to co widać w MaterialsManager)
    const userItems = materials[category] || [];
    
    // b) Pobierz listę statyczną (jako fallback, jeśli kontekst jeszcze się ładuje)
    const staticItems = DROPDOWN_DATA[category] || [];

    // Jeśli kontekst ma dane, używamy ich (bo są nowsze/edytowane). 
    // Jeśli nie (np. błąd ładowania), bierzemy statyczne.
    // Uwaga: MaterialsContext w Twoim kodzie już łączy te dane przy starcie, 
    // więc `userItems` powinno zawierać WSZYSTKO (stare + nowe).
    let items = userItems.length > 0 ? userItems : staticItems;

    // c) Filtrowanie po wpisanej frazie
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      items = items.filter(item => 
        (item.nazwa && item.nazwa.toLowerCase().includes(lowerTerm)) ||
        (item.opis && item.opis.toLowerCase().includes(lowerTerm))
      );
    }

    // d) Opcjonalne dodatkowe filtrowanie (np. ukrywanie usług)
    if (filterFn) {
      items = items.filter(filterFn);
    }

    return items;
  }, [materials, category, searchTerm, filterFn]);

  // Zamknięcie po kliknięciu poza
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Wybór elementu
  const handleSelect = (nazwa) => {
    onChange(nazwa);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {/* Przycisk otwierający */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-left bg-white border rounded-lg transition-all
          ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-200 text-gray-400' : 'cursor-pointer hover:border-brand-400 focus:ring-2 focus:ring-brand-500/20'}
          ${isOpen ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-300'}
        `}
      >
        <span className={`block truncate text-sm ${value ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`ml-2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Lista rozwijana */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top">
          
          {/* Pasek wyszukiwania */}
          <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                autoFocus
                className="w-full pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Lista wyników */}
          <div className="overflow-y-auto flex-1 p-1 scrollbar-thin scrollbar-thumb-gray-200">
            {allOptions.length > 0 ? (
              <div className="space-y-0.5">
                {allOptions.map((opt, idx) => (
                  <div
                    key={`${opt.id || idx}-${opt.nazwa}`} // Używamy ID jeśli jest, lub indeksu
                    onClick={() => handleSelect(opt.nazwa)}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm group transition-colors
                      ${opt.nazwa === value ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    <div className="flex flex-col min-w-0 mr-2">
                        <span className="font-medium truncate">{opt.nazwa}</span>
                        {/* Wyświetlamy opis tylko jeśli istnieje i nie jest pusty */}
                        {opt.opis && <span className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{opt.opis}</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Cena wyświetlana tylko > 0 */}
                        {opt.cena > 0 && (
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:text-gray-700">
                                {typeof opt.cena === 'number' ? opt.cena.toFixed(2) : parseFloat(opt.cena).toFixed(2)} zł
                            </span>
                        )}
                        {opt.nazwa === value && <Check size={14} className="text-brand-600" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                <Search size={24} className="opacity-20 mb-2" />
                <p className="text-xs">Nie znaleziono materiału.</p>
                {/* Opcjonalnie: przycisk dodawania nowego, jeśli chcesz */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;