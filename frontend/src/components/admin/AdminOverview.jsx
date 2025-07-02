import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { adminAPI } from "../../services/api";

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    overall: {
      totalEmployees: 0,
      presentToday: 0,
      absentToday: 0,
      averageAttendance: 0,
    },
    roleStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today's date
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD format
  });

  const fetchDashboardStatsByRole = useCallback(async () => {
    try {
      const params = {};
      if (selectedDate) {
        params.date = selectedDate;
      }

      const response = await adminAPI.getDashboardStatsByRole(params);
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        console.error("Failed to fetch dashboard stats:", response.data);
        setDashboardData({
          overall: {
            totalEmployees: 0,
            presentToday: 0,
            absentToday: 0,
            averageAttendance: 0,
          },
          roleStats: [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats by role:", error);
      setDashboardData({
        overall: {
          totalEmployees: 0,
          presentToday: 0,
          absentToday: 0,
          averageAttendance: 0,
        },
        roleStats: [],
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchDashboardStatsByRole();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDashboardStatsByRole]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboardStatsByRole();
    setLoading(false);
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  // Simple stat card component
  const StatCard = ({ title, value, icon, color }) => {
    const IconComponent = icon;
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-600 mb-1 truncate">
              {title}
            </p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${color} ml-3 flex-shrink-0`}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    );
  };

  // Role card component
  const RoleCard = ({ roleData }) => {
    const isExpanded = expandedRole === roleData.jobRole;

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Role Header */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpandedRole(isExpanded ? null : roleData.jobRole)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {roleData.jobRole}
                </h3>
                <p className="text-sm text-gray-500">
                  {roleData.totalEmployees} employees
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 ml-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Attendance</div>
                <div className="text-sm font-semibold text-gray-900">
                  {roleData.attendancePercentage}%
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-green-600 font-medium">
                  {roleData.presentToday}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-red-600 font-medium">
                  {roleData.absentToday}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Present Employees */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-gray-900 text-sm">
                    {isToday
                      ? `Present Today (${roleData.presentEmployees.length})`
                      : `Present on ${formatDisplayDate(selectedDate)} (${
                          roleData.presentEmployees.length
                        })`}
                  </h4>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {roleData.presentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-white p-3 rounded border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {employee.email}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="flex items-center text-xs text-green-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {employee.loginTime
                              ? new Date(employee.loginTime).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {roleData.presentEmployees.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No employees present today
                    </div>
                  )}
                </div>
              </div>

              {/* Absent Employees */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <UserX className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-gray-900 text-sm">
                    {isToday
                      ? `Absent Today (${roleData.absentEmployees.length})`
                      : `Absent on Selected Date (${roleData.absentEmployees.length})`}
                  </h4>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {roleData.absentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-white p-3 rounded border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {employee.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {employee.email}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {isToday
                            ? "No check-in recorded today"
                            : "No check-in recorded"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {roleData.absentEmployees.length === 0 && (
                    <div className="text-center py-6 text-green-600 text-sm">
                      {isToday
                        ? "All employees are present today! 🎉"
                        : "All employees were present on this date! 🎉"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header with Date Picker */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
            <p className="mt-1 text-gray-600">
              Monitor your organization's attendance and performance
            </p>
          </div>

          {/* Date Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatDisplayDate(selectedDate)}
                {isToday && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Today
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                max={new Date().toISOString().split("T")[0]} // Don't allow future dates
              />

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={dashboardData.overall.totalEmployees}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title={isToday ? "Present Today" : "Present on Selected Date"}
          value={dashboardData.overall.presentToday}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title={isToday ? "Absent Today" : "Absent on Selected Date"}
          value={dashboardData.overall.absentToday}
          icon={AlertCircle}
          color="bg-red-500"
        />
        <StatCard
          title="Attendance Rate"
          value={`${dashboardData.overall.averageAttendance}%`}
          icon={BarChart3}
          color="bg-indigo-500"
        />
      </div>

      {/* Departments Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Department Overview
          </h2>
          <p className="text-gray-600">
            Attendance breakdown by department and role
          </p>
        </div>

        <div className="space-y-3">
          {dashboardData.roleStats.map((roleData) => (
            <RoleCard key={roleData.jobRole} roleData={roleData} />
          ))}
          {dashboardData.roleStats.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No data available
              </h3>
              <p className="text-gray-500">
                No employee roles or attendance data to display
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
