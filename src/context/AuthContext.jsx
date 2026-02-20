import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import app from '../firebase/config';
import { DEFAULT_COMPANY_SETTINGS } from '../data/companyDefaults';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const [userData, setUserData] = useState(null);

  // 1. DODAJEMY STAN DLA USTAWIEŃ FIRMY
  const [settings, setSettings] = useState(null); 

  const auth = getAuth(app);
  const db = getFirestore(app);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    // Przy rejestracji tworzymy dokument z domyślnymi, pustymi ustawieniami
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date(),
      accessExpiresAt: trialEndDate, // Data wygaśnięcia dostępu
      subscription: { 
        status: 'trialing', // Status wskazujący na okres próbny
        trial_end: trialEndDate // Pole używane przez BillingStatus.jsx
      },
      settings: {} // Inicjalizujemy pusty obiekt ustawień
    });
    return userCredential;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);

    const existingUserDoc = await getDoc(userRef);

    if (!existingUserDoc.exists()) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
        accessExpiresAt: trialEndDate,
        subscription: {
          status: 'trialing',
          trial_end: trialEndDate
        },
        settings: {}
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        email: user.email
      }, { merge: true });
    }

    return userCredential;
  };
  
  const logout = () => signOut(auth);

  // 3. TWORZYMY FUNKCJĘ `updateSettings` (zamiast saveCompanyData)
  // Ta funkcja będzie pasować do Twojego komponentu CompanySettings.jsx
  const updateSettings = async (newSettings) => {
    if (currentUser) {
      // Optymistyczna aktualizacja UI
      setSettings(prev => ({ ...prev, ...newSettings }));
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userRef, { settings: newSettings }, { merge: true });
      } catch (error) {
        console.error("Błąd podczas zapisu ustawień firmy:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setLoading(true);
      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
             setUserData(data);
            // 2. Wczytujemy ustawienia firmy i subskrypcji
            const subStatus = data.subscription?.status || 'inactive';
            const expiresAt = data.accessExpiresAt?.toDate(); // Konwertujemy Timestamp na datę JS
            
            let finalStatus = subStatus;

            // Jeśli jest data wygaśnięcia, ma ona priorytet
            if (expiresAt) {
                if (new Date() < expiresAt) {
                    finalStatus = subStatus;
                } else {
                    finalStatus = 'inactive'; // Dostęp wygasł
                }
            }
            
            setSubscriptionStatus(finalStatus);
            const mergedSettings = {
              ...DEFAULT_COMPANY_SETTINGS,
              ...(data.settings || {})
            };
            
            setSettings(mergedSettings);
          } else {
            // Użytkownik jest w Auth, ale nie ma go w Firestore - tworzymy dokument
             setDoc(userRef, {
                email: user.email,
                createdAt: new Date(),
                subscription: { status: 'inactive' },
                settings: {}
            });
            setSubscriptionStatus('inactive');
            
           setSettings(DEFAULT_COMPANY_SETTINGS);
          }
          setLoading(false);
        }, (error) => {

          setLoading(false);
        });
        return () => unsubscribeProfile(); 
      } else {
        setSubscriptionStatus(null);
        setUserData(null);
        setSettings(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  const value = {
    currentUser,
    loading,
    subscriptionStatus,
    userData,
    subscription: userData?.subscription, 
    settings, // 4. DODAJEMY `settings` i `updateSettings` DO WARTOŚCI KONTEKSTU
    updateSettings,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};