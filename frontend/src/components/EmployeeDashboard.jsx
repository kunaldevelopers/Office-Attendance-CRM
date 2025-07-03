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
  Coffee,
  Pause,
  Play,
  Square,
} from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState({
    loginSent: false,
    logoutSent: false,
    loginTime: null,
    logoutTime: null,
    lunchBreakActive: false,
    miscBreakActive: false,
    lunchBreaks: [],
    miscBreaks: [],
    totalLunchBreakDuration: 0,
    totalMiscBreakDuration: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [monthlyStats, setMonthlyStats] = useState({
    presentDays: 0,
    absentDays: 0,
    totalWorkingDays: 0,
    attendancePercentage: 0,
    totalHoursWorked: 0,
    totalLunchBreakHours: 0,
    totalMiscBreakHours: 0,
    netWorkingHours: 0,
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
        const data = response.data.data;
        setTodayStatus({
          loginSent: data.loginSent,
          logoutSent: data.logoutSent,
          loginTime: data.loginTime,
          logoutTime: data.logoutTime,
          lunchBreakActive: data.lunchBreakActive,
          miscBreakActive: data.miscBreakActive,
          lunchBreaks: data.lunchBreaks || [],
          miscBreaks: data.miscBreaks || [],
          totalLunchBreakDuration: data.totalLunchBreakDuration || 0,
          totalMiscBreakDuration: data.totalMiscBreakDuration || 0,
        });
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
          let totalLunchBreakHours = 0;
          let totalMiscBreakHours = 0;

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

            // Track lunch break hours for display (already included in working hours)
            if (record.totalLunchBreakDuration) {
              const lunchHours = record.totalLunchBreakDuration / 60; // Convert minutes to hours
              totalLunchBreakHours += lunchHours;
            }

            // Calculate miscellaneous break hours (these are subtracted from working hours)
            if (record.totalMiscBreakDuration) {
              const miscHours = record.totalMiscBreakDuration / 60; // Convert minutes to hours
              totalMiscBreakHours += miscHours;
            }
          });

          // Calculate net working hours: base hours - misc breaks (lunch already included in base hours)
          const netWorkingHours = totalHoursWorked - totalMiscBreakHours;

          const attendancePercentage =
            totalDaysInMonth > 0 ? (presentDays / totalDaysInMonth) * 100 : 0;

          const calculatedStats = {
            presentDays,
            absentDays,
            totalWorkingDays: totalDaysInMonth,
            attendancePercentage: Math.round(attendancePercentage),
            totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
            totalLunchBreakHours: Math.round(totalLunchBreakHours * 100) / 100,
            totalMiscBreakHours: Math.round(totalMiscBreakHours * 100) / 100,
            netWorkingHours: Math.round(netWorkingHours * 100) / 100,
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

  // Lunch Break Handlers
  const handleLunchBreakStart = async () => {
    if (todayStatus.lunchBreakActive) {
      showMessage("warning", "Lunch break is already active!");
      return;
    }
    setLoading(true);
    try {
      await attendanceAPI.startLunchBreak();
      const breakTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        lunchBreakActive: true,
      }));

      showMessage(
        "success",
        `🍽️ Lunch break started at ${breakTime.toLocaleTimeString()}!`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to start lunch break";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLunchBreakStop = async () => {
    if (!todayStatus.lunchBreakActive) {
      showMessage("warning", "No active lunch break to stop!");
      return;
    }
    setLoading(true);
    try {
      await attendanceAPI.stopLunchBreak();
      const breakTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        lunchBreakActive: false,
      }));

      showMessage(
        "success",
        `🍽️ Lunch break ended at ${breakTime.toLocaleTimeString()}!`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to stop lunch break";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Miscellaneous Break Handlers
  const handleMiscBreakStart = async () => {
    if (todayStatus.miscBreakActive) {
      showMessage("warning", "Miscellaneous break is already active!");
      return;
    }
    setLoading(true);
    try {
      await attendanceAPI.startMiscBreak();
      const breakTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        miscBreakActive: true,
      }));

      showMessage(
        "success",
        `⏸️ Miscellaneous break started at ${breakTime.toLocaleTimeString()}!`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to start miscellaneous break";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMiscBreakStop = async () => {
    if (!todayStatus.miscBreakActive) {
      showMessage("warning", "No active miscellaneous break to stop!");
      return;
    }
    setLoading(true);
    try {
      await attendanceAPI.stopMiscBreak();
      const breakTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        miscBreakActive: false,
      }));

      showMessage(
        "success",
        `⏸️ Miscellaneous break ended at ${breakTime.toLocaleTimeString()}!`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to stop miscellaneous break";
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Lunch Break Button */}
              <div
                className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                  todayStatus.lunchBreakActive
                    ? "bg-orange-50 border-orange-300"
                    : "bg-orange-500 border-orange-400 hover:bg-orange-600 cursor-pointer"
                }`}
                onClick={
                  !loading
                    ? todayStatus.lunchBreakActive
                      ? handleLunchBreakStop
                      : handleLunchBreakStart
                    : undefined
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      todayStatus.lunchBreakActive
                        ? "bg-orange-200"
                        : "bg-white/20"
                    }`}
                  >
                    {todayStatus.lunchBreakActive ? (
                      <Square
                        className={`w-6 h-6 ${
                          todayStatus.lunchBreakActive
                            ? "text-orange-700"
                            : "text-white"
                        }`}
                      />
                    ) : (
                      <Coffee
                        className={`w-6 h-6 ${
                          todayStatus.lunchBreakActive
                            ? "text-orange-700"
                            : "text-white"
                        }`}
                      />
                    )}
                  </div>
                  {todayStatus.lunchBreakActive && (
                    <Activity className="w-6 h-6 text-orange-600 animate-pulse" />
                  )}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    todayStatus.lunchBreakActive
                      ? "text-orange-800"
                      : "text-white"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : todayStatus.lunchBreakActive
                    ? "Stop Lunch"
                    : "Start Lunch"}
                </h3>
                <p
                  className={`text-sm ${
                    todayStatus.lunchBreakActive
                      ? "text-orange-600"
                      : "text-orange-100"
                  }`}
                >
                  {todayStatus.lunchBreakActive
                    ? `Started at ${formatTime(todayStatus.lunchBreakStart)}`
                    : "Take your lunch break"}
                </p>
              </div>

              {/* Miscellaneous Break Button */}
              <div
                className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                  todayStatus.miscBreakActive
                    ? "bg-purple-50 border-purple-300"
                    : "bg-purple-500 border-purple-400 hover:bg-purple-600 cursor-pointer"
                }`}
                onClick={
                  !loading
                    ? todayStatus.miscBreakActive
                      ? handleMiscBreakStop
                      : handleMiscBreakStart
                    : undefined
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      todayStatus.miscBreakActive
                        ? "bg-purple-200"
                        : "bg-white/20"
                    }`}
                  >
                    {todayStatus.miscBreakActive ? (
                      <Square
                        className={`w-6 h-6 ${
                          todayStatus.miscBreakActive
                            ? "text-purple-700"
                            : "text-white"
                        }`}
                      />
                    ) : (
                      <Pause
                        className={`w-6 h-6 ${
                          todayStatus.miscBreakActive
                            ? "text-purple-700"
                            : "text-white"
                        }`}
                      />
                    )}
                  </div>
                  {todayStatus.miscBreakActive && (
                    <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
                  )}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    todayStatus.miscBreakActive
                      ? "text-purple-800"
                      : "text-white"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : todayStatus.miscBreakActive
                    ? "Stop Break"
                    : "Start Break"}
                </h3>
                <p
                  className={`text-sm ${
                    todayStatus.miscBreakActive
                      ? "text-purple-600"
                      : "text-purple-100"
                  }`}
                >
                  {todayStatus.miscBreakActive
                    ? `Started at ${formatTime(todayStatus.miscBreakStart)}`
                    : "Take a miscellaneous break"}
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

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">
                    Lunch Break
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-900 bg-orange-100 px-3 py-1 rounded-full">
                    {todayStatus.lunchBreakActive ? "Active" : "Not Active"}
                  </div>
                  <div className="text-xs text-orange-700 mt-1">
                    {todayStatus.lunchBreaks &&
                    todayStatus.lunchBreaks.length > 0
                      ? `${todayStatus.lunchBreaks.length} break${
                          todayStatus.lunchBreaks.length > 1 ? "s" : ""
                        } today`
                      : "No breaks today"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <Pause className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">
                    Misc Break
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
                    {todayStatus.miscBreakActive ? "Active" : "Not Active"}
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    {todayStatus.miscBreaks && todayStatus.miscBreaks.length > 0
                      ? `${todayStatus.miscBreaks.length} break${
                          todayStatus.miscBreaks.length > 1 ? "s" : ""
                        } today`
                      : "No breaks today"}
                  </div>
                </div>
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
                    : `${
                        monthlyStats.netWorkingHours ||
                        monthlyStats.totalHoursWorked
                      }h`}
                </div>
                <div className="text-xs font-semibold text-blue-700">
                  Net Working Hours
                </div>
              </div>

              {/* Break Statistics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <Coffee className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-orange-900">
                    {monthlyStats.loading
                      ? "..."
                      : `${monthlyStats.totalLunchBreakHours || 0}h`}
                  </div>
                  <div className="text-xs font-semibold text-orange-700">
                    Lunch Hours
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <Pause className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-purple-900">
                    {monthlyStats.loading
                      ? "..."
                      : `${monthlyStats.totalMiscBreakHours || 0}h`}
                  </div>
                  <div className="text-xs font-semibold text-purple-700">
                    Break Hours
                  </div>
                </div>
              </div>

              {/* Working Hours Breakdown */}
              <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                <TrendingUp className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <div className="space-y-1">
                  <div className="text-xs text-slate-600">
                    Base Hours:{" "}
                    {monthlyStats.loading
                      ? "..."
                      : `${monthlyStats.totalHoursWorked}h`}
                  </div>
                  <div className="text-xs text-orange-600">
                    (Lunch:{" "}
                    {monthlyStats.loading
                      ? "..."
                      : `${monthlyStats.totalLunchBreakHours || 0}h included)`}
                  </div>
                  <div className="text-xs text-purple-600">
                    - Breaks:{" "}
                    {monthlyStats.loading
                      ? "..."
                      : `${monthlyStats.totalMiscBreakHours || 0}h`}
                  </div>
                  <div className="text-sm font-bold text-slate-900 border-t border-slate-300 pt-1">
                    Net:{" "}
                    {monthlyStats.loading
                      ? "..."
                      : `${
                          monthlyStats.netWorkingHours ||
                          monthlyStats.totalHoursWorked
                        }h`}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  Hours Breakdown
                </div>
              </div>
            </div>
          </div>

          {/* Today's Break Details */}
          {((todayStatus.lunchBreaks && todayStatus.lunchBreaks.length > 0) ||
            (todayStatus.miscBreaks && todayStatus.miscBreaks.length > 0)) && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Today's Break Details
              </h3>

              {/* Lunch Breaks */}
              {todayStatus.lunchBreaks &&
                todayStatus.lunchBreaks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center">
                      <Coffee className="w-4 h-4 mr-2" />
                      Lunch Breaks ({todayStatus.lunchBreaks.length})
                    </h4>
                    <div className="space-y-2">
                      {todayStatus.lunchBreaks.map((breakItem, index) => (
                        <div
                          key={index}
                          className="bg-orange-50 p-3 rounded-lg border border-orange-200"
                        >
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-orange-700">
                              Break #{index + 1}
                            </span>
                            <div className="text-orange-900">
                              {formatTime(breakItem.startTime)} -{" "}
                              {breakItem.endTime
                                ? formatTime(breakItem.endTime)
                                : "Active"}
                              {breakItem.duration && (
                                <span className="ml-2 text-xs text-orange-600">
                                  ({Math.round(breakItem.duration)} min)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Miscellaneous Breaks */}
              {todayStatus.miscBreaks && todayStatus.miscBreaks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
                    <Pause className="w-4 h-4 mr-2" />
                    Miscellaneous Breaks ({todayStatus.miscBreaks.length})
                  </h4>
                  <div className="space-y-2">
                    {todayStatus.miscBreaks.map((breakItem, index) => (
                      <div
                        key={index}
                        className="bg-purple-50 p-3 rounded-lg border border-purple-200"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">
                            Break #{index + 1}
                          </span>
                          <div className="text-purple-900">
                            {formatTime(breakItem.startTime)} -{" "}
                            {breakItem.endTime
                              ? formatTime(breakItem.endTime)
                              : "Active"}
                            {breakItem.duration && (
                              <span className="ml-2 text-xs text-purple-600">
                                ({Math.round(breakItem.duration)} min)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
