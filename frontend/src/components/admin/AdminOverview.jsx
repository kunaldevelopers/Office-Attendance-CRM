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
  Briefcase,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
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
  const fetchDashboardStatsByRole = useCallback(async () => {
    try {
      const response = await adminAPI.getDashboardStatsByRole();
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        console.error("Failed to fetch dashboard stats:", response.data);
        // Fallback to empty data structure
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
      // Fallback to empty data structure on error
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
  }, []);

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
  const OverallStatCard = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    color,
  }) => {
    const IconComponent = icon;
    return (
      <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-100/50 hover-lift">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 via-transparent to-slate-50/30"></div>
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2.5 rounded-lg ${color.bg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className={`h-5 w-5 ${color.icon}`} />
                </div>
                <p className="text-sm font-medium text-slate-600 tracking-wide uppercase">
                  {title}
                </p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {value}
                </p>
                {trend && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      trend === "up"
                        ? "bg-emerald-100 text-emerald-700"
                        : trend === "down"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <TrendingUp
                      className={`h-3 w-3 ${
                        trend === "down" ? "rotate-180" : ""
                      }`}
                    />
                    {trendValue}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${color.progress} transition-all duration-1000 ease-out group-hover:animate-pulse`}
              style={{
                width:
                  typeof value === "string"
                    ? "0%"
                    : `${Math.min((value / 100) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };
  const RoleCard = ({ roleData }) => {
    const isExpanded = expandedRole === roleData.jobRole;
    const attendancePercentage = roleData.attendancePercentage;

    const getAttendanceTheme = (percentage) => {
      if (percentage >= 90)
        return {
          bg: "from-emerald-500 to-teal-600",
          text: "text-emerald-700",
          border: "border-emerald-200",
          badge: "bg-emerald-100 text-emerald-800",
        };
      if (percentage >= 75)
        return {
          bg: "from-cyan-500 to-blue-600",
          text: "text-cyan-700",
          border: "border-cyan-200",
          badge: "bg-cyan-100 text-cyan-800",
        };
      if (percentage >= 60)
        return {
          bg: "from-amber-500 to-orange-600",
          text: "text-amber-700",
          border: "border-amber-200",
          badge: "bg-amber-100 text-amber-800",
        };
      return {
        bg: "from-red-500 to-rose-600",
        text: "text-red-700",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
      };
    };

    const theme = getAttendanceTheme(attendancePercentage);
    return (
      <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100/50 hover-lift animate-fadeInUp">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-cyan-50/30"></div>

        {/* Header */}
        <div
          className="relative p-6 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-cyan-50/30 transition-all duration-300"
          onClick={() => setExpandedRole(isExpanded ? null : roleData.jobRole)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-cyan-200 transition-shadow duration-300">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {roleData.jobRole}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {roleData.totalEmployees} employee
                    {roleData.totalEmployees !== 1 ? "s" : ""}
                  </span>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${theme.badge}`}
                  >
                    Active Role
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Attendance Percentage Circle */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className={`text-2xl font-bold ${theme.text}`}>
                    {attendancePercentage}%
                  </div>
                </div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r bg-clip-border"
                  style={{
                    background: `conic-gradient(from 0deg, rgb(6 182 212) ${
                      attendancePercentage * 3.6
                    }deg, rgb(226 232 240) ${attendancePercentage * 3.6}deg)`,
                  }}
                ></div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  {isExpanded ? "Hide Details" : "View Details"}
                </span>
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-cyan-100 transition-colors duration-300">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {roleData.totalEmployees}
              </div>
              <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Total Staff
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-700 mb-1">
                {roleData.presentToday}
              </div>
              <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Present Today
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {roleData.absentToday}
              </div>
              <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Absent Today
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-slate-200 bg-gradient-to-br from-slate-50/50 to-cyan-50/30">
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Present Employees */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <UserCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-700 text-lg">
                        Present Today
                      </h4>
                      <p className="text-sm text-slate-600">
                        {roleData.presentEmployees.length} employees checked in
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {roleData.presentEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="group bg-white p-4 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {employee.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {employee.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {employee.email}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mb-1">
                              <Clock className="h-4 w-4" />
                              {employee.loginTime
                                ? new Date(
                                    employee.loginTime
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </div>
                            {employee.logoutTime && (
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                Out:{" "}
                                {new Date(
                                  employee.logoutTime
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {roleData.presentEmployees.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">
                          No employees present today
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Absent Employees */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <UserX className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-700 text-lg">
                        Absent Today
                      </h4>
                      <p className="text-sm text-slate-600">
                        {roleData.absentEmployees.length} employees not checked
                        in
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {roleData.absentEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="group bg-white p-4 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-slate-500 mb-1">
                              {employee.email}
                            </div>
                            <div className="flex items-center gap-2 text-red-600 text-xs font-medium">
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                              No attendance recorded
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {roleData.absentEmployees.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-emerald-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">
                          All employees are present! 🎉
                        </p>
                      </div>
                    )}
                  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin mx-auto"
              style={{ animationDelay: "0.15s" }}
            ></div>
          </div>
          <p className="mt-6 text-slate-700 font-medium text-lg">
            Loading overview...
          </p>
          <p className="text-slate-500 text-sm">Fetching dashboard analytics</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-slate-600/10 rounded-2xl"></div>
          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-cyan-700 bg-clip-text text-transparent mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-slate-600 text-lg">
                  Real-time insights into your organization's attendance and
                  performance metrics
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-white shadow-lg">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OverallStatCard
            title="Total Employees"
            value={dashboardData.overall.totalEmployees}
            icon={Users}
            trend="up"
            trendValue="+5%"
            color={{
              bg: "bg-gradient-to-br from-blue-100 to-cyan-100",
              icon: "text-cyan-600",
              progress: "bg-gradient-to-r from-cyan-500 to-blue-600",
            }}
          />
          <OverallStatCard
            title="Present Today"
            value={dashboardData.overall.presentToday}
            icon={CheckCircle}
            trend="up"
            trendValue="+12%"
            color={{
              bg: "bg-gradient-to-br from-emerald-100 to-teal-100",
              icon: "text-emerald-600",
              progress: "bg-gradient-to-r from-emerald-500 to-teal-600",
            }}
          />
          <OverallStatCard
            title="Absent Today"
            value={dashboardData.overall.absentToday}
            icon={AlertCircle}
            trend="down"
            trendValue="-8%"
            color={{
              bg: "bg-gradient-to-br from-rose-100 to-red-100",
              icon: "text-red-600",
              progress: "bg-gradient-to-r from-red-500 to-rose-600",
            }}
          />
          <OverallStatCard
            title="Average Attendance"
            value={`${dashboardData.overall.averageAttendance}%`}
            icon={BarChart3}
            trend="up"
            trendValue="+3%"
            color={{
              bg: "bg-gradient-to-br from-purple-100 to-indigo-100",
              icon: "text-purple-600",
              progress: "bg-gradient-to-r from-purple-500 to-indigo-600",
            }}
          />
        </div>

        {/* Role-based Statistics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Attendance by Role
              </h2>
              <p className="text-slate-600">
                Detailed breakdown of attendance metrics across different job
                roles
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Live Updates</span>
            </div>
          </div>

          <div className="space-y-6">
            {dashboardData.roleStats.map((roleData) => (
              <RoleCard key={roleData.jobRole} roleData={roleData} />
            ))}
            {dashboardData.roleStats.length === 0 && (
              <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    No Role Data Available
                  </h3>
                  <p className="text-slate-600">
                    There are currently no employee roles configured or no
                    attendance data to display.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
