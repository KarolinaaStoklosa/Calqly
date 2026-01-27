import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Eye, EyeOff, TrendingUp,
  Box, Square, Zap, ChevronDown, ChevronUp, Info, Sparkles
} from 'lucide-react';
import { useProjectSection, useProject } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';

const KorpusyTable = () => {
  const { items: korpusy, addItem, updateItem, removeItem, total } = useProjectSection('szafki');
  const { calculateKorpus, formatPrice, formatSurface } = useCalculator();
  const { materials } = useMaterials();
  const plytyKorpusOptions = materials.plytyMeblowe || [];
  const plytyFrontOptions = materials.fronty || [];
  const okleinaOptions = (materials.okleina || []).filter(o => o.kategoria === 'material');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const { isEditMode } = useProject();

  const handleAddKorpus = () => {
    const lastKorpus = korpusy.length > 0 ? korpusy[korpusy.length - 1] : {};
    const newKorpus = {
      id: Date.now() + Math.random(),
      plytyKorpus: lastKorpus.plytyKorpus || plytyKorpusOptions[0]?.nazwa || '',
      plytyFront: lastKorpus.plytyFront || plytyFrontOptions[0]?.nazwa || '',
      tył: 'HDF',
      okleina: lastKorpus.okleina || okleinaOptions[0]?.nazwa || '',
      okleinaFront: lastKorpus.okleinaFront || okleinaOptions[0]?.nazwa || '',
      ilośćSztuk: 1,
      podziałFrontu: 1,
      szerokość: '', wysokość: '', głębokość: '', ilośćPółek: '0',
      powierzchniaKorpus: 0, powierzchniaPółek: 0, powierzchniaFront: 0, powierzchniaTył: 0,
      okleinaKorpusMetry: 0, okleinaFrontMetry: 0,
      cenaKorpus: 0, cenaPółki: 0, cenaFront: 0, cenaTył: 0, cenaOkleinaKorpus: 0, cenaOkleinaFront:0, cenaCałość: 0
    };
    addItem(newKorpus);
    setAnimationKey(prev => prev + 1);
  };

  const handleUpdateKorpus = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveKorpus = (id) => removeItem(id);

  useEffect(() => {
    korpusy.forEach(korpus => {
      const calculated = calculateKorpus(korpus);
      const hasChanges = Object.keys(calculated).some(key => korpus[key] !== calculated[key]);
      if (hasChanges) updateItem(korpus.id, calculated);
    });
  }, [korpusy.map(k => `${k.plytyKorpus}-${k.plytyFront}-${k.szerokość}-${k.wysokość}-${k.głębokość}-${k.ilośćPółek}-${k.podziałFrontu}-${k.ilośćSztuk}-${k.tył}`).join('|')]);
  
  const totalSzafki = korpusy.reduce((sum, k) => sum + (parseInt(k.ilośćSztuk)), 0);
  const totalPowierzchniaKorpusyPolki = korpusy.reduce((sum, k) => sum + (k.powierzchniaKorpus || 0) + (k.powierzchniaPółek || 0), 0);
  const totalPowierzchniaFronty = korpusy.reduce((sum, k) => sum + (k.powierzchniaFront || 0), 0);
  const totalCenaKorpusyPolki = korpusy.reduce((sum, k) => sum + (k.cenaKorpus || 0) + (k.cenaPółki || 0), 0);
  const totalCenaFronty = korpusy.reduce((sum, k) => sum + (k.cenaFront || 0), 0);
  const totalSurface = totalPowierzchniaKorpusyPolki + totalPowierzchniaFronty;

   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 pb-24">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Korpusy & Szafki</h1>
              <p className="text-blue-100 text-sm opacity-90 hidden sm:block">Kalkulacja powierzchni i kosztów</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalSzafki}</div>
            <div className="text-blue-100 text-xs">szafek łącznie</div>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Korpusy</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{formatSurface(totalPowierzchniaKorpusyPolki)} m²</div>
          <div className="text-xs font-semibold text-blue-600">{formatPrice(totalCenaKorpusyPolki)} zł</div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Square className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Fronty</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{formatSurface(totalPowierzchniaFronty)} m²</div>
           <div className="text-xs font-semibold text-purple-600">{formatPrice(totalCenaFronty)} zł</div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Wartość</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{formatPrice(total)} zł</div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md mb-6 sticky top-20 z-10">
         <div className="flex items-center justify-between">
            <button onClick={handleAddKorpus} disabled={!isEditMode} className="flex-1 sm:flex-none justify-center group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj korpus</span></div>
            </button>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm ml-2">
                {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">Kalkulacje</span>
            </button>
        </div>
      </div>

      {/* LISTA KORPUSÓW */}
      {korpusy.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-lg text-center">
            <Box className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <p className="text-gray-500">Brak szafek w projekcie</p>
        </div>
      ) : (
        <div className="space-y-4" key={animationKey}>
          {korpusy.map((korpus, index) => (
            <KorpusCard
              key={korpus.id}
              korpus={korpus}
              index={index}
              onUpdate={handleUpdateKorpus}
              onRemove={handleRemoveKorpus}
              showAdvanced={showAdvanced}
              plytyKorpusOptions={plytyKorpusOptions}
              plytyFrontOptions={plytyFrontOptions}
              okleinaOptions={okleinaOptions}
              formatPrice={formatPrice}
              formatSurface={formatSurface}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}
      
      {korpusy.length > 0 && isEditMode && (
         <div className="pt-4">
            <button onClick={handleAddKorpus} className="w-full py-4 border-2 border-dashed border-blue-200 rounded-xl text-blue-500 font-semibold hover:bg-blue-50 transition-colors">
                + Dodaj kolejny korpus
            </button>
         </div>
      )}
    </div>
  );
};

// === ZMODYFIKOWANA KARTA KORPUSU (RESPONSIVE GRID) ===
const KorpusCard = ({ korpus, index, onUpdate, onRemove, isEditMode, showAdvanced, plytyKorpusOptions, plytyFrontOptions, okleinaOptions, formatPrice, formatSurface }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* HEADER KARTY - GRID SYSTEM */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-12 gap-3 md:flex md:items-center md:justify-between">
            
            {/* 1. TYTUŁ I INDEX (Full width on mobile) */}
            <div className="col-span-12 md:flex-1 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                    {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                    Korpus #{index + 1}
                    {korpus.ilośćSztuk > 1 && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">x{korpus.ilośćSztuk}</span>}
                  </h3>
                  {/* Wymiary pod tytułem na mobile */}
                  <div className="text-xs text-gray-500 mt-0.5 font-mono">
                     {korpus.szerokość || '?'} x {korpus.wysokość || '?'} x {korpus.głębokość || '?'} mm
                  </div>
                </div>
            </div>

            {/* 2. SUMMARY MATERIAŁÓW (Hidden on very small screens, visible on md) */}
            <div className="col-span-12 md:col-span-auto md:w-auto hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border"><Box size={10}/> {korpus.plytyKorpus || 'Brak'}</span>
                {korpus.plytyFront && korpus.plytyFront !== '-- BRAK FRONTU --' && (
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border"><Square size={10}/> Front</span>
                )}
            </div>

            {/* 3. CENA I AKCJE (Right aligned) */}
            <div className="col-span-12 md:w-auto flex items-center justify-between md:justify-end gap-3 pt-2 border-t border-gray-50 md:border-0 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="text-lg font-bold text-gray-900">{formatPrice(korpus.cenaCałość)} <span className="text-xs font-normal text-gray-500">zł</span></div>
                  <div className="text-[10px] text-gray-400">{formatSurface((korpus.powierzchniaKorpus || 0) + (korpus.powierzchniaPółek || 0))} m² płyty</div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors text-gray-600">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <button onClick={() => onRemove(korpus.id)} disabled={!isEditMode} className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      {/* EXPANDED FORM - GRID SYSTEM (Również poprawiony pod mobile) */}
      {isExpanded && (
        <div className="p-4 bg-gray-50/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
          
          {/* Sekcja Wymiarów - Grid 2 kolumny na mobile */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Szerokość</label>
                <input type="number" value={korpus.szerokość} onChange={(e) => onUpdate(korpus.id, 'szerokość', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm" placeholder="mm" />
             </div>
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Wysokość</label>
                <input type="number" value={korpus.wysokość} onChange={(e) => onUpdate(korpus.id, 'wysokość', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm" placeholder="mm" />
             </div>
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Głębokość</label>
                <input type="number" value={korpus.głębokość} onChange={(e) => onUpdate(korpus.id, 'głębokość', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm" placeholder="mm" />
             </div>
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Półki</label>
                <input type="number" value={korpus.ilośćPółek} onChange={(e) => onUpdate(korpus.id, 'ilośćPółek', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm" placeholder="szt" />
             </div>
             <div className="col-span-2 md:col-span-1 bg-purple-50 p-1 rounded-lg border border-purple-100">
                <label className="text-[10px] font-bold text-purple-600 uppercase block text-center">Ilość Korp.</label>
                <input type="number" value={korpus.ilośćSztuk} onChange={(e) => onUpdate(korpus.id, 'ilośćSztuk', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border border-purple-200 rounded text-sm text-center font-bold text-purple-700" />
             </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Sekcja Materiałów - Pełna szerokość na mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Płyta Korpus</label>
                <select value={korpus.plytyKorpus} onChange={(e) => onUpdate(korpus.id, 'plytyKorpus', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm">{plytyKorpusOptions.map((o, i) => <option key={i} value={o.nazwa}>{o.nazwa}</option>)}</select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Okleina Korpus</label>
                <select value={korpus.okleina} onChange={(e) => onUpdate(korpus.id, 'okleina', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm">
                  {okleinaOptions.map((o, i) => <option key={i} value={o.nazwa}>{o.nazwa}</option>)}</select>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Płyta Front</label>
                <select value={korpus.plytyFront} onChange={(e) => onUpdate(korpus.id, 'plytyFront', e.target.value)} disabled={!isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm">{plytyFrontOptions.map((o, i) => <option key={i} value={o.nazwa}>{o.nazwa}</option>)}</select>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Okleina Front</label>
                    <select value={korpus.okleinaFront || '-- BRAK OKLEINY --'} onChange={(e) => onUpdate(korpus.id, 'okleinaFront', e.target.value)} disabled={korpus.plytyFront === '-- BRAK FRONTU --' || !isEditMode} className="w-full p-2 bg-white border rounded-lg text-sm">{okleinaOptions.map((o, i) => <option key={i} value={o.nazwa}>{o.nazwa}</option>)}</select>
                 </div>
                 <div className="w-20">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Podział</label>
                    <input type="number" value={korpus.podziałFrontu || 1} onChange={(e) => onUpdate(korpus.id, 'podziałFrontu', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-center text-sm" />
                 </div>
              </div>
            </div>
          </div>
          
          {/* Szczegóły Kalkulacji - Grid */}
          {showAdvanced && (
            <div className="bg-white rounded-lg p-3 border border-gray-200 mt-4">
              <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide border-b pb-1">Kalkulacja (1 szt)</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                 <div className="flex justify-between"><span>Płyta:</span> <span className="font-medium">{formatPrice((korpus.cenaKorpus + korpus.cenaPółki + korpus.cenaFront))} zł</span></div>
                 <div className="flex justify-between"><span>Okleina:</span> <span className="font-medium">{formatPrice((korpus.cenaOkleinaKorpus + korpus.cenaOkleinaFront))} zł</span></div>
                 <div className="col-span-2 border-t pt-1 mt-1 flex justify-between font-bold text-blue-600">
                    <span>Razem (x{korpus.ilośćSztuk}):</span>
                    <span>{formatPrice(korpus.cenaCałość)} zł</span>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KorpusyTable;