import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { 
  Calculator, Menu, User, LogOut, Edit, Save, 
  X, Loader2, ChevronRight, FileText 
} from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import BillingStatus from '../billing/BilingStatus';
import Button from './Button'; // Zakładam, że Button jest w tym samym katalogu lub odpowiednio zaimportowany

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isEditMode, setIsEditMode, saveDataToFirestore, isSaving, projectData } = useProject();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
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
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90 shadow-sm transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* === LEWA STRONA === */}
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            aria-label="Otwórz menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-md">
                <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50 tracking-tight">Qalqly</h1>
              <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">Kalkulator wycen</p>
            </div>
          </div>
        </div>

        {/* === ŚRODEK (Breadcrumbs) - Ukryty na mobile dla oszczędności miejsca === */}
        <div className="flex items-center justify-between gap-4">
           {projectData && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700 max-w-[150px] truncate">{projectData.projectName || 'Nowy Projekt'}</span>
            </div>
          )}
        </div>

        {/* === PRAWA STRONA === */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Grupa przycisków Edycji - ZMODYFIKOWANA */}
          {currentUser && (
            <div className="flex items-center gap-2">
                {!isEditMode ? (
                    <Button 
                      onClick={() => setIsEditMode(true)} 
                      variant="primary"
                      size="sm" // Mniejszy rozmiar dla lepszego dopasowania
                      className="flex items-center gap-2"
                    >
                        <Edit size={16} /> 
                        <span className="hidden sm:inline">Tryb Edycji</span>
                    </Button>
                ) : (
                    <>
                        <Button 
                          onClick={handleCancelEdit} 
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                          title="Anuluj"
                        >
                            <X size={18} /> 
                            <span className="hidden sm:inline">Anuluj</span>
                        </Button>
                        
                        <Button 
                          onClick={saveDataToFirestore} 
                          disabled={isSaving} 
                          variant="success" // Używamy wariantu success z Twojego Button.jsx
                          size="sm"
                          className="flex items-center gap-2 shadow-sm"
                          title="Zapisz"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span className="hidden sm:inline">{isSaving ? 'Zapisywanie...' : 'Zapisz'}</span>
                        </Button>
                    </>
                )}
            </div>
          )}
          
          {/* Separator - ukryty na bardzo małych ekranach */}
          {currentUser && (
            <div className="hidden sm:block h-8 border-l border-gray-200 dark:border-gray-700"></div>
          )}

          {/* Grupa ikony Użytkownika */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Konto</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Zalogowano jako</p>
                      <p className="text-sm font-semibold text-gray-900 truncate mt-1">{currentUser.email}</p>
                    </div>
                    
                    <div className="p-2">
                       {/* Komponent statusu subskrypcji */}
                       <div className="px-2 py-1">
                          <BillingStatus variant="dropdown" />
                       </div>
                    </div>

                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Wyloguj się</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Zaloguj się</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;