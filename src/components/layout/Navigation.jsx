import React from 'react';
import { 
  Calculator, Archive, Book,
  Package, Eye, Move, Grip, RotateCcw, ArrowUp, 
  Package2, Square, Wrench, Plus, LifeBuoy, 
  FileInput, PieChart, X,
  ChevronRight, Sparkles, FileText, Shield
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Link } from 'react-router-dom';

const Navigation = ({ activeTab, setActiveTab, isOpen, closeSidebar }) => {

  const { resetProject } = useProject();
  const appVersion = "1.0.0";
  
  const menuItems = [
    { id: 'companySettings', label: 'Dane Firmy', icon: FileInput, category: 'project' },
    { id: 'projectSetup', label: 'Dane projektu', icon: FileInput, category: 'project' },
    
    { id: 'separator-0', type: 'separator', label: 'KALKULACJA' },
    
    { id: 'szafki', label: 'Szafki/Korpusy', icon: Package, category: 'calculation' },
    { id: 'szuflady', label: 'Szuflady', icon: Package2, category: 'calculation' },
    { id: 'widocznyBok', label: 'Widoczny Bok', icon: Eye, category: 'calculation' },
    { id: 'drzwiPrzesuwne', label: 'Drzwi Przesuwne', icon: Move, category: 'calculation' },
    { id: 'uchwyty', label: 'Uchwyty', icon: Grip, category: 'calculation' },
    { id: 'zawiasy', label: 'Zawiasy', icon: RotateCcw, category: 'calculation' },
    { id: 'podnosniki', label: 'Podnośniki', icon: ArrowUp, category: 'calculation' },
    { id: 'blaty', label: 'Blaty', icon: Square, category: 'calculation' },
    { id: 'akcesoria', label: 'Akcesoria', icon: Wrench, category: 'calculation' },
    
    { id: 'separator-1', type: 'separator', label: 'ANALIZY' },
    
    { id: 'kalkulacja', label: 'Pozostałe Koszty', icon: Calculator, category: 'financial' },
    { id: 'podsumowanie', label: 'Podsumowanie', icon: PieChart, category: 'summary' },
    
    { id: 'separator-2', type: 'separator', label: 'ZARZĄDZANIE' },
    
    { id: 'archive', label: 'Archiwum', icon: Archive, category: 'storage' },
    { id: 'materials', label: 'Zarządzaj Materiałami', icon: Book, category: 'system' },
  ];

  const handleNewProject = () => {
    if (confirm('🆕 Rozpocząć nowy projekt? Obecny projekt roboczy zostanie wyczyszczony.')) {
      resetProject();
      setActiveTab('projectSetup');
      if (isOpen) closeSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r
        transform transition-all duration-300 ease-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header Mobilny */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={closeSidebar} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Przycisk Nowy Projekt - pozostaje przypięty na górze dla szybkiego dostępu */}
        <div className="p-4">
          <button 
            onClick={handleNewProject}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>Nowy projekt</span>
            <Sparkles className="w-4 h-4 ml-2 opacity-75" />
          </button>
        </div>

        {/* GŁÓWNY KONTENER SCROLLOWANIA 
            Zawiera teraz zarówno listę menu, jak i sekcję Informacje/Stopkę.
        */}
        <div className="flex-grow px-4 overflow-y-auto pb-8"> {/* Dodano pb-8 dla oddechu na dole */}
          
          {/* Lista Menu */}
          <div className="space-y-1 pb-4">
            {menuItems.map((item) => {
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className="pt-4 pb-2">
                    <div className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {item.label}
                    </div>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isOpen) closeSidebar();
                  }}
                  className={`
                    w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg
                    transition-all duration-200 text-left group
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* SEKCJA INFORMACJE I STOPKA 
              Przeniesiona tutaj, aby scrollować się razem z resztą.
              Zmieniono p-4 na py-4, ponieważ kontener nadrzędny ma już px-4.
          */}
          <div className="border-t py-4 space-y-4 mt-2">
            <div className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                INFORMACJE
            </div>
            <div className="space-y-1 text-sm">
              <Link to="/regulamin" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <FileText className="w-4 h-4 mr-3 text-gray-400" /> Regulamin
              </Link>
              <Link to="/polityka-prywatnosci" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <Shield className="w-4 h-4 mr-3 text-gray-400" /> Polityka Prywatności
              </Link>
               <Link to="/disclaimer" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <LifeBuoy className="w-4 h-4 mr-3 text-gray-400" /> Zastrzeżenia Prawne
              </Link>
            </div>
            
            {/* Stopka firmy */}
            <div className="text-xs text-gray-500 space-y-2 pt-2 border-t mt-4">
              <p className="font-bold text-gray-600">WOODLY GROUP</p>
              <p>NIP: 8682002241</p>
              <p>REGON: 542994185</p>
              <p>Adres: ul. Limanowska 28A, 32-720 Nowy Wiśnicz</p>
              <p>Kontakt: <a href="mailto:b.stoklosa@woodlygroup.pl" className="text-blue-600 hover:underline">b.stoklosa@woodlygroup.pl</a></p>
              <p className="pt-2">&copy; {new Date().getFullYear()} Qalqly. Wersja {appVersion}</p>
            </div>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navigation;