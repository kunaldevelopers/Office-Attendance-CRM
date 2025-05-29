import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  // Redirect admin users to the new admin routes
  if (user?.role === "admin") {
    return <Navigate to="/admin/overview" replace />;
  }

  // Default to employee dashboard
  return <EmployeeDashboard />;
};

export default Dashboard;
