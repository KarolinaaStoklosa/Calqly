import React, { useState } from 'react';
import { useMaterials } from '../../context/MaterialContext';
import { Plus, Trash2, Edit, Loader2, Info } from 'lucide-react';

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

  const handleAddItem = () => {
    const newItem = {
      id: null, // Tymczasowe ID do rozróżnienia dodawania od edycji
      nazwa: 'Nowy Materiał',
      cena: 0,
      opis: '',
      kategoria: activeCategory, // Domyślna kategoria zgodna z aktywną zakładką
    };

    // ✅ AUTOMATYZACJA: Ustawiamy domyślne typy dla specyficznych kategorii
    if (activeCategory === 'blaty') {
      newItem.typ = 'produkt';
    }
    if (activeCategory === 'okleina') {
      newItem.kategoria = 'material'; // Domyślnie dodajemy taśmę, a nie usługę
    }

    setEditingItem(newItem);
  };

  const handleEditItem = (item, index) => {
    // Przypisujemy index jako ID, aby wiedzieć, który element edytujemy
    setEditingItem({ ...item, id: index });
  };

  const handleSaveItem = (itemToSave) => {
    const newMaterials = { ...materials };
    const categoryItems = [...(newMaterials[activeCategory] || [])];
    
    // Oddzielamy ID (index) od reszty danych do zapisu
    const { id, ...dataToSave } = itemToSave;

    if (id !== null && categoryItems[id]) {
      // EDYCJA: Aktualizujemy istniejący element
      categoryItems[id] = { ...categoryItems[id], ...dataToSave };
    } else {
      // DODAWANIE: Dodajemy nowy element na koniec listy
      categoryItems.push(dataToSave);
    }
    
    newMaterials[activeCategory] = categoryItems;
    updateMaterials(newMaterials);
    setEditingItem(null);
  };

  const handleRemoveItem = (indexToRemove) => {
      if (window.confirm("Czy na pewno chcesz usunąć ten materiał?")) {
          const newMaterials = { ...materials };
          const categoryItems = (newMaterials[activeCategory] || []).filter((_, index) => index !== indexToRemove);
          newMaterials[activeCategory] = categoryItems;
          updateMaterials(newMaterials);
      }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Zarządzanie Materiałami</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEWY PANEL: KATEGORIE */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 px-2">Kategorie</h2>
          <ul className="space-y-1">
            {Object.keys(materials).map(catKey => (
              <li key={catKey}>
                <button 
                  onClick={() => setActiveCategory(catKey)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === catKey ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {CATEGORY_NAMES[catKey] || catKey}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* PRAWY PANEL: LISTA MATERIAŁÓW */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">{CATEGORY_NAMES[activeCategory] || activeCategory}</h2>
            <button onClick={handleAddItem} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
              <Plus size={16} /> Dodaj Nowy
            </button>
          </div>
          
          <div className="space-y-2">
            {(materials[activeCategory] || []).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{item.nazwa}</p>
                    
                    {/* ✅ WIZUALIZACJA: Badge dla okleiny */}
                    {activeCategory === 'okleina' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide border ${
                            item.kategoria === 'usluga' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-blue-50 text-blue-600 border-blue-200'
                        }`}>
                            {item.kategoria === 'usluga' ? 'Usługa Tech.' : 'Materiał'}
                        </span>
                    )}

                    {/* ✅ WIZUALIZACJA: Badge dla blatów */}
                    {activeCategory === 'blaty' && item.typ && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide border ${
                            item.typ === 'usługa' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-green-50 text-green-600 border-green-200'
                        }`}>
                            {item.typ === 'usługa' ? 'Usługa' : 'Produkt'}
                        </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.opis}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <p className="font-mono text-blue-600 font-bold text-lg">{item.cena.toFixed(2)} zł</p>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditItem(item, index)} className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-600 transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleRemoveItem(index)} className="p-2 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {(materials[activeCategory] || []).length === 0 && (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    Brak materiałów w tej kategorii. Dodaj pierwszy!
                </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EDYCJI / DODAWANIA */}
      {editingItem && (
        <EditModal 
          item={editingItem} 
          onSave={handleSaveItem}
          onClose={() => setEditingItem(null)}
          category={activeCategory} 
        />
      )}
    </div>
  );
};

// --- KOMPONENT MODALA ---
const EditModal = ({ item, onSave, onClose, category }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {item.id !== null ? 'Edytuj Materiał' : 'Dodaj Nowy Materiał'}
                    </h2>
                    <span className="text-xs font-bold uppercase text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {CATEGORY_NAMES[category]}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
                        <input type="text" value={formData.nazwa} onChange={e => setFormData({...formData, nazwa: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="np. Dąb Naturalny" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cena (zł)</label>
                        <div className="relative">
                            <input type="number" step="0.01" value={formData.cena} onChange={e => setFormData({...formData, cena: parseFloat(e.target.value) || 0})} className="w-full p-2.5 pl-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">PLN</span>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                        <input type="text" value={formData.opis} onChange={e => setFormData({...formData, opis: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Krótki opis..." />
                    </div>

                    {/* ✅ WARUNEK DLA BLATÓW */}
                    {category === 'blaty' && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Typ pozycji</label>
                            <select 
                                value={formData.typ} 
                                onChange={e => setFormData({...formData, typ: e.target.value})} 
                                className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="produkt">Produkt (licz na sztuki w podsumowaniu)</option>
                                <option value="usługa">Usługa (bez ilości w podsumowaniu)</option>
                            </select>
                        </div>
                    )}

                    {/* ✅ WARUNEK DLA OKLEINY */}
                    {category === 'okleina' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <label className="block text-sm font-bold text-blue-900 mb-2">Rodzaj pozycji</label>
                            <select
                                value={formData.kategoria || 'material'}
                                onChange={e => setFormData({...formData, kategoria: e.target.value})}
                                className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="material">Materiał (Taśma)</option>
                                <option value="usluga">Usługa techniczna (np. Koszt Cięcia)</option>
                            </select>
                            
                            <div className="flex gap-2 mt-3 text-xs text-blue-800 bg-white/60 p-2 rounded border border-blue-100">
                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {formData.kategoria === 'material' ? (
                                    <p>
                                        Wybierz tę opcję dla nowych oklein. W kalkulacji szafek system <strong>automatycznie doliczy</strong> do ceny tego materiału zdefiniowane koszty usług (cięcie + oklejanie).
                                    </p>
                                ) : (
                                    <p>
                                        Wybierz tę opcję <strong>tylko dla pozycji technicznych</strong> (np. "KOSZT CIĘCIA"). Te pozycje będą ukryte na liście wyboru w szafkach, ale są niezbędne do obliczeń w tle.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Anuluj</button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">Zapisz zmiany</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialsManager;