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
    { id: 'projectSetup', label: 'Dane projektu', icon: FileText, category: 'project' },
    
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
    if (window.confirm('🆕 Rozpocząć nowy projekt? Obecny projekt roboczy zostanie wyczyszczony.')) {
      resetProject();
      setActiveTab('projectSetup');
      if (isOpen && window.innerWidth < 1024) closeSidebar();
    }
  };

  return (
    <>
      {/* Tło przyciemniające (Backdrop) dla mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-[100dvh] w-[280px] bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-out shadow-2xl lg:shadow-none lg:static lg:h-[calc(100vh-4rem)]
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header Mobilny */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button onClick={closeSidebar} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GŁÓWNY KONTENER SCROLLOWANIA (Przycisk + Menu + Stopka) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar space-y-6">
            
            {/* Przycisk Nowy Projekt */}
            <div>
              <button 
                onClick={handleNewProject}
                className="w-full flex items-center justify-center px-4 py-3 bg-brand-500 text-white rounded-xl font-bold shadow-md shadow-brand-500/20 hover:bg-brand-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Nowy projekt</span>
                <Sparkles className="w-4 h-4 ml-2 opacity-75" />
              </button>
            </div>

            {/* Lista Menu */}
            <div className="space-y-1">
                {menuItems.map((item) => {
                if (item.type === 'separator') {
                    return (
                    <div key={item.id} className="pt-4 pb-2 px-3">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
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
                        if (window.innerWidth < 1024) closeSidebar();
                    }}
                    className={`
                        w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-left group
                        ${isActive 
                        ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                    `}
                    >
                    <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-brand-400 flex-shrink-0" />}
                    </button>
                );
                })}
            </div>

            {/* SEKCJA INFORMACJE I STOPKA */}
            <div className="border-t border-gray-100 pt-6 mt-4 pb-8">
                <div className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    INFORMACJE
                </div>
                <div className="space-y-1 text-sm">
                    <Link to="/regulamin" className="flex items-center p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <FileText className="w-4 h-4 mr-3" /> Regulamin
                    </Link>
                    <Link to="/polityka-prywatnosci" className="flex items-center p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <Shield className="w-4 h-4 mr-3" /> Polityka Prywatności
                    </Link>
                    <Link to="/disclaimer" className="flex items-center p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <LifeBuoy className="w-4 h-4 mr-3" /> Nota Prawna
                    </Link>
                </div>
                
                {/* Stopka */}
                <div className="text-xs text-center space-y-2 pt-6 mt-2 opacity-70">
                    <p className="font-bold text-gray-400">QALQLY APP</p>
                    <p className="text-[10px] uppercase tracking-wider text-brand-500 font-bold">
                        Production System
                    </p>
                    <p className="text-[10px] text-gray-400">v{appVersion}</p>
                </div>
            </div>

        </div>
      </aside>
    </>
  );
};

export default Navigation;