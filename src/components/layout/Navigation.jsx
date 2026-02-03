import React from 'react';
import { 
  Package, Eye, Package2, FileInput, 
  ChevronRight, X, LogOut, FileText
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Link } from 'react-router-dom';

const Navigation = ({ activeTab, setActiveTab, isOpen, closeSidebar }) => {

  const appVersion = "1.0.0";
  
  const menuItems = [
    { id: 'companySettings', label: 'Dane Firmy', icon: FileInput, category: 'project' },
    { id: 'projectSetup', label: 'Dane projektu', icon: FileText, category: 'project' },
    
    { id: 'separator-0', type: 'separator', label: 'KALKULACJA' },
    
    { id: 'szafki', label: 'Szafki/Korpusy', icon: Package, category: 'calculation' },
    { id: 'szuflady', label: 'Szuflady', icon: Package2, category: 'calculation' },
    { id: 'widocznyBok', label: 'Widoczny Bok', icon: Eye, category: 'calculation' },
    { id: 'drzwiPrzesuwne', label: 'Drzwi Przesuwne', icon: Package, category: 'calculation' },
    { id: 'uchwyty', label: 'Uchwyty', icon: Package, category: 'calculation' },
    { id: 'zawiasy', label: 'Zawiasy', icon: Package, category: 'calculation' },
    { id: 'podnosniki', label: 'Podnośniki', icon: Package, category: 'calculation' },
    { id: 'blaty', label: 'Blaty i Usługi', icon: Package, category: 'calculation' },
    { id: 'akcesoria', label: 'Akcesoria', icon: Package, category: 'calculation' },
  ];

  return (
    <>
      {/* 1. BACKDROP (Tylko Mobile) - Ciemne tło po otwarciu menu */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* 2. SIDEBAR */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-2xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Nagłówek Menu na Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
            <span className="font-bold text-lg text-gray-800">Menu</span>
            <button onClick={closeSidebar} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-600" />
            </button>
        </div>

        {/* Lista Elementów - Scrollowana */}
        <div className="h-[calc(100%-60px)] overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item, index) => {
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
                  relative group flex items-center w-full px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {isActive && (
                    <div className="absolute left-0 h-8 w-1 bg-brand-500 rounded-r-full" />
                )}
                
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-brand-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                
                <span className="flex-1 text-left">{item.label}</span>
                
                {isActive && <ChevronRight className="w-4 h-4 text-brand-400" />}
              </button>
            );
          })}
        </div>

        {/* Stopka Nawigacji */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col gap-2 text-[10px] text-gray-400 text-center">
                <Link to="/polityka-prywatnosci" className="hover:text-brand-500 transition-colors">Polityka Prywatności</Link>
                <span>v{appVersion} • Qalqly App</span>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;