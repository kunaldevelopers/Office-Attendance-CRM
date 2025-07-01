import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Smartphone,
  Home,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const ProfessionalHeader = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items for mobile menu
  const navigationItems =
    user?.role === "admin"
      ? [
          { name: "Dashboard", href: "/admin/overview", icon: BarChart3 },
          { name: "Staff Management", href: "/admin/staff", icon: Users },
          { name: "Add Employee", href: "/admin/add-employee", icon: UserPlus },
          {
            name: "Attendance Reports",
            href: "/admin/attendance",
            icon: Calendar,
          },
          {
            name: "WhatsApp Integration",
            href: "/admin/whatsapp",
            icon: Smartphone,
          },
        ]
      : [
          { name: "Dashboard", href: "/dashboard", icon: Home },
          { name: "Profile", href: "/profile", icon: User },
        ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuToggle) onMenuToggle();
  };

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and company */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Desktop sidebar toggle (for admin) - Temporarily hidden */}
              {user?.role === "admin" && (
                <button onClick={onMenuToggle} className="hidden">
                  <Menu className="h-5 w-5" />
                </button>
              )}

              {/* Logo and company name */}
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="https://enegixwebsolutions.com/wp-content/uploads/2025/03/ews.png.webp"
                  alt="Enegix Global"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl items-center justify-center shadow-lg hidden">
                  <span className="text-white font-bold text-lg">EG</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">
                    Enegix Global
                  </h1>
                  <p className="text-xs text-gray-400">
                    Attendance Management System
                  </p>
                </div>
              </Link>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  placeholder="Search employees, reports, or tasks..."
                />
              </div>
            </div>

            {/* Right side - Actions and user menu */}
            <div className="flex items-center space-x-3">
              {/* Search button for mobile */}
              <button className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user?.role || "Employee"}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-600">
                      <p className="text-sm font-medium text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </div>
                    </Link>
                    <hr className="my-1 border-gray-600" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 shadow-lg">
            <div className="px-4 py-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Search..."
                />
              </div>

              {/* Mobile Navigation Items */}
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default ProfessionalHeader;
