import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Search, Edit, Trash2, Eye } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your organization's employees
        </p>
      </div>

      {/* Staff Management Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employment Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.jobRole}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.employmentType === "Regular"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {employee.employmentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.callingNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedEmployee(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee._id)}
                      className="text-red-600 hover:text-red-900"
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
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No employees found</p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Employee
              </h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, name: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>{" "}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Role
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Job Role</option>
                      <option value="Developer">Developer</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Graphics Designer">
                        Graphics Designer
                      </option>
                      <option value="Video Editor">Video Editor</option>
                      <option value="Photo Editor">Photo Editor</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="WordPress Developer">
                        WordPress Developer
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>{" "}
                    <select
                      required
                      value={newEmployee.gender}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          gender: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Age
                    </label>{" "}
                    <input
                      type="number"
                      required
                      min="16"
                      max="65"
                      value={newEmployee.age}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, age: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>{" "}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Qualification
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Qualification</option>
                      <option value="12th">12th</option>
                      <option value="Diploma">Diploma</option>
                      <option value="UG">UG (Under Graduate)</option>
                      <option value="PG">PG (Post Graduate)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employment Type
                    </label>{" "}
                    <select
                      required
                      value={newEmployee.employmentType}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          employmentType: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Regular">Regular</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Calling Number
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      WhatsApp Number
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddEmployee(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Employee Details
              </h3>
              <div className="space-y-3">
                <div>
                  <strong>Name:</strong> {selectedEmployee.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedEmployee.email}
                </div>
                <div>
                  <strong>Job Role:</strong> {selectedEmployee.jobRole}
                </div>
                <div>
                  <strong>Gender:</strong> {selectedEmployee.gender}
                </div>
                <div>
                  <strong>Age:</strong> {selectedEmployee.age}
                </div>
                <div>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}
                </div>
                <div>
                  <strong>Qualification:</strong>{" "}
                  {selectedEmployee.qualification}
                </div>
                <div>
                  <strong>Employment Type:</strong>{" "}
                  {selectedEmployee.employmentType}
                </div>
                <div>
                  <strong>Calling Number:</strong>{" "}
                  {selectedEmployee.callingNumber}
                </div>
                <div>
                  <strong>WhatsApp Number:</strong>{" "}
                  {selectedEmployee.whatsappNumber}
                </div>
                <div>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedEmployee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedEmployee.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
