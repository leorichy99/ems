import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  const quickLinks = [
    { to: '/employees', icon: '👤', label: 'Employees' },
    { to: '/payroll', icon: '💰', label: 'Process Payroll' },
    { to: '/attendance', icon: '📅', label: 'Mark Attendance' },
    { to: '/performance', icon: '📈', label: 'Performance Review' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats ? (
          <>
            <StatCard title="Total Employees" value={stats.totalEmployees} color="bg-blue-500" />
            <StatCard title="Present Today" value={stats.presentToday} color="bg-green-500" />
            <StatCard title="On Leave" value={stats.onLeave} color="bg-yellow-500" />
            <StatCard title="New Hires" value={stats.newHires} color="bg-purple-500" />
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <div className="text-2xl mb-2">{link.icon}</div>
              <p className="text-sm font-medium text-gray-700">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${color} rounded-lg p-3 mr-4`}>
        <div className="w-6 h-6 bg-white rounded opacity-75" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
