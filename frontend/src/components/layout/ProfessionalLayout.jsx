import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfessionalHeader from "./ProfessionalHeader";
import EmployeeHeader from "./EmployeeHeader";
import ProfessionalSidebar from "./ProfessionalSidebar";
import ProfessionalTopNavbar from "./ProfessionalTopNavbar";
import ProfessionalFooter from "./ProfessionalFooter";

const ProfessionalLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // For admin users, show layout with sidebar
  if (user?.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader onMenuToggle={toggleSidebar} />

        {/* Professional Top Navigation - Fixed */}
        <ProfessionalTopNavbar />

        <div className="flex pt-28">
          {" "}
          {/* pt-28 = header(4rem) + navbar(3rem) */}
          <ProfessionalSidebar isCollapsed={sidebarCollapsed} />
          <main
            className={`flex-1 transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? "ml-20" : "ml-72"
            }`}
          >
            <div className="p-4 md:p-6 lg:p-8 min-h-screen">{children}</div>
            <ProfessionalFooter />
          </main>
        </div>
      </div>
    );
  }

  // For regular employees, show layout without sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployeeHeader />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      <ProfessionalFooter />
    </div>
  );
};

export default ProfessionalLayout;
