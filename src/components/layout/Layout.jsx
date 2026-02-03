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
        <Navigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />
        
        {/* Zmieniono padding: p-3 na mobile, p-8 na desktopie */}
        <main className="flex-1 w-full overflow-y-auto bg-gray-50 p-3 md:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
             <ExpirationNotifier />
            {children({activeTab, setActiveTab})}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;