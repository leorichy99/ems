import React, { useState } from 'react';
import HRManagerNavbar from './HRManagerNavbar';
import HRManagerSidebar from './HRManagerSidebar';

const HRManagerLayout = ({ children, onLogout, currentManager }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HRManagerNavbar 
        onLogout={onLogout} 
        toggleSidebar={toggleSidebar} 
        currentManager={currentManager}
      />
      
      <div className="flex">
        <HRManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 lg:ml-0 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRManagerLayout;
