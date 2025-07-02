import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  MapPin,
  CalendarDays,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

const EmployeeMonthlyDetails = () => {
  const { employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(location.state?.employee || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState({
    totalWorkingDays: 0,
    presentDays: 0,
    absentDays: 0,
    totalHoursWorked: 0,
    averageHoursPerDay: 0,
    attendancePercentage: 0,
  });

  const calculateMonthlyStats = useCallback(
    (data) => {
      const totalDaysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      ).getDate();
      const presentDays = data.filter((record) => record.loginTime).length;
      const absentDays = totalDaysInMonth - presentDays;

      let totalHoursWorked = 0;
      data.forEach((record) => {
        if (record.loginTime && record.logoutTime) {
          const loginTime = new Date(record.loginTime);
          const logoutTime = new Date(record.logoutTime);
          const hoursWorked = (logoutTime - loginTime) / (1000 * 60 * 60);
          totalHoursWorked += hoursWorked;
        }
      });

      const averageHoursPerDay =
        presentDays > 0 ? totalHoursWorked / presentDays : 0;
      const attendancePercentage =
        totalDaysInMonth > 0 ? (presentDays / totalDaysInMonth) * 100 : 0;

      setMonthlyStats({
        totalWorkingDays: totalDaysInMonth,
        presentDays,
        absentDays,
        totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
        averageHoursPerDay: Math.round(averageHoursPerDay * 100) / 100,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      });
    },
    [currentMonth]
  );

  useEffect(() => {
    const loadData = async () => {
      if (!employee) {
        try {
          const response = await adminAPI.getStaffById(employeeId);
          if (response.data.success) {
            setEmployee(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
        }
      }

      // Fetch monthly attendance
      try {
        setLoading(true);

        // Use local date formatting to avoid timezone issues
        const startDateObj = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          1
        );
        const endDateObj = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          0
        );

        const startDate = `${startDateObj.getFullYear()}-${String(
          startDateObj.getMonth() + 1
        ).padStart(2, "0")}-${String(startDateObj.getDate()).padStart(2, "0")}`;
        const endDate = `${endDateObj.getFullYear()}-${String(
          endDateObj.getMonth() + 1
        ).padStart(2, "0")}-${String(endDateObj.getDate()).padStart(2, "0")}`;

        const response = await adminAPI.getUserAttendance(employeeId, {
          startDate,
          endDate,
        });

        if (
          response.data.success &&
          response.data.data &&
          response.data.data.records
        ) {
          setAttendanceData(response.data.data.records);
          calculateMonthlyStats(response.data.data.records);
        }
      } catch (error) {
        console.error("Error fetching monthly attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employeeId, currentMonth, employee, calculateMonthlyStats]);

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      if (days.length > 42) break; // Prevent infinite loop
    }

    return days;
  };

  const getAttendanceForDay = (date) => {
    // Use the same date formatting as Admin Overview to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    return attendanceData.find((record) => record.date === dateString);
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateWorkingHours = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return 0;
    const login = new Date(loginTime);
    const logout = new Date(logoutTime);
    return Math.round(((logout - login) / (1000 * 60 * 60)) * 100) / 100;
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 text-sm">
            Loading employee details...
          </p>
        </div>
      </div>
    );
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isCurrentMonth =
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/admin/employees-monthwise")}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Employees</span>
        </button>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Employee Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {employee.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Employee Details */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Full Name</p>
                  <p className="text-xl font-semibold">{employee.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Email</p>
                  <p className="text-sm">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Phone</p>
                  <p className="text-sm">{employee.whatsappNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Job Role</p>
                  <p className="text-lg font-medium">{employee.jobRole}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Qualification</p>
                  <p className="text-sm">{employee.qualification}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarDays className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Date of Birth</p>
                  <p className="text-sm">
                    {new Date(employee.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            {isCurrentMonth && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                Current Month
              </span>
            )}
          </div>

          <button
            onClick={() => changeMonth(1)}
            disabled={isCurrentMonth}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {monthlyStats.presentDays}
            </div>
            <div className="text-sm text-blue-800">Present Days</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {monthlyStats.absentDays}
            </div>
            <div className="text-sm text-red-800">Absent Days</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {monthlyStats.attendancePercentage}%
            </div>
            <div className="text-sm text-green-800">Attendance</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {monthlyStats.totalHoursWorked}h
            </div>
            <div className="text-sm text-purple-800">Total Hours</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {monthlyStats.averageHoursPerDay}h
            </div>
            <div className="text-sm text-indigo-800">Avg. Hours/Day</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                (monthlyStats.totalHoursWorked /
                  (monthlyStats.presentDays * 9)) *
                  100
              ) || 0}
              %
            </div>
            <div className="text-sm text-orange-800">Efficiency</div>
          </div>
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((date, index) => {
                const isCurrentMonthDate =
                  date.getMonth() === currentMonth.getMonth();
                const isToday =
                  new Date().toDateString() === date.toDateString();
                const attendance = getAttendanceForDay(date);
                const workingHours = attendance
                  ? calculateWorkingHours(
                      attendance.loginTime,
                      attendance.logoutTime
                    )
                  : 0;

                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[80px] border border-gray-200 rounded-lg relative ${
                      !isCurrentMonthDate
                        ? "bg-gray-100 text-gray-400"
                        : isToday
                        ? "bg-blue-100 border-blue-300"
                        : "bg-white"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        isToday ? "text-blue-800" : ""
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {isCurrentMonthDate &&
                      attendance &&
                      attendance.loginTime && (
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-700">
                              Present
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            In: {formatTime(attendance.loginTime)}
                          </div>
                          {attendance.logoutTime && (
                            <div className="text-xs text-gray-600">
                              Out: {formatTime(attendance.logoutTime)}
                            </div>
                          )}
                          {workingHours > 0 && (
                            <div
                              className={`text-xs font-medium ${
                                workingHours >= 9
                                  ? "text-green-600"
                                  : workingHours >= 6
                                  ? "text-orange-600"
                                  : "text-red-600"
                              }`}
                            >
                              {workingHours}h worked
                            </div>
                          )}
                        </div>
                      )}

                    {isCurrentMonthDate &&
                      (!attendance || !attendance.loginTime) && (
                        <div className="mt-1">
                          <div className="flex items-center space-x-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-700">Absent</span>
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeMonthlyDetails;
