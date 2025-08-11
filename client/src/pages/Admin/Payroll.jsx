import { useEffect, useState } from "react";
import axios from "axios";

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalBasicSalary = payrollData.reduce(
    (sum, emp) => sum + Number(emp.basic_salary || 0),
    0
  );
  const totalAllowances = payrollData.reduce(
    (sum, emp) => sum + Number(emp.allowances || 0),
    0
  );
  const totalDeductions = payrollData.reduce(
    (sum, emp) => sum + Number(emp.deductions || 0),
    0
  );
  const totalNetSalary = payrollData.reduce(
    (sum, emp) => sum + Number(emp.netSalary || 0),
    0
  );

  // Fetch payroll data
  const fetchPayroll = async (month) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/payroll", {
        params: { month }, // pass selectedMonth as query param
      });
      setPayrollData(res.data);
    } catch (err) {
      console.error("Error fetching payroll data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll(selectedMonth);
  }, [selectedMonth]);

  // Handle payslip processing
  const handleProcessPayslip = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/payroll/${id}`, {
        status: "Paid",
      });
      fetchPayroll(selectedMonth); // refresh list
    } catch (err) {
      console.error("Error processing payslip:", err);
    }
  };

  // Get previous month string
  const getPreviousMonth = () => {
    const date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  };

  return (
    <div className="space-y-6">
      {/* Month Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Payroll Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() =>
                setSelectedMonth(new Date().toISOString().slice(0, 7))
              }
            >
              Current Month
            </button>
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
              onClick={() => setSelectedMonth(getPreviousMonth())}
            >
              Previous Month
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader title="Employee" />
                <TableHeader title="Basic Salary" />
                <TableHeader title="Allowances" />
                <TableHeader title="Deductions" />
                <TableHeader title="Net Salary" />
                <TableHeader title="Status" />
                <TableHeader title="Actions" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                payrollData.map((employee) => (
                  <tr key={employee.payroll_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {employee.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.position}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${Number(employee.basic_salary || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600">
                      +${Number(employee.allowances || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      -${Number(employee.deductions || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${Number(employee.netSalary || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          employee.status
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      {employee.status !== "Paid" && (
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() =>
                            handleProcessPayslip(employee.payroll_id)
                          }
                        >
                          Process
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`bg-${color}-500 rounded-lg p-3 mr-4`}></div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">
          ${Number(value).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

const TableHeader = ({ title }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
    {title}
  </th>
);

export default Payroll;
