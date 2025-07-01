import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Smartphone,
  ChevronRight,
} from "lucide-react";

const ProfessionalNavbar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard Overview",
      href: "/admin/overview",
      icon: BarChart3,
      current: location.pathname === "/admin/overview",
      description: "System analytics and metrics",
    },
    {
      name: "Staff Management",
      href: "/admin/staff",
      icon: Users,
      current: location.pathname === "/admin/staff",
      description: "Manage employee records",
    },
    {
      name: "Add Employee",
      href: "/admin/add-employee",
      icon: UserPlus,
      current: location.pathname === "/admin/add-employee",
      description: "Register new employees",
    },
    {
      name: "Attendance Reports",
      href: "/admin/attendance",
      icon: Calendar,
      current: location.pathname === "/admin/attendance",
      description: "Track attendance data",
    },
    {
      name: "WhatsApp Integration",
      href: "/admin/whatsapp",
      icon: Smartphone,
      current: location.pathname === "/admin/whatsapp",
      description: "Communication settings",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 md:space-x-4 lg:space-x-6 overflow-x-auto py-3 scrollbar-hide">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-2 px-3 md:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap min-w-fit ${
                  item.current
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 ${
                    item.current
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <div className="hidden sm:block">
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-gray-500">
                    {item.description}
                  </span>
                </div>
                <div className="block sm:hidden">
                  <span className="block text-xs font-medium">{item.name}</span>
                </div>
                {item.current && (
                  <ChevronRight className="h-3 w-3 text-blue-600 ml-1 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;
