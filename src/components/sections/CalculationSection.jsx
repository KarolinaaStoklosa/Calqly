import React from 'react';
import { Layers, TrendingUp, Plus, Trash2, Home, Truck, AlertTriangle, Gift } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useProjectMetrics } from '../../hooks/useProjectMetrics';

const CalculationSection = () => {
  const { calculations, settings, totals, updateSettings, isEditMode } = useProject();
  const { calculateAggregatedMetrics } = useProjectMetrics();
  const metrics = calculateAggregatedMetrics(calculations);

  const formatPrice = (price = 0) => `${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`;

  // --- Handlery ---
  const handleSettingChange = (key, value) => updateSettings({ [key]: value });
  const handleNestedSettingChange = (key, nestedKey, value) => updateSettings({ [key]: { ...settings[key], [nestedKey]: value } });
  const handleDoliczoneChange = (key, nestedKey, value) => updateSettings({ doliczone: { ...settings.doliczone, [key]: { ...settings.doliczone[key], [nestedKey]: value } } });
  
  const handleItemChange = (itemType, id, field, value) => {
    const updatedItems = (settings[itemType] || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    updateSettings({ [itemType]: updatedItems });
  };
  const handleAddItem = (itemType, newItem) => updateSettings({ [itemType]: [...(settings[itemType] || []), { ...newItem, id: Date.now() }] });
  const handleRemoveItem = (itemType, id) => updateSettings({ [itemType]: (settings[itemType] || []).filter(item => item.id !== id) });

  const handleNonMarginableChange = (id, field, value) => {
    const updatedItems = (settings.nonMarginableItems || []).map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateSettings({ nonMarginableItems: updatedItems });
  };
  const handleAddNonMarginableItem = () => {
    const newItem = { id: Date.now(), name: 'Nowa pozycja', percentage: 0, active: true };
    updateSettings({ nonMarginableItems: [...(settings.nonMarginableItems || []), newItem] });
  };
  const handleRemoveNonMarginableItem = (id) => {
    updateSettings({ nonMarginableItems: (settings.nonMarginableItems || []).filter(item => item.id !== id) });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 pb-24"> {/* Dodatkowy padding na dole dla mobile */}
      
      {/* SEKCJA 1: PODSUMOWANIE FINANSOWE */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💰</span> Podsumowanie finansowe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Materiały bazowe" value={formatPrice(totals.materialsTotal)} color="blue" />
            <StatCard title="Koszty dodatkowe" value={formatPrice(totals.additionalTotal)} color="green" />
            <StatCard title={`Narzut (${settings.margin}%)`} value={formatPrice(totals.marginAmount)} color="purple" />
            <StatCard title="CENA KOŃCOWA" value={formatPrice(totals.grossTotal)} color="red" isLarge={true} />
        </div>
        
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/50 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <div className="space-y-1">
                    <BreakdownRow label="Materiały bazowe:" value={formatPrice(totals.materialsTotal)} />
                    <BreakdownRow label="Pozycje automatyczne:" value={formatPrice(totals.doliczoneCost)} />
                    <BreakdownRow label="Pozycje dodatkowe:" value={formatPrice(totals.servicesCost)} />
                    <BreakdownRow label="Projekt:" value={formatPrice(totals.projectCost)} />
                    <BreakdownRow label="Transport:" value={formatPrice(totals.transportCost)} />
                </div>
                <div className="space-y-1 mt-4 lg:mt-0">
                    <BreakdownRow label="Tył HDF:" value={formatPrice(totals.hdfCost)} />
                    <BreakdownRow label="Odpady:" value={formatPrice(totals.wasteDetails.korpusy + totals.wasteDetails.fronty + totals.wasteDetails.frontyNaBok)} />
                    <BreakdownRow label={`Narzut (${settings.margin}%):`} value={formatPrice(totals.marginAmount)}  isBold />
                    <BreakdownRow label="Pozycje niemarżowane:" value={formatPrice(totals.nonMarginableTotal)} />
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1 text-sm mt-3 pt-3 border-t border-gray-200/50">
                <div><BreakdownRow label="Netto (z pozycjami niemarż.):" value={formatPrice(totals.netTotal + totals.nonMarginableTotal)} isBold /></div>
                <div><BreakdownRow label={`VAT (${settings.vatRate}%):`} value={formatPrice(totals.vatAmount)} /></div>
             </div>
            <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center text-blue-800 font-bold text-lg md:text-xl pt-4 mt-2 border-t border-blue-200">
                <div className='text-right'>
                  <span className="block sm:inline">BRUTTO: {formatPrice(totals.grossTotal)}</span>
                  {settings.showVAT && <div className='text-[10px] md:text-xs text-blue-600 font-normal mt-1'>zawiera {formatPrice(totals.vatAmount)} VAT</div>}
                </div>
            </div>
        </div>
      </div>
      
      {/* SEKCJA 2: POZYCJE DODATKOWE */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Plus className="w-5 h-5 text-blue-600" /></div>
            Dodatkowe pozycje
        </h3>
        
        <fieldset disabled={!isEditMode}>
            {/* Automatyczne */}
            <div className='p-4 bg-gray-50/80 rounded-xl mb-4 border border-gray-100'>
                <h4 className='font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide'>Pozycje automatyczne</h4>
                <div className='space-y-4'>
                    {/* Stała wartość */}
                    <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <span className='text-sm font-medium text-gray-700 flex-1'>Stała wartość do szafek</span>
                            <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
                                <div className='w-24'><NumberInput value={settings.doliczone.stalaWartoscDoSzafek.price} onChange={e => handleDoliczoneChange('stalaWartoscDoSzafek', 'price', parseFloat(e.target.value))} /></div>
                                <span className='text-xs text-gray-500 whitespace-nowrap'>x {metrics.iloscSzafek} szt</span>
                                <span className='font-bold text-blue-600 min-w-[80px] text-right'>{formatPrice(settings.doliczone.stalaWartoscDoSzafek.price * metrics.iloscSzafek)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dno szuflady */}
                    <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                         <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <span className='text-sm font-medium text-gray-700 flex-1'>Płyta na dno szuflady (m²)</span>
                            <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
                                <div className='w-24'><NumberInput value={settings.doliczone.plytaNaDnoSzuflady.surfacePerDrawer} onChange={e => handleDoliczoneChange('plytaNaDnoSzuflady', 'surfacePerDrawer', parseFloat(e.target.value))} /></div>
                                <span className='text-xs text-gray-500 whitespace-nowrap'>x {metrics.iloscSzuflad} szt</span>
                                <span className='font-bold text-blue-600 min-w-[80px] text-right'>{formatPrice(settings.doliczone.plytaNaDnoSzuflady.surfacePerDrawer * metrics.iloscSzuflad * settings.doliczone.plytaNaDnoSzuflady.pricePerM2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Ręczne (Usługi) */}
            <div className='p-4 bg-gray-50/80 rounded-xl border border-gray-100'>
                <h4 className='font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide'>Usługi i Montaż</h4>
                <div className="space-y-3">
                {(settings.serviceItems || []).map(item => <EditableListItem key={item.id} item={item} type="serviceItems" onChange={handleItemChange} onRemove={handleRemoveItem} hasQuantity /> )}
                <button onClick={() => handleAddItem('serviceItems', { name: 'Nowa usługa', pricePerUnit: 0, quantity: 1, unit: 'szt', active: true })} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-500 hover:bg-green-50 hover:text-green-600 flex items-center justify-center gap-2 transition-all font-medium text-sm">
                    <Plus className="w-4 h-4" />Dodaj kolejną usługę
                </button>
                </div>
            </div>
        </fieldset>
      </div>

      {/* SEKCJA 3: USTAWIENIA SZCZEGÓŁOWE */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600"/></div>
            Narzut i Wycena
        </h3>
        
        <div className='p-4 bg-purple-50/50 rounded-xl mb-6 mt-4 border border-purple-100'>
          <fieldset disabled={!isEditMode}>
            <div className='flex justify-between text-sm mb-4 bg-white p-3 rounded-lg border border-purple-100 shadow-sm'>
                <span className='text-gray-600'>Podstawa do naliczeń:</span>
                <span className='font-bold text-gray-800'>{formatPrice(totals.subtotal)}</span>
            </div>
            <RangeInput label={`Narzut(${settings.margin}%)`} value={settings.margin} onChange={e => handleSettingChange('margin', parseInt(e.target.value))} max={100} amount={formatPrice(totals.marginAmount)} />
          </fieldset>
        </div>
        
        <div className='p-4 bg-red-50/50 rounded-xl mb-6 border border-red-100'>
          <fieldset disabled={!isEditMode}>
          <h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide'>
              <Gift className="w-4 h-4 text-red-500"/> Pozycje Niemarżowane
          </h4>
          
          <div className="space-y-3">
            {(settings.nonMarginableItems || []).map(item => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                    {/* Mobile Grid Layout */}
                    <div className="grid grid-cols-12 gap-3 items-center">
                        {/* Wiersz 1: Checkbox + Nazwa */}
                        <div className='col-span-1 flex items-center justify-center'>
                            <input type="checkbox" checked={item.active} onChange={e => handleNonMarginableChange(item.id, 'active', e.target.checked)} className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        </div>
                        <div className='col-span-10 md:col-span-5'>
                            <input type="text" value={item.name} onChange={e => handleNonMarginableChange(item.id, 'name', e.target.value)} className="w-full p-2 bg-gray-50 border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-red-500" placeholder="Nazwa pozycji" />
                        </div>
                         <div className='col-span-1 md:hidden flex justify-end'>
                             {/* Trash na mobile w 1 wierszu */}
                             <button onClick={() => handleRemoveNonMarginableItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                         </div>

                        {/* Wiersz 2 (Mobile) / Ciąg dalszy (Desktop): Procent i Wartość */}
                        <div className='col-span-4 md:col-span-2 md:col-start-7'>
                            <div className="relative">
                                <input type="number" value={item.percentage} onChange={e => handleNonMarginableChange(item.id, 'percentage', parseFloat(e.target.value) || 0)} className="w-full p-2 pl-3 pr-6 border border-gray-200 rounded-lg text-sm text-center font-medium" />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">%</span>
                            </div>
                        </div>
                        
                        <div className='col-span-8 md:col-span-3 text-right'>
                            <div className="bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                                <span className='font-bold text-red-700 text-sm'>{formatPrice(totals.subtotal * ((item.percentage || 0) / 100))}</span>
                            </div>
                        </div>

                        <div className='hidden md:col-span-1 md:flex justify-center'>
                            <button onClick={() => handleRemoveNonMarginableItem(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            ))}
          </div>

          <button onClick={handleAddNonMarginableItem} className="w-full mt-4 py-3 border-2 border-dashed border-red-200 rounded-xl text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Dodaj pozycję niemarżowaną
          </button>
        </fieldset>
        </div>
        
        <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
          <fieldset disabled={!isEditMode}>
          <CheckboxInput label="Uwzględnij VAT na fakturze" checked={settings.showVAT} onChange={e => handleSettingChange('showVAT', e.target.checked)} />
          {settings.showVAT && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 w-full md:w-1/2">
                   <NumberInput label={`Stawka VAT (%)`} value={settings.vatRate} onChange={e => handleSettingChange('vatRate', parseInt(e.target.value) || 23)} amount={formatPrice(totals.vatAmount)} />
              </div>
          )}
        </fieldset>
        </div>
      </div>

      {/* KOSZTY PROJEKTU I ODPADY (Grid 2 kolumnowy na desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Transport i Projekt */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <fieldset disabled={!isEditMode}>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600"/> Logistyka i Projekt
            </h3>
            <div className="space-y-6">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <CheckboxInput label="Uwzględnij transport" checked={settings.transport.active} onChange={e => handleNestedSettingChange('transport', 'active', e.target.checked)} />
                  {settings.transport.active && (
                      <div className='grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2'>
                          <NumberInput label="Dystans (km)" value={settings.transport.distance} onChange={e => handleNestedSettingChange('transport', 'distance', parseFloat(e.target.value) || 0)} />
                          <NumberInput label="Cena za km (zł)" value={settings.transport.pricePerKm} onChange={e => handleNestedSettingChange('transport', 'pricePerKm', parseFloat(e.target.value) || 0)} />
                      </div>
                  )}
              </div>
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700 text-sm">
                       <Home className="w-4 h-4 text-green-600"/> Projekt
                  </div>
                  <CheckboxInput label="Dodatkowa opłata za projekt" checked={settings.projectTypeActive} onChange={e => handleSettingChange('projectTypeActive', e.target.checked)} />
                  {settings.projectTypeActive && (
                      <div className='space-y-3 mt-3 animate-in fade-in slide-in-from-top-2'>
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Typ pomieszczenia</label>
                              <select value={settings.projectType} onChange={e => handleSettingChange('projectType', e.target.value)} className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                                  <option>KUCHNIA</option><option>SZAFA</option><option>ŁAZIENKA</option><option>SALON</option><option>BIURO</option>
                              </select>
                          </div>
                          <NumberInput label="Cena projektu (zł)" value={settings.projectTypePrice} onChange={e => handleSettingChange('projectTypePrice', parseFloat(e.target.value) || 0)} />
                      </div>
                  )}
              </div>
            </div>
            </fieldset>
          </div>
          
          {/* Odpady */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <fieldset disabled={!isEditMode}>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" /> Odpady Materiałowe
            </h3>
            <div className="space-y-5 bg-orange-50/30 p-4 rounded-xl border border-orange-100">
              <RangeInput label={`Korpusy + półki (${settings.wasteSettings.korpusyPolki}%)`} value={settings.wasteSettings.korpusyPolki} onChange={e => handleNestedSettingChange('wasteSettings', 'korpusyPolki', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.korpusy)} />
              <RangeInput label={`Fronty (${settings.wasteSettings.fronty}%)`} value={settings.wasteSettings.fronty} onChange={e => handleNestedSettingChange('wasteSettings', 'fronty', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.fronty)} />
              <RangeInput label={`Fronty na bok (${settings.wasteSettings.frontyNaBok}%)`} value={settings.wasteSettings.frontyNaBok} onChange={e => handleNestedSettingChange('wasteSettings', 'frontyNaBok', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.frontyNaBok)} />
              <RangeInput label={`Tył HDF (${settings.wasteSettings.tylHdf}%)`} value={settings.wasteSettings.tylHdf} onChange={e => handleNestedSettingChange('wasteSettings', 'tylHdf', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.hdf)} />
            </div>
            </fieldset>
          </div>
      </div>

    </div>
  );
};

// --- RESPONSIVE SUB-COMPONENTS ---

const EditableListItem = ({ item, type, onChange, onRemove, hasQuantity }) => {
   const total = (item.pricePerUnit || 0) * (item.quantity || 0);
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-12 gap-3 items-center">
        
        {/* Wiersz 1: Checkbox + Nazwa (Pełna szerokość na mobile) */}
        <div className="col-span-1 flex justify-center">
          <input type="checkbox" checked={item.active} onChange={e => onChange(type, item.id, 'active', e.target.checked)} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
        </div>
        
        <div className={hasQuantity ? "col-span-10 md:col-span-5" : "col-span-10 md:col-span-8"}>
          <label className='block md:hidden text-[10px] text-gray-400 font-bold uppercase mb-0.5'>Nazwa</label>
          <input type="text" value={item.name} onChange={e => onChange(type, item.id, 'name', e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Nazwa usługi" />
        </div>
        
        <div className="col-span-1 md:hidden flex justify-end">
             <button onClick={() => onRemove(type, item.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
        </div>

        {/* Wiersz 2 (Mobile): Parametry Finansowe */}
        {hasQuantity ? (
          <>
            <div className="col-span-4 md:col-span-2 md:col-start-7">
              <label className='block text-[10px] text-gray-400 font-bold uppercase mb-0.5'>Cena</label>
              <input type="number" value={item.pricePerUnit} onChange={e => onChange(type, item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-200 rounded-lg text-sm text-center" placeholder="0.00" />
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className='block text-[10px] text-gray-400 font-bold uppercase mb-0.5'>Ilość</label>
              <div className="relative">
                <input type="number" value={item.quantity} onChange={e => onChange(type, item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-200 rounded-lg text-sm text-center" placeholder="1" />
                 <span className="hidden lg:inline absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{item.unit || 'szt'}</span>
              </div>
            </div>
            
            <div className="col-span-4 md:col-span-2 text-right">
              <label className='block text-[10px] text-gray-400 font-bold uppercase mb-0.5'>Suma</label>
              <div className="h-[38px] bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-end px-3">
                 <span className="font-bold text-blue-700 text-sm">{total.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-11 md:col-span-3">
              <label className='block text-[10px] text-gray-400 font-bold uppercase mb-0.5'>Wartość</label>
              <input type="number" value={item.unitPrice} onChange={e => onChange(type, item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold" />
          </div>
        )}
        
        <div className="hidden md:col-span-1 md:flex justify-center">
          <button onClick={() => onRemove(type, item.id)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    );
  };

const StatCard = ({ title, value, color, isLarge }) => { 
    const colors = { 
        blue: 'bg-blue-50 text-blue-700 border-blue-200', 
        green: 'bg-green-50 text-green-700 border-green-200', 
        purple: 'bg-purple-50 text-purple-700 border-purple-200', 
        red: 'bg-red-50 text-red-700 border-red-200' 
    };
    const current = colors[color] || 'bg-gray-50 text-gray-700 border-gray-200';

    return (
        <div className={`rounded-xl p-4 border shadow-sm ${current} transition-transform hover:scale-[1.02]`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{title}</p>
            <p className={`font-bold truncate ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>{value}</p>
        </div>
    );
};

const BreakdownRow = ({ label, value, isBold }) => (
    <div className={`flex justify-between py-0.5 ${isBold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

const RangeInput = ({ label, value, onChange, max = 50, amount }) => (
    <div className='mb-3'>
        <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>{label}</span>
            <span className='font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded'>{amount}</span>
        </label>
        <input type="range" min="0" max={max} value={value} onChange={onChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
    </div>
);

const CheckboxInput = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
            {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
    </label>
);

const NumberInput = ({ label, value, onChange, amount }) => (
    <div>
        {label && (
          <label className="block text-xs font-medium text-gray-500 mb-1 truncate">
              {label} {amount && <span className='text-blue-600 ml-1'>({amount})</span>}
          </label>
        )}
        <input type="number" value={value} onChange={onChange} className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01" />
    </div>
);

export default CalculationSection;