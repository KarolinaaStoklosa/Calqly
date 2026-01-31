import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { DROPDOWN_DATA } from '../data/dropdowns';

const MaterialsContext = createContext();
const prepareZeroPrices = (data) => {
  const zeroedData = {};
  Object.keys(data).forEach(category => {
    // Sprawdzamy czy to tablica (nasze listy materiałów)
    if (Array.isArray(data[category])) {
      zeroedData[category] = data[category].map(item => ({
        ...item,
        cena: 0 // <--- Każdy materiał dostaje cenę 0 na start
      }));
    } else {
      zeroedData[category] = data[category];
    }
  });
  return zeroedData;
};
export const useMaterials = () => useContext(MaterialsContext);

export const MaterialsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState(DROPDOWN_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jeśli użytkownik nie jest zalogowany, używamy domyślnych danych.
    if (!currentUser) {
      setMaterials(DROPDOWN_DATA);
      setLoading(false);
      return;
    }

    // Nasłuchiwanie zmian w bibliotece użytkownika
    const docRef = doc(db, 'users', currentUser.uid, 'materials', 'library');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        // Łączymy dane użytkownika z domyślnymi (żeby nowe kategorie się nie gubiły)
        setMaterials(prev => ({
          ...DROPDOWN_DATA,
          ...docSnap.data()
        }));
      } else {
        // Tworzenie biblioteki dla nowego usera
        const initialDataWithZeros = prepareZeroPrices(DROPDOWN_DATA);
        
        setDoc(docRef, initialDataWithZeros).catch(console.error);
        setMaterials(initialDataWithZeros);
      }
      setLoading(false);
    }, (error) => {
      console.error("Błąd wczytywania materiałów:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ✅ NAPRAWIONA FUNKCJA ZAPISU
  // Teraz przyjmuje dwa argumenty: kategorię i listę elementów
  const updateMaterials = async (category, newItems) => {
    if (!currentUser) return;

    const docRef = doc(db, 'users', currentUser.uid, 'materials', 'library');

    try {
      // Zapisujemy obiekt w formacie: { "drzwiPrzesuwne": [...] }
      // Używamy merge: true, aby nie skasować innych kategorii
      await setDoc(docRef, {
        [category]: newItems
      }, { merge: true });
      
      // Uwaga: Nie musimy ręcznie robić setMaterials, bo onSnapshot powyżej
      // sam wykryje zmianę w bazie i zaktualizuje stan aplikacji automatycznie.
    } catch (error) {
      console.error("Błąd zapisu materiałów:", error);
      throw error; // Rzucamy błąd dalej, żeby MaterialsManager mógł wyświetlić alert
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