import React, { useState } from 'react';
import { useMaterials } from '../../context/MaterialContext';
import { Plus, Trash2, Edit, Loader2, Info, Search, X } from 'lucide-react';

const CATEGORY_NAMES = {
  plytyMeblowe: "Płyty Meblowe",
  okleina: "Okleina",
  fronty: "Fronty",
  tylHdf: "Tył HDF",
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
        // Konwertujemy cenę na string, żeby edycja była łatwiejsza
        cena: item.cena !== undefined ? item.cena.toString().replace('.', ',') : '' 
    });
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);

    try {
        // 1. Bezpieczna kopia listy
        const currentList = Array.from(materials[activeCategory] || []);

        // 2. Naprawa Ceny (Polska waluta: zamiana przecinka na kropkę)
        let priceString = editingItem.cena.toString().replace(',', '.');
        let finalPrice = parseFloat(priceString);

        if (isNaN(finalPrice)) finalPrice = 0;

        // 3. Obiekt do zapisu
        const itemToSave = {
            nazwa: editingItem.nazwa.trim(),
            opis: editingItem.opis ? editingItem.opis.trim() : '',
            cena: finalPrice,
            kategoria: editingItem.kategoria || activeCategory
        };

        if (editingItem.isNew) {
            currentList.push(itemToSave);
        } else {
            if (typeof editingItem.originalIndex === 'number' && editingItem.originalIndex >= 0) {
                currentList[editingItem.originalIndex] = itemToSave;
            } else {
                throw new Error("Błąd indeksu elementu");
            }
        }

        // 4. Zapis do Firebase (teraz zadziała poprawnie z nowym Contextem)
        await updateMaterials(activeCategory, currentList);
        
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

  // Filtrowanie z zachowaniem oryginalnych indeksów
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
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500">Ładowanie bazy materiałów...</span>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-120px)]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Baza Materiałów</h2>
                <p className="text-sm text-gray-500">Zarządzaj cenami i asortymentem</p>
            </div>
            <button onClick={handleAddItem} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                <Plus size={18} />
                <span>Dodaj pozycję</span>
            </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 flex flex-col gap-1">
                {Object.keys(CATEGORY_NAMES).map((catKey) => (
                    <button
                        key={catKey}
                        onClick={() => { setActiveCategory(catKey); setSearchTerm(''); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
                            ${activeCategory === catKey 
                                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {CATEGORY_NAMES[catKey]}
                        <span className="float-right text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-400 mt-0.5">
                            {materials[catKey]?.length || 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* TABELA */}
            <div className="flex-1 overflow-y-auto p-6 bg-white relative">
                <div className="mb-4 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Szukaj po nazwie lub kodzie..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                    />
                </div>

                {filteredItems.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 w-12 text-center">#</th>
                                    <th className="px-4 py-3">Nazwa materiału</th>
                                    <th className="px-4 py-3">Opis / Kod</th>
                                    <th className="px-4 py-3 text-right">Cena (netto)</th>
                                    <th className="px-4 py-3 w-24 text-center">Akcje</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.map((item) => (
                                    <tr key={`${item.nazwa}-${item.originalIndex}`} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="px-4 py-3 text-center text-gray-400 font-mono text-xs">
                                            {item.originalIndex + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.nazwa}</td>
                                        <td className="px-4 py-3 text-gray-500">{item.opis || '-'}</td>
                                        <td className="px-4 py-3 text-right font-mono font-medium text-blue-600">
                                            {typeof item.cena === 'number' ? item.cena.toFixed(2) : parseFloat(item.cena || 0).toFixed(2)} zł
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEditItem(item, item.originalIndex)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                                    title="Edytuj"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteItem(item.originalIndex)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                                    title="Usuń"
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
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-500">Brak wyników</p>
                    </div>
                )}
            </div>
        </div>

        {/* MODAL */}
        {editingItem && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">
                            {editingItem.isNew ? 'Dodaj nowy materiał' : 'Edytuj materiał'}
                        </h3>
                        <button 
                            onClick={() => !isSaving && setEditingItem(null)} 
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isSaving}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nazwa</label>
                            <input 
                                type="text" 
                                required
                                value={editingItem.nazwa}
                                onChange={(e) => setEditingItem({...editingItem, nazwa: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Np. Płyta Dąb Sonoma"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                    disabled={isSaving}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Możesz używać kropki lub przecinka</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Opis / Kod</label>
                                <input 
                                    type="text" 
                                    value={editingItem.opis || ''}
                                    onChange={(e) => setEditingItem({...editingItem, opis: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Np. K001"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* Opcje specjalne dla Okleiny */}
                        {activeCategory === 'okleina' && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Typ pozycji</label>
                                <div className="flex gap-4 text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="kategoria"
                                            checked={editingItem.kategoria !== 'usluga'}
                                            onChange={() => setEditingItem({...editingItem, kategoria: 'material'})}
                                            className="text-blue-600 focus:ring-blue-500"
                                            disabled={isSaving}
                                        />
                                        <span>Materiał</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="kategoria"
                                            checked={editingItem.kategoria === 'usluga'}
                                            onChange={() => setEditingItem({...editingItem, kategoria: 'usluga'})}
                                            className="text-blue-600 focus:ring-blue-500"
                                            disabled={isSaving}
                                        />
                                        <span>Usługa (np. Cięcie)</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                            <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors" disabled={isSaving}>Anuluj</button>
                            <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default MaterialsManager;