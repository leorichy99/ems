import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const EmployeeSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/employee-dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/myprofile', name: 'My Profile', icon: '👤' },
    { path: '/mypayroll', name: 'My Payroll', icon: '💰' },
    { path: '/leave-requests', name: 'Leave Requests', icon: '🏖️' },

 

   
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
<div className={`fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static lg:inset-0 ${
  isOpen ? 'translate-x-0' : '-translate-x-full'
}`}>

        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">My Portal</h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded text-white hover:bg-blue-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default EmployeeSidebar;
