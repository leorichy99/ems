import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";

// Admin imports
import Layout from "./pages/Admin/components/Layout/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import Employees from "./pages/Admin/Employees";
import Attendance from "./pages/Admin/Attendance";
import Payroll from "./pages/Admin/Payroll";
import Performance from "./pages/Admin/Performance";
import Recruitment from "./pages/Admin/Recruitment";
import Exit from "./pages/Admin/Exit";

// Manager imports
import HRManagerLayout from "./pages/managerDashboard/components/Layout/HRManagerLayout";
import EmployeeManagement from "./pages/managerDashboard/pages/EmployeeManagement";
import HRDashboard from "./pages/managerDashboard/pages/HRDashboard";
import HRSettings from "./pages/managerDashboard/pages/HRSettings";
import LeaveManagerment from "./pages/managerDashboard/pages/LeaveManagement";
import RecruitmentManagement from "./pages/managerDashboard/Pages/RecruitmentManagement";
import Tasks from "./pages/managerDashboard/pages/Tasks";

// Employee imports
import EmployeeLayout from "./pages/employeeDashboard/components/Layout/EmployeeLayout";
import EmployeeDashboard from "./pages/employeeDashboard/pages/EmployeeDashboard";
import MyProfile from "./pages/employeeDashboard/pages/MyProfile";
import MyPayroll from "./pages/employeeDashboard/pages/MyPayroll";
import LeaveRequests from "./pages/employeeDashboard/pages/LeaveRequests";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  const handleLogin = (userRole) => {
    localStorage.setItem("role", userRole);
    setRole(userRole);
    setIsAuthenticated(true);

    // Redirect after login
    if (userRole === "Admin") {
      navigate("/dashboard");
    } else if (userRole === "Manager") {
      navigate("/manager-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (role === "Admin") {
    return !isAuthenticated ? (
      <Login onLogin={handleLogin} />
    ) : (
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/exit" element={<Exit />} />
        </Routes>
      </Layout>
    );
  } else if (role === "Manager") {
    return !isAuthenticated ? (
      <Login onLogin={handleLogin} />
    ) : (
      <HRManagerLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/manager-dashboard" replace />} />
          <Route path="/manager-dashboard" element={<HRDashboard />} />
          <Route path="/employee-management" element={<EmployeeManagement />} />
          <Route path="/hr-settings" element={<HRSettings />} />
          <Route path="/leave-management" element={<LeaveManagerment />} />
          <Route path="/recruitment" element={<RecruitmentManagement />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </HRManagerLayout>
    );
  }

  // Employee role
  return !isAuthenticated ? (
    <Login onLogin={handleLogin} />
  ) : (
    <EmployeeLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/employee-dashboard" replace />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/mypayroll" element={<MyPayroll />} />
        <Route path="/myprofile" element={<MyProfile />} />
         <Route path="/leave-requests" element={<LeaveRequests />} />
      </Routes>
    </EmployeeLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
