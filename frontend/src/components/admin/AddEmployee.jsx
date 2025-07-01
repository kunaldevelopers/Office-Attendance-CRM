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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
        <p className="mt-1 text-gray-600">
          Add new employees to your organization
        </p>
      </div>

      {/* Add Employee Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <UserPlus className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Information
          </h3>
        </div>

        <form onSubmit={handleAddEmployee} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Enter email address"
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
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Enter password"
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
                  setNewEmployee({ ...newEmployee, jobRole: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                required
                value={newEmployee.gender}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, gender: e.target.value })
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
                placeholder="Enter age"
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
                <option value="">Select Employment Type</option>
                <option value="Regular">Regular</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Enter phone number"
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
                placeholder="Enter WhatsApp number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
