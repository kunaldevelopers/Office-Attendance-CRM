import React from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const EmployeeHeader = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className="shadow-lg border-b sticky top-0 z-50"
      style={{
        background: "linear-gradient(to right, #131C2A, #1E293B, #131C2A)",
        borderBottomColor: "#334155",
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and company */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img
                src="https://enegixwebsolutions.com/wp-content/uploads/2025/03/ews.png.webp"
                alt="Enegix Global"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-lg hidden">
                <span
                  className="font-bold text-lg"
                  style={{ color: "#131C2A" }}
                >
                  EG
                </span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">Enegix Global</h1>
                <p className="text-xs text-slate-300">
                  Attendance Management System
                </p>
              </div>
            </Link>
          </div>

          {/* Right side - Simple actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button
              className="relative p-2 text-white hover:text-slate-200 rounded-lg transition-colors"
              style={{ backgroundColor: "rgba(19, 28, 42, 0.3)" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.3)")
              }
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Settings */}
            <button
              className="p-2 text-white hover:text-slate-200 rounded-lg transition-colors"
              style={{ backgroundColor: "rgba(19, 28, 42, 0.3)" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.3)")
              }
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile Icon */}
            <button
              className="p-2 text-white hover:text-slate-200 rounded-lg transition-colors"
              style={{ backgroundColor: "rgba(19, 28, 42, 0.3)" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.3)")
              }
            >
              <User className="h-5 w-5" />
            </button>

            {/* Login/Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-white hover:text-slate-200 rounded-lg transition-colors"
              style={{ backgroundColor: "rgba(19, 28, 42, 0.3)" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgba(19, 28, 42, 0.3)")
              }
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* User Info */}
            <div
              className="hidden md:flex items-center space-x-2 backdrop-blur-sm rounded-lg px-3 py-2 border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#131C2A" }}
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-300 capitalize">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
