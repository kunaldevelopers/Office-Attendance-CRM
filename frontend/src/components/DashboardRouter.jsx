import React from "react";
import useAuth from "../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  // Render appropriate dashboard based on user role
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  // Default to employee dashboard
  return <EmployeeDashboard />;
};

export default Dashboard;
