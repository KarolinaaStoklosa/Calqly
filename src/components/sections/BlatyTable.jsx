import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Square } from 'lucide-react';
import { useProjectSection, useProject } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';
import MaterialSelector from '../ui/MaterialSelector';
import CategoryPriceAlert from '../ui/CategoryPriceAlert';

const BlatyTable = ({ setActiveTab }) => {
  const { isEditMode } = useProject();
  const { items: blaty, addItem, updateItem, removeItem, total } = useProjectSection('blaty');
  const { calculateBlat, formatPrice } = useCalculator();
  const { materials } = useMaterials();
  const blatyOptions = materials.blaty || [];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddBlat = () => {
    // Domyślna wartość
    const defaultName = blatyOptions.length > 0 ? blatyOptions[0].nazwa : '';
    const newBlat = { rodzaj: defaultName, ilość: '1', cenaJednostkowa: 0, cenaCałość: 0 };
    addItem(newBlat);
  };
  const handleUpdateBlat = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveBlat = (id) => removeItem(id);

  useEffect(() => {
    blaty.forEach(blat => {
      const calculated = calculateBlat(blat);
      const hasChanges = Object.keys(calculated).some(key => blat[key] !== calculated[key]);
      if (hasChanges) updateItem(blat.id, calculated);
    });
  }, [blaty.map(b => `${b.rodzaj}-${b.ilość}`).join('|')]);

  const totalQuantity = blaty.reduce((sum, b) => sum + (parseFloat(b.ilość) || 0), 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 md:p-6 pb-24">
      {/* HEADER i KPI */}
            <CategoryPriceAlert category="blaty" setActiveTab={setActiveTab} />
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">🪨</span></div>
                <div>
                    <h1 className="text-xl font-bold text-white">Blaty i Usługi</h1>
                    <p className="text-amber-100 text-sm opacity-90 hidden sm:block">Gotowe blaty, obróbka i montaż</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-white">{totalQuantity}</div>
                <div className="text-amber-100 text-xs">elementów</div>
            </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md mb-6 sticky top-20 z-10">
          <div className="flex items-center justify-between">
              <button onClick={handleAddBlat} disabled={!isEditMode} className="flex-1 sm:flex-none justify-center group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                  <div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj element</span></div>
              </button>
          </div>
      </div>

      <div className="space-y-3">
          {blaty.map((blat, index) => (
            <BlatCard 
                key={blat.id} 
                blat={blat} 
                index={index} 
                onUpdate={handleUpdateBlat} 
                onRemove={handleRemoveBlat} 
                showAdvanced={showAdvanced} 
                blatyOptions={blatyOptions} 
                formatPrice={formatPrice} 
                isEditMode={isEditMode} 
            />
          ))}
      </div>
      
       {blaty.length > 0 && isEditMode && (
         <div className="pt-4">
            <button onClick={handleAddBlat} className="w-full py-4 border-2 border-dashed border-amber-300 rounded-xl text-amber-600 font-semibold hover:bg-amber-50 transition-colors">
                + Dodaj kolejny blat
            </button>
         </div>
      )}
    </div>
  );
};

// === KARTA BLATU ===
const BlatCard = ({ blat, index, onUpdate, onRemove, showAdvanced, blatyOptions, formatPrice, isEditMode }) => (
    // ✅ 3. CSS FIX: Usunięte overflow-hidden, dodane relative i z-index na hover
    <div className="group bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 relative z-0 hover:z-10">
        <div className="p-4">
            <div className="grid grid-cols-12 gap-y-3 gap-x-3 md:flex md:items-center md:gap-6">
                
                {/* 1. SEKCJA GŁÓWNA */}
                <div className="col-span-12 md:flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm md:text-base">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">Rodzaj / Usługa</label>
                        {/* ✅ 2. MATERIAL SELECTOR */}
                        <MaterialSelector 
                            category="blaty"
                            value={blat.rodzaj}
                            onChange={(val) => onUpdate(blat.id, 'rodzaj', val)}
                            placeholder="Wybierz blat lub usługę..."
                            disabled={!isEditMode}
                        />
                    </div>
                </div>

                {/* 2. ILOŚĆ */}
                <div className="col-span-4 md:w-24">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 md:hidden">Ilość</label>
                      <div className="relative">
                        <input 
                            type="number" 
                            value={blat.ilość} 
                            onChange={(e) => onUpdate(blat.id, 'ilość', e.target.value)} 
                            disabled={!isEditMode} 
                            className="w-full h-10 pl-2 pr-1 bg-white border border-gray-200 rounded-lg text-center font-bold text-gray-900 text-sm" 
                            placeholder="1" 
                            min="1" 
                        />
                      </div>
                </div>

                {/* 3. CENA I USUWANIE */}
                <div className="col-span-8 md:w-auto flex items-center justify-end gap-3 md:gap-4 pl-2 border-l border-gray-100 md:border-0 md:pl-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatPrice(blat.cenaCałość)} <span className="text-xs font-normal text-gray-500">zł</span></div>
                        {(showAdvanced || window.innerWidth < 768) && (
                           <div className="text-[10px] text-gray-400">{formatPrice(blat.cenaJednostkowa)} zł/szt</div>
                        )}
                    </div>
                    <button 
                        onClick={() => onRemove(blat.id)} 
                        disabled={!isEditMode} 
                        className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    </div>
);

export default BlatyTable;