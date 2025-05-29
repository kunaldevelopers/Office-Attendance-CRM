import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { adminAPI } from "../../services/api";

const AddEmployee = () => {
  const [loading, setLoading] = useState(false);
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const registrationData = {
        ...newEmployee,
        age: parseInt(newEmployee.age),
      };

      const response = await adminAPI.addStaff(registrationData);
      if (response.data.success) {
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
        alert("Employee added successfully!");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      const errorMessage =
        error.response?.data?.error?.message || "Failed to add employee";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Employee</h1>
        <p className="text-gray-600 mt-2">
          Add new employees to your organization
        </p>
      </div>

      {/* Add Employee Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Employee Information
          </h3>
        </div>

        <form onSubmit={handleAddEmployee} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                required
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Role *
              </label>
              <select
                required
                value={newEmployee.jobRole}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, jobRole: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Job Role</option>
                <option value="Developer">Developer</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Graphics Designer">Graphics Designer</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Photo Editor">Photo Editor</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="WordPress Developer">WordPress Developer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>{" "}
              <select
                required
                value={newEmployee.gender}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, gender: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter age (16-65)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Qualification</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="UG">UG (Under Graduate)</option>
                <option value="PG">PG (Post Graduate)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Employment Type</option>
                <option value="Regular">Regular</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter WhatsApp number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() =>
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
                })
              }
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loading}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Add Employee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
