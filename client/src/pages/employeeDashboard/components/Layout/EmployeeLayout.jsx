import React, { useState } from 'react';
import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeLayout = ({ children, onLogout, currentEmployee }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeNavbar 
        onLogout={onLogout} 
        toggleSidebar={toggleSidebar} 
        currentEmployee={currentEmployee}
      />
      
      <div className="flex">
        <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 lg:ml-0 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
