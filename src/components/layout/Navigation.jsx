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
    { id: 'blaty', label: 'Blaty i Usługi', icon: Square, category: 'calculation' },
    { id: 'akcesoria', label: 'Akcesoria', icon: Wrench, category: 'calculation' },
  ];

  return (
    <>
      {/* Tło przyciemniające (Backdrop) dla mobile */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-[100dvh] w-[280px] bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] 
        flex flex-col shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Nagłówek Menu (Tylko Mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden shrink-0">
            <span className="font-bold text-gray-900">Menu</span>
            <button onClick={closeSidebar} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Scrollowana Lista Elementów */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            if (item.type === 'separator') {
              return (
                <div key={item.id} className="mt-6 mb-2 px-3 text-[11px] font-black tracking-widest text-gray-400 uppercase">
                  {item.label}
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
                  w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                {item.label}
                {isActive && <ChevronRight className="ml-auto w-4 h-4 text-brand-400" />}
              </button>
            );
          })}
          {/* Dodatkowy padding na dole listy, żeby nie ucięło ostatniego elementu na małych ekranach */}
          <div className="h-6"></div>
        </div>

        {/* Stopka (Przyklejona na dole) */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 shrink-0 safe-area-bottom">
          <div className="space-y-1 text-sm">
            <Link to="/regulamin" className="flex items-center p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <Book className="w-4 h-4 mr-3" /> Regulamin
            </Link>
            <Link to="/polityka-prywatnosci" className="flex items-center p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <Shield className="w-4 h-4 mr-3" /> Polityka Prywatności
            </Link>
             <Link to="/disclaimer" className="flex items-center p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <LifeBuoy className="w-4 h-4 mr-3" /> Nota Prawna
            </Link>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1 pt-3 border-t border-gray-200 mt-2 text-center">
            <p className="font-bold text-gray-600">QALQLY APP</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-500 font-bold">
              by WOODLY GROUP
            </p>
            <p>v{appVersion}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;