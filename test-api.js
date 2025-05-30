const axios = require("axios");

async function testDashboardByRoleAPI() {
  try {
    // First login as admin to get token
    const loginResponse = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email: "admin@company.com",
        password: "admin123456",
      }
    );
    if (loginResponse.data.data && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log("✅ Login successful");

      // Test the new dashboard by role endpoint
      const dashboardResponse = await axios.get(
        "http://localhost:3000/api/admin/dashboard/by-role",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (dashboardResponse.data.success) {
        console.log("✅ Dashboard by role endpoint working");
        console.log("📊 Overall stats:", dashboardResponse.data.data.overall);
        console.log(
          "📋 Role stats count:",
          dashboardResponse.data.data.roleStats.length
        );

        dashboardResponse.data.data.roleStats.forEach((role) => {
          console.log(
            `   - ${role.jobRole}: ${role.totalEmployees} total, ${role.presentToday} present, ${role.absentToday} absent (${role.attendancePercentage}%)`
          );
        });
      } else {
        console.log(
          "❌ Dashboard by role endpoint failed:",
          dashboardResponse.data
        );
      }
    } else {
      console.log("❌ Login failed:", loginResponse.data);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testDashboardByRoleAPI();
