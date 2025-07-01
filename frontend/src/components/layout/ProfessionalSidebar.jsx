import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Settings,
  Smartphone,
  Shield,
  ChevronRight,
} from "lucide-react";

const ProfessionalSidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-72"
      } bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl border-r border-gray-700 transition-all duration-300 ease-in-out flex flex-col fixed z-40`}
      style={{ top: "7rem", height: "calc(100vh - 7rem)" }}
    >
      {/* Navigation Menu */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center p-3" : "justify-between p-3"
                  } text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                  title={isCollapsed ? item.name : ""}
                >
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : "space-x-3"
                    }`}
                  >
                    <Icon
                      className={`${isCollapsed ? "h-6 w-6" : "h-5 w-5"} ${
                        item.current
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    {!isCollapsed && (
                      <div>
                        <span className="block">{item.name}</span>
                        <span className="text-xs text-gray-400 block">
                          {item.description}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && !item.current && (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Date and Time Display */}
        {!isCollapsed && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 px-2">
              Today
            </h3>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">
                  {formatDate(currentTime)}
                </div>
                <div className="text-sm text-gray-400">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div
        className={`${isCollapsed ? "p-2" : "p-4"} border-t border-gray-700`}
      >
        {!isCollapsed ? (
          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              © 2025 Enegix Global
            </p>
            <p className="text-xs text-gray-600 mt-1">All rights reserved</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-8 h-1 bg-gray-600 rounded mx-auto"></div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProfessionalSidebar;
