import React, { useState } from 'react';
import { useMaterials } from '../../context/MaterialContext';
import { Plus, Trash2, Edit, Loader2, Info, Search, X } from 'lucide-react';

const CATEGORY_NAMES = {
  plytyMeblowe: "Płyty Meblowe",
  okleina: "Okleina",
  fronty: "Fronty",
    tyly: "Plecy",
  drzwiPrzesuwne: "Drzwi Przesuwne",
  uchwyty: "Uchwyty",
  zawiasy: "Zawiasy",
  podnosniki: "Podnośniki",
  szuflady: "Systemy Szuflad",
  blaty: "Blaty i Usługi",
  akcesoria: "Akcesoria Różne"
};

const MaterialsManager = () => {
  const { materials, updateMaterials, loading } = useMaterials();
  const [activeCategory, setActiveCategory] = useState('plytyMeblowe');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddItem = () => {
    const newItem = {
      isNew: true,
      nazwa: '',
      cena: '', 
      opis: '',
      kategoria: activeCategory,
    };
    setEditingItem(newItem);
  };

  const handleEditItem = (item, realIndex) => {
    setEditingItem({ 
        ...item, 
        originalIndex: realIndex, 
        isNew: false,
        cena: item.cena !== undefined ? item.cena.toString().replace('.', ',') : '' 
    });
  };

const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);

    try {
        const currentList = Array.from(materials[activeCategory] || []);
        let priceString = editingItem.cena.toString().replace(',', '.');
        let finalPrice = parseFloat(priceString);

        if (isNaN(finalPrice)) finalPrice = 0;

        // ✅ TWORZYMY POPRAWNY OBIEKT
        const itemToSave = {
            // Jeśli element ma już ID (np. wygenerowane przez nasz nowy Context), to je zachowujemy!
            // Jeśli nie (jest całkiem nowy), tworzymy nowe unikalne ID.
            id: editingItem.id || `new_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            
            nazwa: editingItem.nazwa.trim(),
            opis: editingItem.opis ? editingItem.opis.trim() : '',
            cena: finalPrice,
            kategoria: editingItem.kategoria || activeCategory,
            typ: editingItem.typ || 'produkt',
            jednostka: editingItem.jednostka || 'szt'
        };

        let newList;
        if (editingItem.isNew) {
            // Dodajemy nowy na koniec
            newList = [...currentList, itemToSave];
        } else {
            // Aktualizujemy istniejący:
            // Szukamy po ID (to jest teraz pewne rozwiązanie dzięki naprawie Contextu)
            if (editingItem.id) {
                newList = currentList.map(item => item.id === editingItem.id ? itemToSave : item);
            } else {
                // Fallback dla bardzo starych danych (na wszelki wypadek)
                newList = currentList.map((item, index) => index === editingItem.originalIndex ? itemToSave : item);
            }
        }

        await updateMaterials(activeCategory, newList);
        setEditingItem(null);
    } catch (error) {
        console.error("Błąd zapisu:", error);
        alert("Wystąpił błąd podczas zapisu. Sprawdź konsolę.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteItem = async (realIndex) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten materiał?")) {
        try {
            const currentList = Array.from(materials[activeCategory] || []);
            currentList.splice(realIndex, 1);
            await updateMaterials(activeCategory, currentList);
        } catch (error) {
            console.error("Błąd usuwania:", error);
            alert("Nie udało się usunąć elementu.");
        }
    }
  };

  const filteredItems = (materials[activeCategory] || [])
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(item => {
        const term = searchTerm.toLowerCase();
        const nazwa = (item.nazwa || '').toLowerCase();
        const opis = (item.opis || '').toLowerCase();
        return nazwa.includes(term) || opis.includes(term);
    });

  if (loading) {
      return (
          <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <span className="ml-3 text-gray-500">Ładowanie bazy materiałów...</span>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-120px)]">
        {/* HEADER */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
            <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900">Baza Materiałów</h2>
                <p className="text-xs md:text-sm text-gray-500 hidden md:block">Zarządzaj cenami i asortymentem</p>
            </div>
            <button onClick={handleAddItem} className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium text-sm">
                <Plus size={18} />
                <span>Dodaj <span className="hidden md:inline">pozycję</span></span>
            </button>
        </div>

        {/* CONTENT CONTAINER */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* SIDEBAR (Mobile: Horizontal Scroll, Desktop: Vertical List) */}
            <div className="w-full md:w-64 bg-white md:bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 overflow-x-auto md:overflow-y-auto flex flex-row md:flex-col shrink-0 no-scrollbar">
                <div className="flex flex-row md:flex-col p-2 md:p-4 gap-2 min-w-max md:min-w-0">
                    {Object.keys(CATEGORY_NAMES).map((catKey) => (
                        <button
                            key={catKey}
                            onClick={() => { setActiveCategory(catKey); setSearchTerm(''); }}
                            className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left flex items-center justify-between whitespace-nowrap
                                ${activeCategory === catKey 
                                    ? 'bg-brand-600 text-white md:bg-white md:text-brand-700 md:shadow-sm md:ring-1 md:ring-gray-200' 
                                    : 'text-gray-600 bg-gray-50 md:bg-transparent hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span>{CATEGORY_NAMES[catKey]}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full hidden md:inline-block
                                ${activeCategory === catKey ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                                {materials[catKey]?.length || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* TABELA (Mobile: Responsive) */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white relative">
                
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 shrink-0">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Szukaj po nazwie..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-y-auto p-0 md:p-6">
                    {filteredItems.length > 0 ? (
                        <div className="md:border md:border-gray-200 md:rounded-lg overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[350px] md:min-w-full">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 py-3 md:px-4 w-10 text-center text-xs">#</th>
                                        <th className="px-3 py-3 md:px-4">Nazwa</th>
                                        <th className="px-3 py-3 md:px-4 hidden sm:table-cell">Kod/Opis</th>
                                        <th className="px-3 py-3 md:px-4 text-right">Cena</th>
                                        <th className="px-2 py-3 md:px-4 w-20 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredItems.map((item) => (
                                        <tr key={`${item.nazwa}-${item.originalIndex}`} className="active:bg-gray-50 hover:bg-brand-50/50 transition-colors">
                                            <td className="px-3 py-3 md:px-4 text-center text-gray-400 font-mono text-xs">
                                                {item.originalIndex + 1}
                                            </td>
                                            <td className="px-3 py-3 md:px-4 font-medium text-gray-900">
                                                <div className="line-clamp-2">{item.nazwa}</div>
                                                <div className="text-xs text-gray-400 sm:hidden mt-0.5">{item.opis}</div>
                                            </td>
                                            <td className="px-3 py-3 md:px-4 text-gray-500 hidden sm:table-cell">{item.opis || '-'}</td>
                                            <td className="px-3 py-3 md:px-4 text-right font-mono font-medium text-brand-600 whitespace-nowrap">
                                                {typeof item.cena === 'number' ? item.cena.toFixed(2) : parseFloat(item.cena || 0).toFixed(2)} zł
                                            </td>
                                            <td className="px-2 py-3 md:px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button 
                                                        onClick={() => handleEditItem(item, item.originalIndex)}
                                                        className="p-2 text-gray-500 hover:text-brand-600 bg-gray-50 hover:bg-brand-100 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteItem(item.originalIndex)}
                                                        className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <Search size={32} className="mb-2 opacity-20" />
                            <p className="text-sm font-medium text-gray-500">Brak wyników</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* MODAL (Responsive Full Screen on Mobile) */}
        {editingItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setEditingItem(null)} />
                
                {/* Modal Window */}
                <div className="bg-white w-full h-full md:h-auto md:max-w-lg md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-5 md:zoom-in-95 duration-200">
                    
                    {/* Modal Header */}
                    <div className="px-4 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0 safe-area-top">
                        <h3 className="font-bold text-gray-900 text-lg">
                            {editingItem.isNew ? 'Dodaj nową pozycję' : 'Edycja pozycji'}
                        </h3>
                        <button 
                            onClick={() => !isSaving && setEditingItem(null)} 
                            className="p-2 -mr-2 text-gray-500 hover:text-gray-800 transition-colors bg-white rounded-full shadow-sm border border-gray-200"
                            disabled={isSaving}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Modal Form (Scrollable) */}
                    <form onSubmit={handleSaveItem} className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nazwa materiału</label>
                            <textarea 
                                required
                                rows={2}
                                value={editingItem.nazwa}
                                onChange={(e) => setEditingItem({...editingItem, nazwa: e.target.value})}
                                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-base"
                                placeholder="Wpisz nazwę..."
                                disabled={isSaving}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Cena (PLN)</label>
                                <input 
                                    type="text" 
                                    inputMode="decimal"
                                    required
                                    placeholder="0.00"
                                    value={editingItem.cena}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^[0-9.,]*$/.test(val)) {
                                            setEditingItem({...editingItem, cena: val});
                                        }
                                    }}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-mono text-lg font-medium"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Kod / Opis</label>
                                <input 
                                    type="text" 
                                    value={editingItem.opis || ''}
                                    onChange={(e) => setEditingItem({...editingItem, opis: e.target.value})}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-base"
                                    placeholder="Opcjonalne"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* Opcje specjalne dla Okleiny */}
                        {activeCategory === 'okleina' && (
                            <div className="bg-brand-50 p-4 rounded-xl border border-brand-100">
                                <label className="block text-xs font-bold text-brand-700 uppercase tracking-wide mb-3">Typ pozycji</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-brand-100 shadow-sm cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="kategoria"
                                            checked={editingItem.kategoria !== 'usluga'}
                                            onChange={() => setEditingItem({...editingItem, kategoria: 'material'})}
                                            className="w-5 h-5 text-brand-600 focus:ring-brand-500"
                                            disabled={isSaving}
                                        />
                                        <div>
                                            <span className="block font-medium text-gray-900 text-sm">Materiał (Okleina)</span>
                                            <span className="block text-xs text-gray-500">System doliczy koszty usług.</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-brand-100 shadow-sm cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="kategoria"
                                            checked={editingItem.kategoria === 'usluga'}
                                            onChange={() => setEditingItem({...editingItem, kategoria: 'usluga'})}
                                            className="w-5 h-5 text-brand-600 focus:ring-brand-500"
                                            disabled={isSaving}
                                        />
                                        <div>
                                            <span className="block font-medium text-gray-900 text-sm">Usługa techniczna</span>
                                            <span className="block text-xs text-gray-500">Np. "KOSZT CIĘCIA" - stała cena.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Modal Footer (Sticky Bottom on Mobile) */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0 safe-area-bottom">
                        <button 
                            type="button" 
                            onClick={() => setEditingItem(null)} 
                            className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-50" 
                            disabled={isSaving}
                        >
                            Anuluj
                        </button>
                        <button 
                            onClick={handleSaveItem}
                            disabled={isSaving} 
                            className="flex-[2] px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default MaterialsManager;