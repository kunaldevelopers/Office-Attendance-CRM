import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { attendanceAPI } from "../services/api";
import ProfessionalLayout from "./layout/ProfessionalLayout";
import {
  LogIn,
  LogOut,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  Activity,
  TrendingUp,
} from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState({
    loginSent: false,
    logoutSent: false,
    loginTime: null,
    logoutTime: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [monthlyStats, setMonthlyStats] = useState({
    presentDays: 0,
    absentDays: 0,
    totalWorkingDays: 0,
    attendancePercentage: 0,
    totalHoursWorked: 0,
    loading: true,
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  // Fetch today's status on component mount
  useEffect(() => {
    const fetchTodayStatus = async () => {
      try {
        const response = await attendanceAPI.getTodayStatus();
        setTodayStatus(response.data.data);
      } catch (error) {
        console.error("Failed to fetch today status:", error);
        showMessage("error", "Failed to load today's status");
      }
    };

    fetchTodayStatus();
  }, []);

  // Fetch monthly statistics
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!user?._id) {
        console.log("🚫 No user._id found:", user);
        return;
      }

      try {
        setMonthlyStats((prev) => ({ ...prev, loading: true }));

        const currentDate = new Date();

        // Use exact same date logic as admin EmployeeMonthlyDetails
        const startDateObj = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endDateObj = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        const startDate = `${startDateObj.getFullYear()}-${String(
          startDateObj.getMonth() + 1
        ).padStart(2, "0")}-${String(startDateObj.getDate()).padStart(2, "0")}`;
        const endDate = `${endDateObj.getFullYear()}-${String(
          endDateObj.getMonth() + 1
        ).padStart(2, "0")}-${String(endDateObj.getDate()).padStart(2, "0")}`;

        console.log("📅 EmployeeDashboard: Fetching monthly stats", {
          userId: user._id,
          userName: user.name,
          dateRange: { startDate, endDate },
        });

        // Use employee API specifically for user's own data
        const response = await fetch(
          `/api/employee/attendance?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("📊 Employee API Response:", {
          success: data.success,
          recordsCount: data.data?.records?.length || 0,
          records: data.data?.records || [],
        });

        if (data.success && data.data && data.data.records) {
          const records = data.data.records;

          // Use exact same calculation logic as admin EmployeeMonthlyDetails
          const totalDaysInMonth = endDateObj.getDate();
          const presentDays = records.filter(
            (record) => record.loginTime
          ).length;
          const absentDays = totalDaysInMonth - presentDays;

          let totalHoursWorked = 0;
          records.forEach((record) => {
            if (record.loginTime && record.logoutTime) {
              const loginTime = new Date(record.loginTime);
              const logoutTime = new Date(record.logoutTime);
              const hoursWorked = (logoutTime - loginTime) / (1000 * 60 * 60);
              totalHoursWorked += hoursWorked;
              console.log(
                `📝 Record ${record.date}: ${hoursWorked.toFixed(2)} hours`
              );
            }
          });

          const attendancePercentage =
            totalDaysInMonth > 0 ? (presentDays / totalDaysInMonth) * 100 : 0;

          const calculatedStats = {
            presentDays,
            absentDays,
            totalWorkingDays: totalDaysInMonth,
            attendancePercentage: Math.round(attendancePercentage),
            totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
            loading: false,
          };

          console.log("📈 Calculated stats:", calculatedStats);

          setMonthlyStats(calculatedStats);
        } else {
          console.log("❌ No attendance records found or API error");
          setMonthlyStats((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Failed to fetch monthly stats:", error);
        setMonthlyStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMonthlyStats();
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleLogin = async () => {
    if (todayStatus.loginSent) {
      showMessage("warning", "You have already logged in today!");
      return;
    }
    setLoading(true);
    try {
      const response = await attendanceAPI.sendLoginMessage();
      const loginTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        loginSent: true,
        loginTime: loginTime.toISOString(),
      }));

      showMessage(
        "success",
        `✅ Login recorded at ${loginTime.toLocaleTimeString()}! ${
          response.data.data.whatsappSent
            ? "WhatsApp message sent successfully."
            : response.data.data.whatsappError
            ? `WhatsApp failed: ${response.data.data.whatsappError}`
            : "WhatsApp service unavailable."
        }`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to send login message";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (todayStatus.logoutSent) {
      showMessage("warning", "You have already logged out today!");
      return;
    }
    setLoading(true);
    try {
      const response = await attendanceAPI.sendLogoutMessage();
      const logoutTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        logoutSent: true,
        logoutTime: logoutTime.toISOString(),
      }));

      showMessage(
        "success",
        `✅ Logout recorded at ${logoutTime.toLocaleTimeString()}! ${
          response.data.data.whatsappSent
            ? "WhatsApp message sent successfully."
            : response.data.data.whatsappError
            ? `WhatsApp failed: ${response.data.data.whatsappError}`
            : "WhatsApp service unavailable."
        }`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to send logout message";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ProfessionalLayout>
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-8 mb-8 text-white shadow-2xl border border-indigo-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-violet-100 text-lg font-medium">
                Track your attendance and manage your schedule effortlessly
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="text-sm text-violet-100">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Actions Panel */}
        <div className="lg:col-span-2">
          {/* Current Status Card */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Today's Status
              </h2>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">
                  Active
                </span>
              </div>
            </div>

            {/* Time Display for Mobile */}
            <div className="md:hidden bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-center space-x-4">
                <Clock className="w-6 h-6 text-indigo-600" />
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-indigo-900">
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="text-sm text-indigo-700 font-medium">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Login Button */}
              <div
                className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                  todayStatus.loginSent
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-emerald-500 border-emerald-400 hover:bg-emerald-600 cursor-pointer"
                }`}
                onClick={
                  !todayStatus.loginSent && !loading ? handleLogin : undefined
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      todayStatus.loginSent ? "bg-emerald-200" : "bg-white/20"
                    }`}
                  >
                    <LogIn
                      className={`w-6 h-6 ${
                        todayStatus.loginSent
                          ? "text-emerald-700"
                          : "text-white"
                      }`}
                    />
                  </div>
                  {todayStatus.loginSent && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    todayStatus.loginSent ? "text-emerald-800" : "text-white"
                  }`}
                >
                  {loading && !todayStatus.loginSent
                    ? "Sending..."
                    : "Logged In"}
                </h3>
                <p
                  className={`text-sm ${
                    todayStatus.loginSent
                      ? "text-emerald-600"
                      : "text-emerald-100"
                  }`}
                >
                  {todayStatus.loginSent
                    ? `Logged in at ${formatTime(todayStatus.loginTime)}`
                    : "Mark your online presence for today"}
                </p>
              </div>

              {/* Logout Button */}
              <div
                className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                  todayStatus.logoutSent
                    ? "bg-rose-50 border-rose-300"
                    : "bg-rose-500 border-rose-400 hover:bg-rose-600 cursor-pointer"
                }`}
                onClick={
                  !todayStatus.logoutSent && !loading ? handleLogout : undefined
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      todayStatus.logoutSent ? "bg-rose-200" : "bg-white/20"
                    }`}
                  >
                    <LogOut
                      className={`w-6 h-6 ${
                        todayStatus.logoutSent ? "text-rose-700" : "text-white"
                      }`}
                    />
                  </div>
                  {todayStatus.logoutSent && (
                    <CheckCircle className="w-6 h-6 text-rose-600" />
                  )}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    todayStatus.logoutSent ? "text-rose-800" : "text-white"
                  }`}
                >
                  {loading && !todayStatus.logoutSent
                    ? "Sending..."
                    : "Logged Out"}
                </h3>
                <p
                  className={`text-sm ${
                    todayStatus.logoutSent ? "text-rose-600" : "text-rose-100"
                  }`}
                >
                  {todayStatus.logoutSent
                    ? `Logged out at ${formatTime(todayStatus.logoutTime)}`
                    : "Mark your offline status for today"}
                </p>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`mt-6 rounded-xl p-4 border-l-4 shadow-lg ${
                  message.type === "success"
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-l-emerald-500 border border-emerald-200"
                    : message.type === "error"
                    ? "bg-gradient-to-r from-rose-50 to-red-50 text-rose-800 border-l-rose-500 border border-rose-200"
                    : "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-l-amber-500 border border-amber-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">{message.text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Today's Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-800">
                    Date
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full">
                  {currentTime.toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <LogIn className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">
                    Logged In
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                  {todayStatus.loginTime
                    ? formatTime(todayStatus.loginTime)
                    : "--:--"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-semibold text-rose-800">
                    Logged Out
                  </span>
                </div>
                <span className="text-sm font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full">
                  {todayStatus.logoutTime
                    ? formatTime(todayStatus.logoutTime)
                    : "--:--"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="text-center p-5 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-xl border border-violet-200">
                <TrendingUp className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-violet-900">
                  {monthlyStats.loading
                    ? "..."
                    : `${monthlyStats.attendancePercentage}%`}
                </div>
                <div className="text-sm font-semibold text-violet-700">
                  Monthly Attendance
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="text-lg font-bold text-emerald-900">
                    {monthlyStats.loading ? "..." : monthlyStats.presentDays}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700">
                    Present Days
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="text-lg font-bold text-amber-900">
                    {monthlyStats.loading ? "..." : monthlyStats.absentDays}
                  </div>
                  <div className="text-xs font-semibold text-amber-700">
                    Absent Days
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-900">
                  {monthlyStats.loading
                    ? "..."
                    : `${monthlyStats.totalHoursWorked}h`}
                </div>
                <div className="text-xs font-semibold text-blue-700">
                  Total Working Hours
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200 shadow-lg">
            <h3 className="text-lg font-bold text-cyan-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">📝</span>
              Important Note
            </h3>
            <p className="text-sm text-cyan-800 leading-relaxed font-medium">
              Your attendance is automatically tracked when you log in and log
              out. WhatsApp notifications will be sent when the service is
              available. Stay connected and manage your time efficiently!
            </p>
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default EmployeeDashboard;
