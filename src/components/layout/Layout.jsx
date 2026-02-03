import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import ExpirationNotifier from '../billing/ExpirationNotifier';

const Layout = ({ children }) => {
  // Remove darkMode state or set initial state to false and never change it
  // const [darkMode, setDarkMode] = useState(false); 
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculation');

  // Remove or disable toggle logic
  const toggleDarkMode = () => {
    // setDarkMode(!darkMode); 
    // Logic removed to enforce light mode
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    // FORCE LIGHT MODE: Removed `${darkMode ? 'dark' : ''}`
    // Ensure the outer div always has a light background like bg-gray-50
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        darkMode={false} // Pass false explicitly
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
        
        {/* Adjusted padding for mobile (p-3) and desktop (p-8) */}
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