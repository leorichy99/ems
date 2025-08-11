import React, { useEffect, useState } from "react";
import axios from "axios";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("openings");
  const [jobOpenings, setJobOpenings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [reviewData, setReviewData] = useState({
    review_status: "",
    review_feedback: "",
  });
  const loggedInUserId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

  const submitReview = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/candidates/${selectedCandidate.id}/review`,
        {
          ...reviewData,
          reviewed_by: loggedInUserId, // or hardcode for now like 1
        }
      );
      alert("Review submitted!");
      setShowReviewModal(false);
      setReviewData({ review_status: "", review_feedback: "" });
      setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
      alert("Failed to review candidate.");
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    status: "Open",
    employment_type: "Full-Time",
  });

  // Fetch job openings
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs");
      setJobOpenings(response.data);
    } catch (err) {
      console.error("Error fetching job openings:", err);
    }
  };

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/candidates");
      setCandidates(response.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      if (editJobId) {
        await axios.put(
          `http://localhost:5000/api/jobs/${editJobId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/jobs", formData);
      }
      setShowModal(false);
      setEditJobId(null);
      fetchJobs();
      setFormData({
        title: "",
        description: "",
        requirements: "",
        department: "",
        location: "",
        status: "Open",
        employment_type: "Full-Time",
      });
    } catch (err) {
      console.error("Error submitting job:", err);
      alert("Failed to save job");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Offer Extended":
        return "bg-purple-100 text-purple-800";
      case "Hired":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post New Job
        </button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
            <form onSubmit={handlePostJob} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Job Title"
                required
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Job Description"
                required
                className="w-full border p-2 rounded"
              />
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Requirements"
                required
                className="w-full border p-2 rounded"
              />
              <input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
                required
                className="w-full border p-2 rounded"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats (static for now) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Replace these with actual counts if needed */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Open Positions</p>
          <p className="text-2xl font-bold text-gray-900">
            {jobOpenings.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">
            {candidates.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Interviews Scheduled</p>
          <p className="text-2xl font-bold text-gray-900">
            {
              candidates.filter((c) => c.status === "Interview Scheduled")
                .length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Offers Extended</p>
          <p className="text-2xl font-bold text-gray-900">
            {candidates.filter((c) => c.status === "Offer Extended").length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("openings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "openings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Job Openings
            </button>
            <button
              onClick={() => setActiveTab("candidates")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "candidates"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Candidates
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "openings" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobOpenings.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.employment_type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => {
                            setFormData({
                              title: job.title,
                              description: job.description,
                              requirements: job.requirements,
                              department: job.department,
                              location: job.location,
                              employment_type: job.employment_type,
                              status: job.status,
                            });
                            setEditJobId(job.id); // 👈 mark which job is being edited
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={async () => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this job?"
                              )
                            ) {
                              try {
                                await axios.delete(
                                  `http://localhost:5000/api/jobs/${job.id}`
                                );
                                fetchJobs();
                              } catch (err) {
                                console.error("Error deleting job:", err);
                                alert("Failed to delete job");
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {showReviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h2 className="text-xl font-semibold mb-4">Review Candidate</h2>

                <div className="mb-4">
                  <label className="block mb-1">Review Status</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={reviewData.review_status}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        review_status: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1">Feedback</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    value={reviewData.review_feedback}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        review_feedback: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="mr-3 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "candidates" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Candidate
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>{candidate.name}</div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div>{candidate.email}</div>
                        <div className="text-gray-500">{candidate.phone}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            candidate.review_status
                          )}`}
                        >
                          {candidate.review_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedCandidate(candidate); // set selected
                            setShowReviewModal(true); // open modal
                          }}
                          className="text-blue-500 underline"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
