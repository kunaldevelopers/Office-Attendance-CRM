const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");

const checkDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Find all users
    const users = await User.find({});
    console.log("All users:");
    users.forEach((user) => {
      console.log(
        `- ${user.name} (${user.email}) - ID: ${user._id}, Role: ${user.role}`
      );
    });

    // Find all attendance logs
    const logs = await Log.find({}).sort({ date: -1 });
    console.log("\nAll attendance logs:");
    logs.forEach((log) => {
      console.log(
        `- ${log.date}: User ${log.userId}, Login: ${
          log.loginTime ? new Date(log.loginTime).toLocaleString() : "N/A"
        }, Logout: ${
          log.logoutTime ? new Date(log.logoutTime).toLocaleString() : "N/A"
        }`
      );
    });

    // Find specific July logs
    const julyLogs = await Log.find({
      date: { $gte: "2025-07-01", $lte: "2025-07-31" },
    });
    console.log("\nJuly 2025 logs:");
    julyLogs.forEach((log) => {
      console.log(
        `- ${log.date}: User ${log.userId}, Login: ${
          log.loginTime ? new Date(log.loginTime).toLocaleString() : "N/A"
        }, Logout: ${
          log.logoutTime ? new Date(log.logoutTime).toLocaleString() : "N/A"
        }`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkDatabase();
