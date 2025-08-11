import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const EmployeeTasks = () => {
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
const userId=localStorage.getItem("userID")
console.log(userId);

  // Fetch tasks assigned to this employee only
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?assignedTo=${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  // Helpers for colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter tasks by status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // Task stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  // Update task status (mark complete or revert to in-progress)
  const handleUpdateStatus = async (taskId, status) => {
    try {
      await axios.put(`${API_URL}/${taskId}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status.');
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Total Tasks', 'Completed', 'In Progress', 'Pending'].map((label, idx) => {
          const value = [taskStats.total, taskStats.completed, taskStats.inProgress, taskStats.pending][idx];
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500'][idx];
          const icons = ['📋', '✅', '🔄', '⏳'][idx];
          return (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${colors} rounded-lg p-3 mr-4`}>
                  <span className="text-white text-xl">{icons}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'pending', label: 'Pending' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tasks List */}
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found.</p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}
                        >
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {task.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'completed')}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Mark In Progress
                          </button>
                        </>
                      )}
                      {task.status === 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                          className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                        >
                          Mark In Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasks;
