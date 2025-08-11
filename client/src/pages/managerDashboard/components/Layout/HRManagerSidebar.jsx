import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HRManagerSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/manager-dashboard', name: 'Dashboard', icon: '📊', category: 'main' },
    { path: '/tasks', name: 'Tasks', icon: '✅' },
    { path: '/recruitment', name: 'Recruitment', icon: '🎯', category: 'recruitment' },
    { path: '/employee-management', name: 'Employee Management', icon: '👥', category: 'employees' },
    { path: '/leave-management', name: 'Leave Management', icon: '🏖️', category: 'employees' },
    { path: '/hr-settings', name: 'Settings', icon: '⚙️', category: 'settings' },
  ];

  const categories = {
    main: 'Overview',
    employees: 'Employee Management',
    payroll: 'Payroll & Benefits',
    performance: 'Performance',
    recruitment: 'Talent Acquisition',
    reports: 'Analytics',
    development: 'Development',
    admin: 'Administration',
    settings: 'Settings'
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

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
  <div
  className={`fixed left-0 top-0 bottom-0 h-screen w-72 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static lg:inset-0 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
  <div className="p-4 h-full overflow-y-auto">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-bold">HR Portal</h2>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-1 rounded text-white hover:bg-blue-800"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <nav className="space-y-6">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            {categories[category]}
          </h3>
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  window.innerWidth < 1024 && toggleSidebar()
                }
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  </div>
</div>

    </>
  );
};

export default HRManagerSidebar;
