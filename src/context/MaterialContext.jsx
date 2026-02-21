import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { DROPDOWN_DATA } from '../data/dropdowns';

const MaterialsContext = createContext();

// 🔧 FUNKCJA NAPRAWCZA (Sanityzacja) - TO JEST KLUCZ DO SUKCESU
// Ta funkcja łączy dane z pliku z danymi usera i GWARANTUJE, że każdy element ma ID.
const sanitizeAndMerge = (staticData, userData) => {
  // 1. Łączymy kategorie (np. user dodał nową kategorię, której nie ma w pliku)
  const categories = new Set([...Object.keys(staticData || {}), ...Object.keys(userData || {})]);
  const sanitized = {};

  categories.forEach(category => {
    const staticItems = staticData?.[category];
    const userItems = userData?.[category];
    let items = userItems;

    if (Array.isArray(staticItems) || Array.isArray(userItems)) {
      const hasUserItems = Array.isArray(userItems) && userItems.length > 0;
      if ((category === 'tyly' || category === 'fronty') && Array.isArray(staticItems) && hasUserItems) {
        const mergedMap = new Map();
        staticItems.forEach(item => mergedMap.set(item.nazwa, item));
        userItems.forEach(item => mergedMap.set(item.nazwa, item));
        items = Array.from(mergedMap.values());
      } else {
        items = hasUserItems ? userItems : staticItems;
      }
    }
    
    if (Array.isArray(items)) {
      sanitized[category] = items.map((item, index) => {
        // 🚀 MAGIA: Generujemy ID na podstawie nazwy, jeśli go brakuje.
        // Usuwamy spacje i znaki specjalne, żeby ID było bezpieczne (np. "Egger W1000" -> "eggerw1000")
        const safeName = item.nazwa?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `item${index}`;
        
        // Jeśli element ma już ID (bo był edytowany), to je zostawiamy.
        // Jeśli nie ma (bo jest z pliku), dostaje stałe ID "auto_..."
        const generatedId = item.id || `auto_${category}_${safeName}`;
        
        return {
          ...item,
          id: generatedId,
          // Upewniamy się, że cena jest liczbą (a nie tekstem "12.50")
          cena: typeof item.cena === 'number' ? item.cena : parseFloat(item.cena || 0),
          // Upewniamy się, że typ jest ustawiony (potrzebne do filtrów)
          typ: item.typ || (category === 'okleina' && item.nazwa?.includes('KOSZT') ? 'usluga' : 'produkt'),
          opis: item.opis || ''
        };
      });
    } else {
      sanitized[category] = items;
    }
  });

  return sanitized;
};

export const useMaterials = () => useContext(MaterialsContext);

export const MaterialsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState(DROPDOWN_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Jeśli brak użytkownika, ładujemy dane statyczne, ale NAPRAWIONE (z ID)
    if (!currentUser) {
      setMaterials(sanitizeAndMerge(DROPDOWN_DATA, {}));
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', currentUser.uid, 'materials', 'library');

    // 2. Nasłuchujemy zmian w bazie
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // TYLKO dane usera - bez mergowania z domyślnymi
        const finalData = sanitizeAndMerge({}, userData);
        setMaterials(finalData);
      } else {
        // Pierwszy login - tworzysz czystą bazę z domyślnych
        const initialData = sanitizeAndMerge(DROPDOWN_DATA, {});
        
        // Zapisz do Firestore
        setDoc(docRef, initialData).catch(console.error);
        setMaterials(initialData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Błąd wczytywania materiałów:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Funkcja zapisu do bazy
  const updateMaterials = async (category, newItems) => {
    if (!currentUser) return;

    // Przed samym zapisem upewniamy się na 100%, że wszystko ma ID
    const itemsToSave = newItems.map(item => ({
        ...item,
        id: item.id || `save_${Date.now()}_${Math.random().toString(36).substr(2,5)}`
    }));

    const docRef = doc(db, 'users', currentUser.uid, 'materials', 'library');

    try {
      await setDoc(docRef, {
        [category]: itemsToSave
      }, { merge: true });
    } catch (error) {
      console.error("Błąd zapisu materiałów:", error);
      throw error;
    }
  };

  const value = {
    materials,
    loading,
    updateMaterials,
  };

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
};