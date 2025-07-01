import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNames = {
    admin: "Administration",
    overview: "Dashboard",
    staff: "Staff Management",
    "add-employee": "Add Employee",
    attendance: "Attendance Reports",
    whatsapp: "WhatsApp Integration",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6 font-body">
      <Link
        to="/admin/overview"
        className="flex items-center hover:text-text-primary transition-colors duration-200"
      >
        <Home className="h-4 w-4 mr-1" />
        Dashboard
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName =
          breadcrumbNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-4 w-4 text-secondary-400" />
            {isLast ? (
              <span className="text-text-primary font-medium">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-text-primary transition-colors duration-200"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
