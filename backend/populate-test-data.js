const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");
const bcrypt = require("bcryptjs");

const createTestData = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({ role: "employee" });
    await Log.deleteMany({});
    console.log("Cleared existing employee data");

    // Create test employees
    const employees = [
      {
        name: "John Smith",
        email: "john.smith@company.com",
        password: await bcrypt.hash("password123", 10),
        jobRole: "Developer",
        gender: "Male",
        age: 28,
        dateOfBirth: new Date("1995-03-15"),
        qualification: "UG",
        employmentType: "Regular",
        whatsappNumber: "+1234567890",
        callingNumber: "+1234567890",
        role: "employee",
        isActive: true,
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        password: await bcrypt.hash("password123", 10),
        jobRole: "Sales Executive",
        gender: "Female",
        age: 26,
        dateOfBirth: new Date("1997-07-22"),
        qualification: "PG",
        employmentType: "Regular",
        whatsappNumber: "+1234567891",
        callingNumber: "+1234567891",
        role: "employee",
        isActive: true,
      },
      {
        name: "Mike Davis",
        email: "mike.davis@company.com",
        password: await bcrypt.hash("password123", 10),
        jobRole: "Graphics Designer",
        gender: "Male",
        age: 24,
        dateOfBirth: new Date("1999-11-10"),
        qualification: "Diploma",
        employmentType: "Regular",
        whatsappNumber: "+1234567892",
        callingNumber: "+1234567892",
        role: "employee",
        isActive: true,
      },
    ];

    const createdEmployees = [];
    for (const empData of employees) {
      const employee = new User(empData);
      await employee.save();
      createdEmployees.push(employee);
      console.log(`Created employee: ${employee.name} - ${employee.jobRole}`);
    }

    // Create attendance records for the entire current month
    const today = new Date();
    const dates = [];

    // Get all days from the 1st of current month to today
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentDate = new Date(startOfMonth);

    while (currentDate <= today) {
      dates.push(currentDate.toLocaleDateString("en-CA"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("\nCreating attendance records...");

    for (const dateStr of dates) {
      for (const employee of createdEmployees) {
        // 80% chance of attendance
        const isPresent = Math.random() > 0.2;

        if (isPresent) {
          const loginHour = 8 + Math.floor(Math.random() * 2); // 8-9 AM
          const loginMinute = Math.floor(Math.random() * 60);
          const logoutHour = 17 + Math.floor(Math.random() * 2); // 5-6 PM
          const logoutMinute = Math.floor(Math.random() * 60);

          const loginTime = new Date(
            `${dateStr}T${loginHour.toString().padStart(2, "0")}:${loginMinute
              .toString()
              .padStart(2, "0")}:00`
          );
          const logoutTime = new Date(
            `${dateStr}T${logoutHour.toString().padStart(2, "0")}:${logoutMinute
              .toString()
              .padStart(2, "0")}:00`
          );

          const log = new Log({
            userId: employee._id,
            date: dateStr,
            loginTime: loginTime,
            logoutTime: logoutTime,
            loginMessageSent: true,
            logoutMessageSent: true,
          });

          await log.save();
          console.log(
            `${dateStr}: ${
              employee.name
            } - Login: ${loginTime.toLocaleTimeString()}, Logout: ${logoutTime.toLocaleTimeString()}`
          );
        } else {
          console.log(`${dateStr}: ${employee.name} - Absent`);
        }
      }
    }

    console.log("\nTest data creation completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating test data:", error);
    process.exit(1);
  }
};

createTestData();
