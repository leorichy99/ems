import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    status: 'Active',
  });

  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/employees', newEmployee);
      setShowAddModal(false);
      setNewEmployee({ name: '', email: '', position: '', department: '', status: 'Active' });
      fetchEmployees();
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };



  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${editEmployee.id}`, editEmployee);
      setShowEditModal(false);
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.department || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === 'All Departments' || employee.department === departmentFilter;

    const matchesStatus =
      statusFilter === 'All Status' || employee.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>All Departments</option>
            <option>IT</option>
            <option>Human Resources</option>
            <option>Marketing</option>
            <option>Finance</option>
            <option>Sales</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {employee.name ? employee.name.split(' ').map((n) => n[0]).join('') : ''}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{employee.position}</td>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : employee.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEditClick(employee)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              {['name', 'email', 'position'].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  value={newEmployee[field]}
                  onChange={(e) => setNewEmployee({ ...newEmployee, [field]: e.target.value })}
                  required
                  className="w-full p-2 border rounded"
                />
              ))}
              <select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Department</option>
                <option>IT</option>
                <option>Human Resources</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Sales</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowAddModal(false)} type="button" className="text-gray-700 border px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {['name', 'email', 'position'].map((field) => (
                <input
                  key={field}
                  type="text"
                  value={editEmployee[field]}
                  onChange={(e) => setEditEmployee({ ...editEmployee, [field]: e.target.value })}
                  required
                  className="w-full p-2 border rounded"
                />
              ))}
              <select
                value={editEmployee.department}
                onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option>IT</option>
                <option>Human Resources</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Sales</option>
              </select>
              <select
                value={editEmployee.status}
                onChange={(e) => setEditEmployee({ ...editEmployee, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowEditModal(false)} type="button" className="text-gray-700 border px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
