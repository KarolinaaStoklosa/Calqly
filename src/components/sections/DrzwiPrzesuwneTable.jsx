import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Move } from 'lucide-react';
import { useProjectSection, useProject } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';
import MaterialSelector from '../ui/MaterialSelector';

const DrzwiPrzesuwneTable = () => {
  const { isEditMode } = useProject();
  const { items: drzwiPrzesuwne, addItem, updateItem, removeItem, total } = useProjectSection('drzwiPrzesuwne');
  const { calculateDrzwiPrzesuwne, formatPrice } = useCalculator();
  const { materials } = useMaterials();
  const drzwiOptions = materials.drzwiPrzesuwne || [];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddDrzwi = () => {
    // Domyślna wartość
    const defaultName = drzwiOptions.length > 0 ? drzwiOptions[0].nazwa : '';
    const newDrzwi = { rodzaj: defaultName, ilość: '1', cenaJednostkowa: 0, cenaCałość: 0 };
    addItem(newDrzwi);
  };
  const handleUpdateDrzwi = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveDrzwi = (id) => removeItem(id);

  useEffect(() => {
    drzwiPrzesuwne.forEach(drzwi => {
      const calculated = calculateDrzwiPrzesuwne(drzwi);
      const hasChanges = Object.keys(calculated).some(key => drzwi[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(drzwi.id, calculated);
      }
    });
  }, [drzwiPrzesuwne.map(d => `${d.rodzaj}-${d.ilość}`).join('|')]);

  const totalQuantity = drzwiPrzesuwne.reduce((sum, d) => sum + (parseFloat(d.ilość) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 md:p-6 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">🚪</span></div>
            <div>
              <h1 className="text-xl font-bold text-white">Drzwi Przesuwne</h1>
              <p className="text-purple-100 text-sm opacity-90 hidden sm:block">Systemy SEVROLL CONCORDIA i inne</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalQuantity}</div>
            <div className="text-purple-100 text-xs">systemów</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Move className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-xs text-gray-500 uppercase">Ilość</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{totalQuantity}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-bold text-xs text-gray-500 uppercase">Wartość</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{formatPrice(total)} zł</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md mb-6 sticky top-20 z-10">
        <div className="flex items-center justify-between">
            <button onClick={handleAddDrzwi} disabled={!isEditMode} className="flex-1 sm:flex-none justify-center group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                <div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj drzwi</span></div>
            </button>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm ml-2">
                {showAdvanced ? 'Ukryj' : 'Szczegóły'}
            </button>
        </div>
      </div>

      {/* List */}
      {drzwiPrzesuwne.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-lg text-center">
             <Move className="w-12 h-12 text-purple-200 mx-auto mb-3" />
             <p className="text-gray-500">Brak systemów drzwi w projekcie</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drzwiPrzesuwne.map((drzwi, index) => (
            <DrzwiPrzesuwneCard 
                key={drzwi.id} 
                drzwi={drzwi} 
                index={index} 
                onUpdate={handleUpdateDrzwi} 
                onRemove={handleRemoveDrzwi} 
                showAdvanced={showAdvanced} 
                drzwiOptions={drzwiOptions} 
                formatPrice={formatPrice} 
                isEditMode={isEditMode} 
            />
          ))}
        </div>
      )}

      {drzwiPrzesuwne.length > 0 && isEditMode && (
        <div className="pt-4">
          <button onClick={handleAddDrzwi} className="w-full py-4 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
             + Dodaj kolejny system
          </button>
        </div> 
      )}
    </div>
  );
};

const DrzwiPrzesuwneCard = ({ drzwi, index, onUpdate, onRemove, showAdvanced, drzwiOptions, formatPrice, isEditMode }) => (
    // 👇 CSS FIX: overflow-hidden usunięte, relative z-index dodany
    <div className="group bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 relative z-0 hover:z-10">
        <div className="p-4">
             {/* Responsive Grid */}
            <div className="grid grid-cols-12 gap-y-3 gap-x-3 md:flex md:items-center md:gap-6">
                
                {/* 1. Main Info */}
                <div className="col-span-12 md:flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm md:text-base">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">System drzwi</label>
                        {/* ✅ NOWY SELEKTOR */}
                        <MaterialSelector 
                            category="drzwiPrzesuwne" 
                            value={drzwi.rodzaj} 
                            onChange={(val) => onUpdate(drzwi.id, 'rodzaj', val)} 
                            placeholder="Wybierz system..."
                            disabled={!isEditMode} 
                        />
                    </div>
                </div>

                {/* 2. Quantity */}
                <div className="col-span-4 md:w-24">
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">Ilość</label>
                     <input type="number" value={drzwi.ilość} onChange={(e) => onUpdate(drzwi.id, 'ilość', e.target.value)} disabled={!isEditMode} className="w-full h-10 px-2 bg-white border border-gray-200 rounded-lg text-center font-bold text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100" placeholder="1" min="1" />
                </div>

                {/* 3. Price & Actions */}
                <div className="col-span-8 md:w-auto flex items-center justify-end gap-3 md:gap-4 pl-2 border-l border-gray-100 md:border-0 md:pl-0">
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatPrice(drzwi.cenaCałość)} <span className="text-xs font-normal text-gray-500">zł</span></div>
                        {(showAdvanced || window.innerWidth < 768) && (<div className="text-[10px] text-gray-400">{formatPrice(drzwi.cenaJednostkowa)} zł/szt</div>)}
                    </div>
                    <button onClick={() => onRemove(drzwi.id)} disabled={!isEditMode} className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default DrzwiPrzesuwneTable;