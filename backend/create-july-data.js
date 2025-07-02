const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");
const bcrypt = require("bcryptjs");

const createJulyAttendance = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Find John Doe user
    const johnDoe = await User.findOne({ email: "john.doe@company.com" });
    if (!johnDoe) {
      console.log("John Doe not found, creating...");
      const newUser = new User({
        name: "John Doe",
        email: "john.doe@company.com",
        password: await bcrypt.hash("password123", 10),
        jobRole: "Developer",
        gender: "Male",
        age: 28,
        dateOfBirth: new Date("1997-03-15"),
        qualification: "UG",
        employmentType: "Regular",
        whatsappNumber: "+919876543210",
        callingNumber: "+919876543210",
        role: "employee",
        isActive: true,
      });
      const savedUser = await newUser.save();
      console.log("Created John Doe:", savedUser._id);
    } else {
      console.log("Found John Doe:", johnDoe._id);
    }

    // Get final user
    const user = await User.findOne({ email: "john.doe@company.com" });

    // Create attendance records for July 2025 (up to July 2)
    const dates = ["2025-07-01", "2025-07-02"];

    console.log("\nCreating July 2025 attendance records for John Doe...");

    for (const dateStr of dates) {
      // Check if record already exists
      const existing = await Log.findOne({ userId: user._id, date: dateStr });
      if (existing) {
        console.log(`${dateStr}: Record already exists`);
        continue;
      }

      // 90% chance of attendance
      const isPresent = Math.random() > 0.1;

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
          userId: user._id,
          date: dateStr,
          loginTime: loginTime,
          logoutTime: logoutTime,
          loginMessageSent: true,
          logoutMessageSent: true,
        });

        await log.save();
        console.log(
          `${dateStr}: Login: ${loginTime.toLocaleTimeString()}, Logout: ${logoutTime.toLocaleTimeString()}`
        );
      } else {
        console.log(`${dateStr}: Absent`);
      }
    }

    console.log("\nJuly attendance data creation completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating July data:", error);
    process.exit(1);
  }
};

createJulyAttendance();
