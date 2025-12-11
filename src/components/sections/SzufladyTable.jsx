import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Package2, ListFilter } from 'lucide-react';
import { useProjectSection, useProject } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';

const SzufladyTable = () => {
  const { isEditMode } = useProject();
  const { items: szuflady, addItem, updateItem, removeItem, total } = useProjectSection('szuflady');
  const { calculateSzuflada, formatPrice } = useCalculator();
  const { materials } = useMaterials();
  const szufladyOptions = materials.szuflady || [];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddSzuflada = () => {
    const newSzuflada = { rodzaj: szufladyOptions[0]?.nazwa || '', ilość: '1', cenaJednostkowa: 0, cenaCałość: 0 };
    addItem(newSzuflada);
  };
  
  const handleUpdateSzuflada = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveSzuflada = (id) => removeItem(id);

  // Auto-kalkulacja przy zmianach
  useEffect(() => {
    szuflady.forEach(szuflada => {
      const calculated = calculateSzuflada(szuflada);
      const hasChanges = Object.keys(calculated).some(key => szuflada[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(szuflada.id, calculated);
      }
    });
  }, [szuflady.map(s => `${s.rodzaj}-${s.ilość}`).join('|')]);

  const totalQuantity = szuflady.reduce((sum, s) => sum + (parseFloat(s.ilość) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-6 pb-24">
      {/* Header Sekcji */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                <span className="text-xl">🗂️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Systemy Szuflad</h1>
              <p className="text-orange-100 text-sm opacity-90 hidden sm:block">BLUM Tandembox, Merivobox i prowadnice</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalQuantity}</div>
            <div className="text-orange-100 text-xs">sztuk łącznie</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center">
                    <Package2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-xs text-gray-500 uppercase">Ilość</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{totalQuantity} szt.</div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-xs text-gray-500 uppercase">Wartość</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{formatPrice(total)} zł</div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md mb-6 sticky top-20 z-10">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleAddSzuflada} 
            disabled={!isEditMode} 
            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center sm:justify-start"
          >
            <div className="relative flex items-center justify-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                <span>Dodaj szufladę</span>
            </div>
          </button>
          
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm ml-2"
          >
            <ListFilter className="w-4 h-4" />
            {showAdvanced ? 'Prosty widok' : 'Szczegóły'}
          </button>
        </div>
      </div>

      {/* Main List */}
      {szuflady.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/50 border-2 border-dashed border-gray-300 rounded-3xl">
            <Package2 className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Brak dodanych szuflad</p>
            <p className="text-sm text-gray-400">Kliknij "Dodaj szufladę" aby rozpocząć</p>
        </div>
      ) : (
        <div className="space-y-3">
          {szuflady.map((szuflada, index) => (
            <SzufladaCard 
                key={szuflada.id} 
                szuflada={szuflada} 
                index={index} 
                onUpdate={handleUpdateSzuflada} 
                onRemove={handleRemoveSzuflada} 
                showAdvanced={showAdvanced} 
                szufladyOptions={szufladyOptions} 
                formatPrice={formatPrice} 
                isEditMode={isEditMode} 
            />
          ))}
        </div>
      )}

      {szuflady.length > 0 && isEditMode && (
        <div className="pt-4">
          <button 
            onClick={handleAddSzuflada} 
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
          >
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
             <span className="text-sm font-semibold">Dodaj kolejną pozycję</span>
          </button>
        </div>
      )}
    </div>
  );
};

// === ZMODYFIKOWANA KARTA (MOBILE-FIRST GRID) ===
const SzufladaCard = ({ szuflada, index, onUpdate, onRemove, showAdvanced, szufladyOptions, formatPrice, isEditMode }) => (
    <div className="group bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-4">
            {/* GRID LAYOUT: Zmienia się z 12 kolumn (Mobile) na Flex Row (Desktop) */}
            <div className="grid grid-cols-12 gap-y-4 gap-x-3 md:flex md:items-center md:gap-6">
                
                {/* 1. SEKCJA GŁÓWNA: Numer + System (Cała szerokość na mobile) */}
                <div className="col-span-12 md:flex-1 flex items-center gap-3">
                    {/* Badge z numerem */}
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-100 to-red-50 text-orange-600 rounded-lg flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 border border-orange-100">
                        {index + 1}
                    </div>
                    
                    {/* Select Systemu */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">
                            System / Rodzaj
                        </label>
                        <select 
                            value={szuflada.rodzaj} 
                            onChange={(e) => onUpdate(szuflada.id, 'rodzaj', e.target.value)} 
                            disabled={!isEditMode} 
                            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                        >
                            {szufladyOptions.map((option, idx) => (
                                <option key={idx} value={option.nazwa}>{option.nazwa}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 2. SEKCJA ILOŚCI (Mały box po lewej na mobile) */}
                <div className="col-span-4 md:w-24">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">
                        Ilość
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={szuflada.ilość} 
                            onChange={(e) => onUpdate(szuflada.id, 'ilość', e.target.value)} 
                            disabled={!isEditMode} 
                            className="w-full h-10 pl-2 pr-1 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-semibold text-gray-900 text-sm disabled:bg-gray-100" 
                            placeholder="1" 
                            min="1" 
                        />
                         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none hidden md:block">szt</span>
                    </div>
                </div>

                {/* 3. SEKCJA CENY I AKCJI (Prawa strona na mobile) */}
                <div className="col-span-8 md:w-auto flex items-center justify-end gap-3 md:gap-4 pl-2 border-l border-gray-100 md:border-0 md:pl-0">
                    <div className="text-right">
                        <div className="text-sm md:text-lg font-bold text-gray-900">
                            {formatPrice(szuflada.cenaCałość)} <span className="text-xs font-normal text-gray-500">zł</span>
                        </div>
                        {(showAdvanced || window.innerWidth < 768) && (
                           <div className="text-[10px] text-gray-400">
                               {formatPrice(szuflada.cenaJednostkowa)} zł / szt
                           </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => onRemove(szuflada.id)} 
                        disabled={!isEditMode} 
                        className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Usuń pozycję"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    </div>
);

export default SzufladyTable;