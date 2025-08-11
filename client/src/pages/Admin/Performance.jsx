import React, { useState, useEffect } from "react";
import axios from "axios";

const Performance = () => {
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);

  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    period_id: "",
    goals: "",
    goals_completed: "",
    rating: "",
    status: "",
    feedback: "",
    reviewed_by: 1, // hardcoded for now, replace with session user ID if needed
  });

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Outstanding":
        return "bg-green-100 text-green-800";
      case "Excellent":
        return "bg-blue-100 text-blue-800";
      case "Very Good":
        return "bg-purple-100 text-purple-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/performance?period_id=${selectedPeriodId}`
      );
      setPerformanceData(res.data);
    } catch (error) {
      console.error("Failed to fetch performance data:", error);
    } finally {
      setLoading(false);
    }
  };



const handleSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/performance/add', {
      user_id: formData.user_id,
      period_id: formData.period_id,
      goals: formData.goals,
      goals_completed: formData.goals_completed,
      rating: formData.rating,
      status: formData.status,
      feedback: formData.feedback,
      reviewed_by: formData.reviewed_by
    });

    if (response.status === 201) {
      alert('Performance review added successfully!');
    }
  } catch (error) {
    console.error('Error adding performance review:', error);
    alert('Failed to add performance review.');
  }
};



  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/periods");
        setPeriods(res.data);
        if (res.data.length > 0) {
          setSelectedPeriodId(res.data[0].id); // default to latest
        }
      } catch (err) {
        console.error("Failed to fetch periods:", err);
      }
    };

    fetchPeriods();
  }, []);

  useEffect(() => {
    if (selectedPeriodId) {
      fetchPerformanceData();
    }
  }, [selectedPeriodId]);

  useEffect(() => {
  axios.get("http://localhost:5000/api/employees")
    .then((res) => {
      setEmployeeList(res.data);
    })
    .catch((err) => {
      console.error("Failed to load employee list:", err);
    });
}, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Review
          </button>

         
        </div>
      </div>

  

      {/* Period Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Review Period:
            </label>
            <select
              value={selectedPeriodId || ""}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.period_label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Current Quarter
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Annual Review
            </button>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {employee.name
                            .split(" ")
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.goals_completed}/{employee.goals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (employee.goals_completed / employee.goals) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {Math.round(
                          (employee.goals_completed / employee.goals) * 100
                        )}
                        %
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`text-lg font-bold ${getRatingColor(
                          employee.rating
                        )}`}
                      >
                        {employee.rating}
                      </span>
                      <div className="ml-2 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= employee.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



     {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">New Performance Review</h2>

      <select
        value={formData.user_id}
        onChange={(e) =>
          setFormData({ ...formData, user_id: e.target.value })
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Select Employee</option>
        {employeeList.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Goals"
        value={formData.goals}
        onChange={(e) =>
          setFormData({ ...formData, goals: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Goals Completed"
        value={formData.goals_completed}
        onChange={(e) =>
          setFormData({ ...formData, goals_completed: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        step="0.1"
        placeholder="Rating"
        value={formData.rating}
        onChange={(e) =>
          setFormData({ ...formData, rating: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <select
        value={formData.status}
        onChange={(e) =>
          setFormData({ ...formData, status: e.target.value })
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Select Status</option>
        <option value="Poor">Poor</option>
        <option value="Average">Average</option>
        <option value="Good">Good</option>
        <option value="Excellent">Excellent</option>
      </select>

      <textarea
        placeholder="Feedback"
        value={formData.feedback}
        onChange={(e) =>
          setFormData({ ...formData, feedback: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              await axios.post("http://localhost:5000/api/performance", {
                ...formData,
                period_id: selectedPeriodId,
              });
              setShowModal(false);
              fetchPerformanceData(); // Refresh table
            } catch (err) {
              console.error("Failed to submit review:", err);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Performance;
