// src/components/common/MaterialSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { searchInDropdown } from '../../data/dropdowns';

const MaterialSelector = ({ value, onChange, category = 'plytyMeblowe', placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const wrapperRef = useRef(null);

  // Pobierz opcje na start i przy zmianie wyszukiwania
  useEffect(() => {
    const results = searchInDropdown(category, searchTerm);
    setOptions(results);
  }, [category, searchTerm]);

  // Zamknij przy kliknięciu poza
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (nazwa) => {
    onChange(nazwa);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={wrapperRef}>
      {/* Input / Trigger */}
      <div
        className={`flex items-center justify-between w-full p-2 border border-gray-300 rounded bg-white 
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-text focus-within:ring-2 focus-within:ring-blue-500'}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-500 bg-transparent truncate"
            placeholder={value || placeholder || "Szukaj..."}
            value={isOpen ? searchTerm : value || ''}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
                if(!disabled) {
                    setSearchTerm(''); 
                    setIsOpen(true);
                }
            }}
            disabled={disabled}
          />
        </div>
        
        {!disabled && value && !isOpen ? (
             <X 
             size={16} 
             className="text-gray-400 cursor-pointer hover:text-red-500 ml-1 flex-shrink-0" 
             onClick={(e) => {
               e.stopPropagation();
               onChange('');
             }} 
           />
        ) : (
             <ChevronDown size={16} className="text-gray-400 ml-1 flex-shrink-0" />
        )}
      </div>

      {/* Lista Rozwijana */}
      {isOpen && !disabled && (
        <div className="absolute z-[999] w-full mt-1 bg-white border border-gray-200 rounded shadow-xl max-h-60 overflow-y-auto min-w-[200px]">
          {options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt.nazwa}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-0 ${opt.nazwa === value ? 'bg-blue-100 font-medium' : ''}`}
                onClick={() => handleSelect(opt.nazwa)}
              >
                <div className="font-medium text-gray-800">{opt.nazwa}</div>
                {opt.cena > 0 && <div className="text-xs text-gray-500">Cena: {opt.cena.toFixed(2)} zł</div>}
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center italic">Brak wyników</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;