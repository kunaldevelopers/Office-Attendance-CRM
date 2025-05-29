import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { adminAPI } from "../../services/api";

const AdminOverview = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    averageAttendance: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.data.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await adminAPI.getAttendanceReports({ limit: 5 });
      if (response.data.success) {
        setAttendanceData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      setAttendanceData([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchDashboardStats(), fetchRecentActivity()]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDashboardStats, fetchRecentActivity]);

  const StatCard = ({ title, value, icon, color }) => {
    const IconComponent = icon;
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <IconComponent className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Get insights into your organization's attendance and performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={dashboardStats.totalEmployees}
          icon={Users}
          color="border-blue-500"
        />
        <StatCard
          title="Present Today"
          value={dashboardStats.presentToday}
          icon={CheckCircle}
          color="border-green-500"
        />
        <StatCard
          title="Absent Today"
          value={dashboardStats.absentToday}
          icon={AlertCircle}
          color="border-red-500"
        />
        <StatCard
          title="Average Attendance"
          value={`${dashboardStats.averageAttendance}%`}
          icon={BarChart3}
          color="border-purple-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {attendanceData.slice(0, 5).map((record, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    record.status === "present" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium">{record.userName}</span>
                <span className="text-gray-600">{record.jobRole}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(record.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {attendanceData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No recent activity found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
