const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");

const verifyAttendanceData = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Find the current John Doe
    const johnDoe = await User.findOne({ email: "john.doe@company.com" });
    if (!johnDoe) {
      console.log("John Doe not found");
      process.exit(1);
    }

    console.log(`John Doe found: ${johnDoe._id}`);

    // Check all his attendance records
    const allRecords = await Log.find({ userId: johnDoe._id }).sort({
      date: -1,
    });
    console.log(`Total attendance records: ${allRecords.length}`);

    allRecords.forEach((record) => {
      console.log(
        `- ${record.date}: Login: ${
          record.loginTime ? new Date(record.loginTime).toLocaleString() : "N/A"
        }, Logout: ${
          record.logoutTime
            ? new Date(record.logoutTime).toLocaleString()
            : "N/A"
        }`
      );
    });

    // Check July records specifically
    const julyRecords = await Log.find({
      userId: johnDoe._id,
      date: { $gte: "2025-07-01", $lte: "2025-07-31" },
    });

    console.log(`\nJuly 2025 records: ${julyRecords.length}`);
    julyRecords.forEach((record) => {
      console.log(
        `- ${record.date}: Login: ${
          record.loginTime ? new Date(record.loginTime).toLocaleString() : "N/A"
        }, Logout: ${
          record.logoutTime
            ? new Date(record.logoutTime).toLocaleString()
            : "N/A"
        }`
      );
    });

    // Test if the employee API would work with this user ID
    const currentDate = new Date();
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

    console.log(
      `\nTesting employee API query for ${johnDoe._id} from ${startDate} to ${endDate}`
    );

    const query = {
      userId: johnDoe._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const testRecords = await Log.find(query).sort({ date: -1 });
    console.log(`API query would return ${testRecords.length} records`);

    testRecords.forEach((record) => {
      console.log(
        `- ${record.date}: Login: ${
          record.loginTime ? new Date(record.loginTime).toLocaleString() : "N/A"
        }, Logout: ${
          record.logoutTime
            ? new Date(record.logoutTime).toLocaleString()
            : "N/A"
        }`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

verifyAttendanceData();
