import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { attendanceAPI } from "../services/api";
import {
  LogIn,
  LogOut,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState({
    loginSent: false,
    logoutSent: false,
    loginTime: null,
    logoutTime: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleAppLogout = () => {
    showMessage("success", "Successfully logged out! Redirecting to login...");
    setTimeout(() => {
      logout();
    }, 1500);
  };

  const handleLogin = async () => {
    if (todayStatus.loginSent) {
      showMessage("warning", "You have already logged in today!");
      return;
    }
    setLoading(true);
    try {
      await attendanceAPI.sendLoginMessage();
      const loginTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        loginSent: true,
        loginTime: loginTime.toISOString(),
      }));
      showMessage(
        "success",
        `✅ Login recorded at ${loginTime.toLocaleTimeString()}! WhatsApp message sent to +919142130225.`
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
      await attendanceAPI.sendLogoutMessage();
      const logoutTime = new Date();

      setTodayStatus((prev) => ({
        ...prev,
        logoutSent: true,
        logoutTime: logoutTime.toISOString(),
      }));
      showMessage(
        "success",
        `✅ Logout recorded at ${logoutTime.toLocaleTimeString()}! WhatsApp message sent to +919142130225.`
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome, {user?.name}
                </h1>
                <p className="text-sm text-gray-600">Attendance Dashboard</p>
              </div>
            </div>{" "}
            <button
              onClick={handleAppLogout}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDate(currentTime)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-mono font-bold">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Display */}
        {(todayStatus.loginTime || todayStatus.logoutTime) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Today's Activity
            </h2>
            <div className="space-y-3">
              {todayStatus.loginTime && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      ✅ Logged in at: {formatTime(todayStatus.loginTime)}
                    </p>
                    <p className="text-xs text-green-600">
                      {formatDate(new Date(todayStatus.loginTime))}
                    </p>
                  </div>
                </div>
              )}
              {todayStatus.logoutTime && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      ✅ Logged out at: {formatTime(todayStatus.logoutTime)}
                    </p>
                    <p className="text-xs text-blue-600">
                      {formatDate(new Date(todayStatus.logoutTime))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message Display */}
        {message.text && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : message.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading || todayStatus.loginSent}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
              todayStatus.loginSent
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl active:scale-95"
            }`}
          >
            <LogIn className="w-6 h-6" />
            <span>
              {loading && !todayStatus.loginSent
                ? "Sending..."
                : todayStatus.loginSent
                ? "Already Logged In"
                : "Login"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loading || todayStatus.logoutSent}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
              todayStatus.logoutSent
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl active:scale-95"
            }`}
          >
            <LogOut className="w-6 h-6" />
            <span>
              {loading && !todayStatus.logoutSent
                ? "Sending..."
                : todayStatus.logoutSent
                ? "Already Logged Out"
                : "Logout"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Attendance messages will be sent to WhatsApp automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
