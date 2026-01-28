import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Eye, EyeOff, TrendingUp, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectSection, useProject } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';
import MaterialSelector from '../ui/MaterialSelector';

const WidocznyBokTable = () => {
  const { items: widoczneBoki, addItem, updateItem, removeItem, total } = useProjectSection('widocznyBok');
  const { calculateWidocznyBok, formatPrice, formatSurface } = useCalculator();
  const { materials } = useMaterials();
  const frontyOptions = materials.fronty || [];
  const okleinaOptions = (materials.okleina || []).filter(o => o.kategoria === 'material');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddWidocznyBok = () => {
    const newWidocznyBok = { 
      id: Date.now(), 
      rodzaj: frontyOptions.find(f => f.cena > 0)?.nazwa || '',
      okleina: '-- BRAK OKLEINY --',
      szerokość: '', wysokość: '', ilość: '1'
    };
    addItem(newWidocznyBok);
  };
  const handleUpdateWidocznyBok = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveWidocznyBok = (id) => removeItem(id);

  useEffect(() => {
    widoczneBoki.forEach(bok => {
      const calculated = calculateWidocznyBok(bok);
      const hasChanges = Object.keys(calculated).some(key => bok[key] !== calculated[key]);
      if (hasChanges) updateItem(bok.id, calculated);
    });
  }, [widoczneBoki.map(b => `${b.rodzaj}-${b.szerokość}-${b.wysokość}-${b.ilość}-${b.okleina}`).join('|')]);

  const totalSurface = widoczneBoki.reduce((sum, b) => sum + (b.powierzchnia || 0), 0);
  const totalQuantity = widoczneBoki.reduce((sum, b) => sum + (parseFloat(b.ilość) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6 pb-24">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">👁️</span></div>
                <div>
                    <h1 className="text-xl font-bold text-white">Widoczny Bok</h1>
                    <p className="text-emerald-100 text-sm opacity-90 hidden sm:block">Kalkulacja powierzchni bocznych</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-white">{totalQuantity}</div>
                <div className="text-emerald-100 text-xs">sztuk</div>
            </div>
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
            <div className="flex items-center gap-2 mb-1">
                 <Layers className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-gray-500 uppercase">Powierzchnia</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{formatSurface(totalSurface)} m²</div>
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
               <button onClick={handleAddWidocznyBok} className="flex-1 sm:flex-none justify-center group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                   <div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj bok</span></div>
               </button>
               <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm ml-2">
                   {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   <span className="hidden sm:inline">Kalkulacje</span>
               </button>
          </div>
      </div>

      {/* LIST */}
      {widoczneBoki.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-lg text-center">
             <div className="text-4xl mb-4">👁️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Brak widocznych boków</h3>
            <p className="text-sm text-gray-500">Dodaj element, aby obliczyć cenę materiału i oklejania.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {widoczneBoki.map((bok, index) => <WidocznyBokCard key={bok.id} bok={bok} index={index} onUpdate={handleUpdateWidocznyBok} onRemove={handleRemoveWidocznyBok} showAdvanced={showAdvanced} frontyOptions={frontyOptions} 
          okleinaOptions={okleinaOptions} formatPrice={formatPrice} formatSurface={formatSurface} />)}
        </div>
      )}
      
      {widoczneBoki.length > 0 && (
         <div className="pt-4">
            <button onClick={handleAddWidocznyBok} className="w-full py-4 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors">
                + Dodaj kolejny bok
            </button>
         </div>
      )}
    </div>
  );
};

// === ZMODYFIKOWANA KARTA (MOBILE-FIRST) ===
const WidocznyBokCard = ({ bok, index, onUpdate, onRemove, showAdvanced, frontyOptions, okleinaOptions, formatPrice, formatSurface }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // 👇 CSS FIX: overflow-hidden usunięte, relative z-index dodany
    <div className={`group bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 relative ${isExpanded ? 'z-50' : 'z-0'}`}>
      <div className="p-4 border-b border-gray-100">
        
        {/* GRID LAYOUT FOR HEADER */}
        <div className="grid grid-cols-12 gap-3 md:flex md:items-center md:justify-between">
            
            {/* 1. TYTUŁ I WYMIARY (Full width mobile) */}
            <div className="col-span-12 md:flex-1 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                    {index + 1}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Widoczny Bok #{index + 1}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-mono bg-gray-50 px-2 py-0.5 rounded w-fit">
                        {bok.szerokość && bok.wysokość ? `${bok.szerokość} x ${bok.wysokość} mm` : 'Wpisz wymiary...'}
                        <span className="font-bold text-emerald-600">x{bok.ilość}</span>
                    </div>
                </div>
            </div>

             {/* 2. CENA I AKCJE (Right aligned) */}
            <div className="col-span-12 md:w-auto flex items-center justify-between md:justify-end gap-3 pt-2 border-t border-gray-50 md:border-0 md:pt-0">
                <div className="text-left md:text-right">
                    <div className="text-lg font-bold text-gray-900">{formatPrice(bok.cenaCałość)} <span className="text-xs font-normal text-gray-500">zł</span></div>
                    <div className="text-[10px] text-gray-400">{formatSurface(bok.powierzchnia)} m²</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </button>
                    <button onClick={() => onRemove(bok.id)} className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 bg-gray-50/50 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Materiał</label>
                    {/* ✅ MATERIAŁ (FRONTY) */}
                    <MaterialSelector 
                        category="fronty" 
                        value={bok.rodzaj} 
                        onChange={(val) => onUpdate(bok.id, 'rodzaj', val)} 
                        placeholder="Wybierz płytę/front..."
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Okleina</label>
                    {/* ✅ OKLEINA (Z FILTREM) */}
                    <MaterialSelector 
                        category="okleina" 
                        value={bok.okleina} 
                        onChange={(val) => onUpdate(bok.id, 'okleina', val)} 
                        placeholder="Wybierz okleinę..."
                        filterFn={(item) => item.kategoria === 'material'} // Ukrywamy usługi
                    />
                </div>
            </div>
            {/* INPUTY WYMIARÓW - GRID */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Szer. [mm]</label>
                    <input type="number" value={bok.szerokość} onChange={(e) => onUpdate(bok.id, 'szerokość', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm" placeholder="600" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Wys. [mm]</label>
                    <input type="number" value={bok.wysokość} onChange={(e) => onUpdate(bok.id, 'wysokość', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm" placeholder="720" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Ilość [szt]</label>
                    <input type="number" value={bok.ilość} onChange={(e) => onUpdate(bok.id, 'ilość', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm font-bold text-center" placeholder="1" min="0" />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default WidocznyBokTable;