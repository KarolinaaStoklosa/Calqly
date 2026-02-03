import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { Menu, User, LogOut, Edit, Save, X, Loader2, FileText } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import BillingStatus from '../billing/BilingStatus';

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isEditMode, setIsEditMode, saveDataToFirestore, isSaving, projectData } = useProject();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    }
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      const functions = getFunctions();
      const createPortalLink = httpsCallable(functions, 'createPortalLink');
      const result = await createPortalLink();
      window.location.href = result.data.url;
    } catch (error) {
      console.error("Błąd podczas otwierania portalu subskrypcji:", error);
      alert("Nie udało się otworzyć portalu zarządzania subskrypcją. Spróbuj ponownie.");
      setIsPortalLoading(false);
    }
  };

   const handleCancelEdit = () => {
    if (window.confirm("Czy na pewno chcesz anulować zmiany? Wszystkie niezapisane dane zostaną utracone.")) {
        window.location.reload(); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  return (
    // ZMIANA: Usunięto '/95' i 'backdrop-blur-lg', jest teraz czyste 'bg-white'
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        
        {/* === LEWA STRONA (LOGO + MENU) === */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Otwórz menu</span>
          </button>
          
          <Link to="/" className="flex items-center gap-3 group">
            {/* LOGO SVG - ZWIĘKSZONE */}
            <div className="relative h-10 w-10 flex items-center justify-center">
                <img 
                    src="/logo.svg" 
                    alt="Qalqly Logo" 
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            
            {/* TYPOGRAFIA LOGO - Q POMARAŃCZOWE */}
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                <span className="text-brand-500">Q</span>AL<span className="text-brand-500">Q</span>LY
              </h1>
            </div>
          </Link>
        </div>

        {/* === NAZWA PROJEKTU (ŚRODEK) === */}
        <div className="hidden md:flex flex-1 justify-center px-4">
           {projectData && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <FileText className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[200px] truncate">
                {projectData.projectName || 'Nowy Projekt'}
              </span>
            </div>
          )}
        </div>

        {/* === PRAWA STRONA (AKCJE) === */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* PRZYCISKI EDYCJI */}
          {currentUser && (
            <div className="flex items-center gap-2">
                {!isEditMode ? (
                    <button 
                        onClick={() => setIsEditMode(true)} 
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-all text-sm border border-transparent hover:border-brand-200"
                    >
                        <Edit size={16} /> <span className="hidden sm:inline">Edytuj</span>
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={handleCancelEdit} 
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            <X size={16} /> <span className="hidden sm:inline">Anuluj</span>
                        </button>
                        <button 
                            onClick={saveDataToFirestore} 
                            disabled={isSaving} 
                            className="flex items-center gap-2 bg-brand-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-600 shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span>{isSaving ? '...' : 'Zapisz'}</span>
                        </button>
                    </>
                )}
            </div>
          )}
          
          {/* SEPARATOR */}
          {currentUser && (
            <div className="hidden sm:block h-8 border-l border-gray-200 dark:border-gray-700"></div>
          )}

          {/* PROFIL UŻYTKOWNIKA */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Konto</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-50 overflow-hidden">
                    <div className="py-1">
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Zalogowano jako</p>
                        <p className="text-sm font-bold text-gray-900 truncate mt-1">{currentUser.email}</p>
                      </div>
                      
                      <div className="p-2">
                        <BillingStatus variant="dropdown" />
                      </div>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Wyloguj się</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 shadow-md transition-all"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline sr-only">Zaloguj się</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;