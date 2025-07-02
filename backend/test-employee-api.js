const axios = require("axios");

const testEmployeeAPI = async () => {
  try {
    // First login to get a token
    console.log("Logging in...");
    const loginResponse = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email: "test.employee@company.com",
        password: "password123",
      }
    );

    const token = loginResponse.data.data.token;
    console.log("Login successful, token received");

    // Test employee attendance endpoint
    console.log("Testing employee attendance API...");
    const attendanceResponse = await axios.get(
      "http://localhost:3000/api/employee/attendance?startDate=2025-07-01&endDate=2025-07-31",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Employee attendance response:");
    console.log(JSON.stringify(attendanceResponse.data, null, 2));
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

testEmployeeAPI();
