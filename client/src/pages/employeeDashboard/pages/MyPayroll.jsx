import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payrol';

const MyPayroll = () => {
  const userId = localStorage.getItem('userID');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/${userId}`);
        console.log('Payroll data fetched:', response.data);
        
        setPayrollHistory(response.data);

      
        
      } catch (error) {
        console.error('Error fetching payroll:', error);
        alert('Failed to load payroll data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, [userId]);

  // Find current month payroll or default to first available
  const currentPayroll = payrollHistory.find(record => record.month?.slice(0, 7) === selectedMonth) || payrollHistory[0] || {
    basic_salary: 0,
    allowances: 0,
    deductions: 0,
    net_salary: 0,
    status: 'N/A',
    month: selectedMonth,
  };


  // Generate month options dynamically from payrollHistory
  const monthOptions = [...new Set(payrollHistory.map(p => p.month?.slice(0, 7)))];

  return (
    <div className="space-y-6">

  

      {/* Payroll History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Payroll History</h2>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthOptions.length === 0 && <option>No payroll data</option>}
              {monthOptions.map(month => (
                <option key={month} value={month}>
                  {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.basic_salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +${record.allowances.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -${record.deductions.toLocaleString()}
                  </td>
                 
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPayroll;
