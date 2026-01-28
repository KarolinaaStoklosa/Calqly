import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Wrench } from 'lucide-react';
import { useProjectSection, useProject } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';
import MaterialSelector from '../ui/MaterialSelector';

const AkcesoriaTable = () => {
  const { isEditMode } = useProject();
  const { items: akcesoria, addItem, updateItem, removeItem, total } = useProjectSection('akcesoria');
  const { calculateAkcesorium, formatPrice } = useCalculator();
  const { materials } = useMaterials();
  const akcesoriaOptions = materials.akcesoria || [];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddAkcesorium = () => {
    const newAkcesorium = { rodzaj: akcesoriaOptions[0]?.nazwa || '', ilość: '1', cenaJednostkowa: 0, cenaCałość: 0 };
    addItem(newAkcesorium);
  };
  const handleUpdateAkcesorium = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveAkcesorium = (id) => removeItem(id);

  useEffect(() => {
    akcesoria.forEach(akcesorium => {
      const calculated = calculateAkcesorium(akcesorium);
      const hasChanges = Object.keys(calculated).some(key => akcesorium[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(akcesorium.id, calculated);
      }
    });
  }, [akcesoria.map(a => `${a.rodzaj}-${a.ilość}`).join('|')]);

  const totalQuantity = akcesoria.reduce((sum, a) => sum + (parseFloat(a.ilość) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">⚙️</span></div>
            <div>
              <h1 className="text-xl font-bold text-white">Akcesoria Meblowe</h1>
              <p className="text-emerald-100 text-sm opacity-90 hidden sm:block">PEKA, BLUM, LED i organizery</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalQuantity}</div>
            <div className="text-emerald-100 text-xs">elementów</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
            <div className="flex items-center gap-2 mb-1">
                <Wrench className="w-4 h-4 text-emerald-600" />
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
            <button onClick={handleAddAkcesorium} disabled={!isEditMode} className="flex-1 sm:flex-none justify-center group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                <div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj akcesorium</span></div>
            </button>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm ml-2">
                {showAdvanced ? 'Ukryj' : 'Szczegóły'}
            </button>
        </div>
      </div>

      {/* List */}
      {akcesoria.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-lg text-center">
             <Wrench className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
             <p className="text-gray-500">Brak akcesoriów w projekcie</p>
        </div>
      ) : (
        <div className="space-y-3">
          {akcesoria.map((akcesorium, index) => (
            <AkcesoriumCard 
                key={akcesorium.id} 
                akcesorium={akcesorium} 
                index={index} 
                onUpdate={handleUpdateAkcesorium} 
                onRemove={handleRemoveAkcesorium} 
                showAdvanced={showAdvanced} 
                akcesoriaOptions={akcesoriaOptions} 
                formatPrice={formatPrice} 
                isEditMode={isEditMode} 
            />
          ))}
        </div>
      )}
            
      {akcesoria.length > 0 && isEditMode && (
        <div className="pt-4">
          <button onClick={handleAddAkcesorium} className="w-full py-4 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors">
             + Dodaj kolejne akcesorium
          </button>
        </div> 
      )}
    </div>
  );
};

const AkcesoriumCard = ({ akcesorium, index, onUpdate, onRemove, showAdvanced, akcesoriaOptions, formatPrice, isEditMode }) => (
    <div className="group bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-4">
            {/* Responsive Grid */}
            <div className="grid grid-cols-12 gap-y-3 gap-x-3 md:flex md:items-center md:gap-6">
                
                {/* 1. Main Info */}
                <div className="col-span-12 md:flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm md:text-base">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">Rodzaj akcesorium</label>
                        {/* <select value={akcesorium.rodzaj} onChange={(e) => onUpdate(akcesorium.id, 'rodzaj', e.target.value)} disabled={!isEditMode} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100">
                            {akcesoriaOptions.map((option, idx) => (<option key={idx} value={option.nazwa}>{option.nazwa}</option>))}
                        </select> */}
                        <MaterialSelector 
                            category="akcesoria" 
                            value={akcesorium.rodzaj}
                            onChange={(value) => onUpdate(akcesorium.id, 'rodzaj', value)}
                            disabled={!isEditMode} 
                        />
                    </div>
                </div>

                {/* 2. Quantity */}
                <div className="col-span-4 md:w-24">
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">Ilość</label>
                     <input type="number" value={akcesorium.ilość} onChange={(e) => onUpdate(akcesorium.id, 'ilość', e.target.value)} disabled={!isEditMode} className="w-full h-10 px-2 bg-white border border-gray-200 rounded-lg text-center font-bold text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100" placeholder="1" min="1" />
                </div>

                {/* 3. Price & Actions */}
                <div className="col-span-8 md:w-auto flex items-center justify-end gap-3 md:gap-4 pl-2 border-l border-gray-100 md:border-0 md:pl-0">
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatPrice(akcesorium.cenaCałość)} <span className="text-xs font-normal text-gray-500">zł</span></div>
                        {(showAdvanced || window.innerWidth < 768) && (<div className="text-[10px] text-gray-400">{formatPrice(akcesorium.cenaJednostkowa)} zł/szt</div>)}
                    </div>
                    <button onClick={() => onRemove(akcesorium.id)} disabled={!isEditMode} className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default AkcesoriaTable;