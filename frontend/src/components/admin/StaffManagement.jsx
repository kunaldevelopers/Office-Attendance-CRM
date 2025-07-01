import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Search, Eye, Trash2, X } from "lucide-react";
import { adminAPI } from "../../services/api";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  // New employee form data
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    jobRole: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    qualification: "",
    employmentType: "",
    callingNumber: "",
    whatsappNumber: "",
  });

  const fetchStaff = useCallback(async () => {
    try {
      const response = await adminAPI.getAllStaff();
      if (response.data.success) {
        // Filter to show only active employees
        const activeStaff = response.data.data.filter(
          (employee) => employee.isActive !== false
        );
        setStaff(activeStaff);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchStaff();
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchStaff]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const registrationData = {
        ...newEmployee,
        age: parseInt(newEmployee.age),
      };

      const response = await adminAPI.addStaff(registrationData);
      if (response.data.success) {
        setStaff([...staff, response.data.data]);
        setNewEmployee({
          name: "",
          email: "",
          password: "",
          jobRole: "",
          gender: "",
          age: "",
          dateOfBirth: "",
          qualification: "",
          employmentType: "",
          callingNumber: "",
          whatsappNumber: "",
        });
        setShowAddEmployee(false);
        alert("Employee added successfully!");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      const errorMessage =
        error.response?.data?.error?.message || "Failed to add employee";
      alert(errorMessage);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?"))
      return;

    try {
      const response = await adminAPI.deleteStaff(employeeId);
      if (response.data.success) {
        // Remove the employee from the local state since they're now inactive
        setStaff(staff.filter((emp) => emp._id !== employeeId));
        alert("Employee deactivated successfully!");
      }
    } catch (error) {
      console.error("Error deactivating employee:", error);
      const errorMessage =
        error.response?.data?.error?.message || "Failed to deactivate employee";
      alert(errorMessage);
    }
  };

  const filteredStaff = staff.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p className="mt-1 text-gray-600">
          Manage your organization's employees
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-xl font-semibold text-gray-900">
                {staff.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Regular Employees</p>
              <p className="text-xl font-semibold text-gray-900">
                {staff.filter((emp) => emp.employmentType === "Regular").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Interns</p>
              <p className="text-xl font-semibold text-gray-900">
                {staff.filter((emp) => emp.employmentType === "Intern").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="min-w-full"
            style={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-0">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-0">
                  Job Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-0">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-0">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-0">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredStaff.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50"
                  style={{ border: "none" }}
                >
                  <td className="px-4 py-3 whitespace-nowrap border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-0">
                    {employee.jobRole}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-0">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        employee.employmentType === "Regular"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {employee.employmentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-0">
                    {employee.callingNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-0">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        employee.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium border-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Deactivate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No employees found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Employee
              </h3>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Role *
                  </label>
                  <select
                    required
                    value={newEmployee.jobRole}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        jobRole: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="">Select Job Role</option>
                    <option value="Developer">Developer</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Graphics Designer">Graphics Designer</option>
                    <option value="Video Editor">Video Editor</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    required
                    value={newEmployee.gender}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="100"
                    value={newEmployee.age}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, age: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEmployee.dateOfBirth}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        dateOfBirth: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification *
                  </label>
                  <select
                    required
                    value={newEmployee.qualification}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        qualification: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="">Select Qualification</option>
                    <option value="12th">12th</option>
                    <option value="Diploma">Diploma</option>
                    <option value="UG">UG (Under Graduate)</option>
                    <option value="PG">PG (Post Graduate)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type *
                  </label>
                  <select
                    required
                    value={newEmployee.employmentType}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        employmentType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="Regular">Regular</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calling Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newEmployee.callingNumber}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        callingNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newEmployee.whatsappNumber}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Employee Details
              </h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{selectedEmployee.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">{selectedEmployee.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Job Role:</span>
                  <p className="text-gray-900">{selectedEmployee.jobRole}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Gender:</span>
                  <p className="text-gray-900">{selectedEmployee.gender}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Age:</span>
                  <p className="text-gray-900">{selectedEmployee.age}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Date of Birth:
                  </span>
                  <p className="text-gray-900">
                    {new Date(
                      selectedEmployee.dateOfBirth
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Qualification:
                  </span>
                  <p className="text-gray-900">
                    {selectedEmployee.qualification}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Employment Type:
                  </span>
                  <p className="text-gray-900">
                    {selectedEmployee.employmentType}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-900">
                    {selectedEmployee.callingNumber}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">WhatsApp:</span>
                  <p className="text-gray-900">
                    {selectedEmployee.whatsappNumber}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedEmployee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedEmployee.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
