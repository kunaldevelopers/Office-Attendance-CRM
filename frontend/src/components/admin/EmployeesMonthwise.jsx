import React, { useState, useEffect } from "react";
import { Users, Search, Calendar, Clock } from "lucide-react";
import { adminAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const EmployeesMonthwise = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search term
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      const response = await adminAPI.getAllStaff();
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employee) => {
    navigate(`/admin/employees-monthwise/${employee._id}`, {
      state: { employee },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employees Monthwise
            </h1>
            <p className="mt-1 text-gray-600">
              View detailed monthly attendance for each employee
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee._id}
            onClick={() => handleEmployeeClick(employee)}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300 group"
          >
            {/* Employee Avatar */}
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Employee Info */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                {employee.name}
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {employee.jobRole}
              </p>
              <p className="text-xs text-gray-500 mb-3 truncate">
                {employee.email}
              </p>

              {/* Employee Details */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>{employee.employmentType}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>View Monthly Report</span>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1 text-blue-600 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>View Details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No employees found" : "No employees available"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add employees to view their monthly reports"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeesMonthwise;
