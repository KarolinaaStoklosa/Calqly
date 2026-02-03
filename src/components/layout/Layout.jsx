import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import ExpirationNotifier from '../billing/ExpirationNotifier';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculation');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Nawigacja z obsługą mobilną */}
        <Navigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />
        
        {/* Główna treść - Poprawione paddingi dla mobile */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 scroll-smooth">
          <div className="max-w-7xl mx-auto px-3 py-4 md:px-6 md:py-8 lg:px-8">
             <ExpirationNotifier />
             {/* Kontener na treść */}
             <div className="animate-in fade-in duration-300">
                {children({activeTab, setActiveTab})}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;