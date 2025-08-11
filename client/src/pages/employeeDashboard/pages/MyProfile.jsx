import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

const MyProfile = () => {
  const userId = localStorage.getItem('userID');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/${userId}`);
        setProfileData(response.data);
      } catch (error) {
        alert('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!profileData) return <p>No profile data found.</p>;

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-200 flex items-center space-x-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {profileData.name ? profileData.name[0].toUpperCase() : ''}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
          <p className="text-gray-600">{profileData.position}</p>
          <p className="text-gray-500">{profileData.department}</p>
          <p className="text-sm text-gray-500 mt-1">Status: {profileData.status}</p>
          <p className="text-sm text-gray-500 mt-1">Role: {profileData.role}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Name</h3>
            <p className="text-gray-900">{profileData.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Email</h3>
            <p className="text-gray-900">{profileData.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Position</h3>
            <p className="text-gray-900">{profileData.position}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Department</h3>
            <p className="text-gray-900">{profileData.department}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <p className="text-gray-900">{profileData.status}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Role</h3>
            <p className="text-gray-900">{profileData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
