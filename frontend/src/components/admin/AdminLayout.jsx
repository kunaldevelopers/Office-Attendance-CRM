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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-cyan-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {" "}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-cyan-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-slate-600">
                    Attendance Management System
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-100 to-cyan-100 px-3 py-2 rounded-lg border border-cyan-200/50">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {user?.name || "Admin"}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>{" "}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-cyan-200/50 mb-8">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    item.current
                      ? "text-cyan-700 border-b-2 border-cyan-600 bg-gradient-to-r from-cyan-50 to-cyan-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-cyan-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content - Remove the white background wrapper since AdminOverview handles its own styling */}
        <div>
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
