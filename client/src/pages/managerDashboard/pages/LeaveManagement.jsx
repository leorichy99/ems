import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveManagement = () => {
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch leave requests from backend on mount
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/leave-requests')  // Change to your actual endpoint
      .then(res => {
        setLeaveRequests(res.data);
        console.log(leaveRequests);
        
      })
      .catch(err => {
        console.error('Failed to fetch leave requests:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Stats
  const leaveStats = {
    pending: leaveRequests.filter(r => r.status === 'Pending').length,
    approved: leaveRequests.filter(r => r.status === 'Approved').length,
    rejected: leaveRequests.filter(r => r.status === 'Rejected').length,
    total: leaveRequests.length,
  };

  // Filtered requests
  const filteredRequests = filter === 'all' 
    ? leaveRequests 
    : leaveRequests.filter(request => request.status.toLowerCase() === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Annual Leave': return 'bg-blue-100 text-blue-800';
      case 'Sick Leave': return 'bg-red-100 text-red-800';
      case 'Personal Leave': return 'bg-purple-100 text-purple-800';
      case 'Maternity Leave': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Approve
  const handleApprove = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/leave-requests/${requestId}/approve`, { status: 'Approved' });
      setLeaveRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r)
      );
      alert(`Leave request ${requestId} approved!`);
      setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      alert('Failed to approve leave request.');
    }
  };

  // Reject
  const handleReject = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await axios.put(`http://localhost:5000/api/leave-requests/${requestId}/reject`, { status: 'Rejected', rejectionReason: reason });
      setLeaveRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'Rejected', rejectionReason: reason } : r)
      );
      alert(`Leave request ${requestId} rejected. Reason: ${reason}`);
      setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      alert('Failed to reject leave request.');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  if (loading) return <div>Loading leave requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[ 
              { key: 'pending', label: 'Pending', count: leaveStats.pending },
              { key: 'approved', label: 'Approved', count: leaveStats.approved },
              { key: 'rejected', label: 'Rejected', count: leaveStats.rejected },
              { key: 'all', label: 'All Requests', count: leaveStats.total }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Leave Requests Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {request.employeeName?.split(' ').map(n => n[0]).join('') || ''}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.employee_name}</div>
                          <div className="text-sm text-gray-500">{request.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">{request.days} day{request.days > 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Leave Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedRequest.employee_name?.split(' ').map(n => n[0]).join('') || ''}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRequest.employee_name || ''}</h3>
                  <p className="text-gray-600">{selectedRequest.employee_id || ''}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status || ''}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedRequest.type)}`}>
                    {selectedRequest.type || ''}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedRequest.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedRequest.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedRequest.applied_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manager</label>
                  <p className="text-sm text-gray-900">{selectedRequest.manager || ''}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedRequest.reason || ''}</p>
              </div>

              {selectedRequest.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.status === 'Pending' && (
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
