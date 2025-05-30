const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");
require("dotenv").config();

async function createSampleAttendance() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toLocaleDateString("en-CA");
    console.log("📅 Today:", today);

    // Get some active employees
    const employees = await User.find({
      role: "employee",
      isActive: true,
    }).limit(7);
    console.log(`👥 Found ${employees.length} active employees`);

    // Create attendance for some employees
    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];

      // Check if attendance already exists for today
      const existingLog = await Log.findOne({
        userId: employee._id,
        date: today,
      });

      if (!existingLog && i < 5) {
        // Create attendance for first 5 employees only
        const loginTime = new Date();
        loginTime.setHours(
          8 + Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 60),
          0,
          0
        ); // Random login between 8-11 AM

        const logData = {
          userId: employee._id,
          date: today,
          loginTime: loginTime,
          loginMessageSent: true,
        };

        // Add logout for some employees (to show variety)
        if (i < 3) {
          const logoutTime = new Date(loginTime);
          logoutTime.setHours(
            17 + Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 60),
            0,
            0
          ); // Logout between 5-7 PM
          logData.logoutTime = logoutTime;
          logData.logoutMessageSent = true;
        }

        await Log.create(logData);
        console.log(
          `✅ Created attendance for: ${employee.name} (${employee.jobRole})`
        );
      } else if (existingLog) {
        console.log(
          `ℹ️  Attendance already exists for: ${employee.name} (${employee.jobRole})`
        );
      } else {
        console.log(
          `⏭️  Skipping: ${employee.name} (${employee.jobRole}) - will be marked absent`
        );
      }
    }

    await mongoose.disconnect();
    console.log("🎉 Sample attendance creation completed!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createSampleAttendance();
