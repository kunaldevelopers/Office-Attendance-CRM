import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Smartphone,
  CalendarDays,
} from "lucide-react";

const ProfessionalTopNavbar = () => {
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
    {
      name: "Employees Monthwise",
      href: "/admin/employees-monthwise",
      icon: CalendarDays,
      current: location.pathname.startsWith("/admin/employees-monthwise"),
    },
    {
      name: "WhatsApp Integration",
      href: "/admin/whatsapp",
      icon: Smartphone,
      current: location.pathname === "/admin/whatsapp",
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-xl h-12 fixed top-16 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-center space-x-1 h-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 nav-item-glow ${
                  item.current
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors duration-200 ${
                    item.current
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
                <span className="font-medium whitespace-nowrap">
                  {item.name}
                </span>

                {/* Active indicator */}
                {item.current && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
                )}

                {/* Hover glow effect */}
                {!item.current && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </nav>
  );
};

export default ProfessionalTopNavbar;
