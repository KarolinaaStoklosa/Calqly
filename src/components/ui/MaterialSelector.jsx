import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { searchInDropdown } from '../../data/dropdowns';

const MaterialSelector = ({ 
  category,        // np. 'plytyMeblowe', 'okleina', 'fronty'
  value,           // Aktualnie wybrana nazwa (string)
  onChange,        // Funkcja zmieniająca stan
  placeholder = "Wybierz...", 
  disabled = false, 
  filterFn,        // Opcjonalna funkcja filtrująca (np. dla okleiny: ukryj usługi)
  className = ""   
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const wrapperRef = useRef(null);

  // 1. Ładowanie i filtrowanie danych z DROPDOWN_DATA
  useEffect(() => {
    // Pobieramy dane z pliku dropdowns.js na podstawie kategorii i wpisanego tekstu
    let results = searchInDropdown(category, searchTerm);

    // Jeśli przekazano dodatkowy filtr (np. ukrywanie usług w okleinie), stosujemy go
    if (filterFn) {
      results = results.filter(filterFn);
    }

    setOptions(results);
  }, [category, searchTerm, filterFn]);

  // 2. Zamykanie po kliknięciu poza komponentem
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Jeśli zamknęliśmy bez wyboru, czyścimy wyszukiwanie
        if (!isOpen) setSearchTerm(''); 
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, isOpen]);

  // 3. Obsługa wyboru
  const handleSelect = (nazwa) => {
    onChange(nazwa);
    setIsOpen(false);
    setSearchTerm(''); // Czyścimy pole wyszukiwania po wyborze
  };

  // 4. Czyszczenie (X)
  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className={`relative w-full ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`} ref={wrapperRef}>
      {/* INPUT / TRIGGER */}
      <div
        className={`
          flex items-center justify-between w-full px-3 py-2 
          border border-gray-300 rounded-lg bg-white shadow-sm transition-all duration-200
          ${isOpen ? 'ring-2 ring-brand-100 border-brand-500' : 'hover:border-gray-400'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-text'}
        `}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="flex items-center flex-1 min-w-0 gap-2">
          <Search size={16} className={`flex-shrink-0 ${isOpen ? 'text-brand-500' : 'text-gray-400'}`} />
          
          <input
            type="text"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent truncate"
            placeholder={value || placeholder} // Jeśli jest wartość, pokazujemy ją jako placeholder
            value={isOpen ? searchTerm : (value || '')} // Pokazujemy szukanie gdy otwarte, wartość gdy zamknięte
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => {
                if(!disabled) {
                    setSearchTerm(''); // Czyścimy input przy fokusie, żeby ułatwić nowe wyszukiwanie
                    setIsOpen(true);
                }
            }}
            disabled={disabled}
            autoComplete="off"
          />
        </div>
        
        {/* Przycisk czyszczenia */}
        <div className="flex items-center gap-1">
            {!disabled && value && (
                <button 
                    onClick={handleClear}
                    className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    title="Wyczyść"
                >
                    <X size={14} />
                </button>
            )}
            <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
        </div>
      </div>

      {/* LISTA ROZWIJANA (DROPDOWN) */}
      {/* Używamy z-[9999], aby przebić się przez inne warstwy */}
      {isOpen && !disabled && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 origin-top left-0">
          {options.length > 0 ? (
            <div className="py-1">
                {options.map((opt, idx) => (
                <div
                    key={`${opt.nazwa}-${idx}`}
                    className={`
                        px-3 py-2.5 text-sm cursor-pointer border-b border-gray-50 last:border-0 
                        flex justify-between items-center group transition-colors
                        ${opt.nazwa === value ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={() => handleSelect(opt.nazwa)}
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
                                {opt.cena.toFixed(2)} zł
                            </span>
                        )}
                        {opt.nazwa === value && <Check size={14} className="text-brand-600" />}
                    </div>
                </div>
                ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                <Search size={20} className="opacity-20" />
                <span>Nie znaleziono "{searchTerm}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;