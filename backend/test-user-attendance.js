const axios = require("axios");

const API_BASE = "http://localhost:3000/api";

async function testUserAttendance() {
  try {
    // First, login to get a token
    console.log("🔐 Logging in...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "john.doe@company.com",
      password: "password123",
    });

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    console.log("✅ Login successful");
    console.log("👤 User full object:", user);

    // Make sure we're using the correct user ID
    if (user._id !== "6865639b45b8d3faecf3d1c5") {
      console.log(
        "⚠️  Warning: Got unexpected user ID. Expected: 6865639b45b8d3faecf3d1c5, Got:",
        user._id
      );
    }

    // Calculate current month dates - use current date
    const currentDate = new Date(); // This would be July 2, 2025 based on context
    console.log("Current date:", currentDate.toISOString());

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

    console.log("📅 Date range:", { startDate, endDate });

    // Also test with a different range to see if there's any data
    console.log("\n🔍 Testing wider date range...");
    const widerStartDate = "2024-01-01";
    const widerEndDate = "2025-12-31";

    const widerResponse = await axios.get(`${API_BASE}/employee/attendance`, {
      params: { startDate: widerStartDate, endDate: widerEndDate },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📊 Wider range response:");
    console.log("Success:", widerResponse.data.success);
    console.log(
      "Records count:",
      widerResponse.data.data?.records?.length || 0
    );

    if (widerResponse.data.data?.records?.length > 0) {
      console.log("📝 Sample records from wider range:");
      widerResponse.data.data.records.slice(0, 3).forEach((record, index) => {
        console.log(`  Record ${index + 1}:`, {
          date: record.date,
          userId: record.userId,
          loginTime: record.loginTime
            ? new Date(record.loginTime).toLocaleString()
            : null,
          logoutTime: record.logoutTime
            ? new Date(record.logoutTime).toLocaleString()
            : null,
        });
      });
    }

    // Test employee API call for user's own attendance
    console.log("\n🔍 Testing employee API call for user attendance...");
    const attendanceResponse = await axios.get(
      `${API_BASE}/employee/attendance`,
      {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("📊 Attendance API Response:");
    console.log("Success:", attendanceResponse.data.success);
    console.log(
      "Records count:",
      attendanceResponse.data.data?.records?.length || 0
    );

    if (attendanceResponse.data.data?.records?.length > 0) {
      console.log("📝 Sample records:");
      attendanceResponse.data.data.records
        .slice(0, 3)
        .forEach((record, index) => {
          console.log(`  Record ${index + 1}:`, {
            date: record.date,
            loginTime: record.loginTime
              ? new Date(record.loginTime).toLocaleString()
              : null,
            logoutTime: record.logoutTime
              ? new Date(record.logoutTime).toLocaleString()
              : null,
            hoursWorked:
              record.loginTime && record.logoutTime
                ? (
                    (new Date(record.logoutTime) - new Date(record.loginTime)) /
                    (1000 * 60 * 60)
                  ).toFixed(2) + "h"
                : "N/A",
          });
        });

      // Calculate stats like the frontend does
      const records = attendanceResponse.data.data.records;
      const totalDaysInMonth = endDateObj.getDate();
      const presentDays = records.filter((record) => record.loginTime).length;
      const absentDays = totalDaysInMonth - presentDays;

      let totalHoursWorked = 0;
      records.forEach((record) => {
        if (record.loginTime && record.logoutTime) {
          const loginTime = new Date(record.loginTime);
          const logoutTime = new Date(record.logoutTime);
          const hoursWorked = (logoutTime - loginTime) / (1000 * 60 * 60);
          totalHoursWorked += hoursWorked;
        }
      });

      const attendancePercentage =
        totalDaysInMonth > 0 ? (presentDays / totalDaysInMonth) * 100 : 0;

      console.log("\n📈 Calculated Stats:");
      console.log("Total days in month:", totalDaysInMonth);
      console.log("Present days:", presentDays);
      console.log("Absent days:", absentDays);
      console.log(
        "Total hours worked:",
        Math.round(totalHoursWorked * 100) / 100
      );
      console.log(
        "Attendance percentage:",
        Math.round(attendancePercentage) + "%"
      );
    } else {
      console.log("❌ No attendance records found");
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testUserAttendance();
