import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AdminOverview from "./AdminOverview";
import StaffManagement from "./StaffManagement";
import AttendanceReports from "./AttendanceReports";
import AddEmployee from "./AddEmployee";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard Overview",
      href: "/admin/overview",
      icon: BarChart3,
      current: location.pathname === "/admin/overview",
    },
    {
      name: "Staff Management",
      href: "/admin/staff",
      icon: Users,
      current: location.pathname === "/admin/staff",
    },
    {
      name: "Add Employee",
      href: "/admin/add-employee",
      icon: UserPlus,
      current: location.pathname === "/admin/add-employee",
    },
    {
      name: "Attendance Reports",
      href: "/admin/attendance",
      icon: Calendar,
      current: location.pathname === "/admin/attendance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Attendance Management System
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || "Admin"}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    item.current
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Routes>
            <Route path="/overview" element={<AdminOverview />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/attendance" element={<AttendanceReports />} />
            <Route
              path="/"
              element={<Navigate to="/admin/overview" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
