import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HRDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    status: 'Active',
    email: '',
    password: '',
    role: 'Employee',
    changePass: 0
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/hrusers', newEmployee);
      setUsers((prev) => [...prev, res.data]); // Add new employee to state
      setIsModalOpen(false); // Close modal
      setNewEmployee({
        name: '',
        position: '',
        department: '',
        status: 'Active',
        email: '',
        password: '',
        role: 'Employee',
        changePass: 0
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  // Derived statistics
  const totalEmployees = users.length;
  const activeEmployees = users.filter(u => u.status === 'Active').length;
  const onLeaveCount = users.filter(u => u.status === 'On Leave').length;

  const departmentStats = Object.values(
    users.reduce((acc, user) => {
      if (!acc[user.department]) {
        acc[user.department] = { department: user.department, employees: 0 };
      }
      acc[user.department].employees += 1;
      return acc;
    }, {})
  );

  const hrStats = [
    { title: 'Total Employees', value: totalEmployees, color: 'bg-blue-500', icon: '👥' },
    { title: 'Active Employees', value: activeEmployees, color: 'bg-green-500', icon: '✅' },
    { title: 'On Leave', value: onLeaveCount, color: 'bg-yellow-500', icon: '🏖️' },
    { title: 'Departments', value: departmentStats.length, color: 'bg-purple-500', icon: '🏢' }
  ];

  return (
    <div className="flex-1 h-screen flex flex-col bg-gray-100">
      <div className="flex-1 h-screen overflow-y-auto p-6 bg-gray-100">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here’s your HR overview for today.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Employee
              </button>
            </div>
          </div>

          {/* HR Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hrStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                    <span className="text-white text-2xl">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Department Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{dept.employees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-3">
              <input type="text" name="name" placeholder="Name" value={newEmployee.name} onChange={handleChange} className="w-full border p-2 rounded" required />
              <input type="text" name="position" placeholder="Position" value={newEmployee.position} onChange={handleChange} className="w-full border p-2 rounded" required />
              <input type="text" name="department" placeholder="Department" value={newEmployee.department} onChange={handleChange} className="w-full border p-2 rounded" required />
              <select name="status" value={newEmployee.status} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input type="email" name="email" placeholder="Email" value={newEmployee.email} onChange={handleChange} className="w-full border p-2 rounded" required />
              <input type="password" name="password" placeholder="Password" value={newEmployee.password} onChange={handleChange} className="w-full border p-2 rounded" required />
              <select name="role" value={newEmployee.role} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
