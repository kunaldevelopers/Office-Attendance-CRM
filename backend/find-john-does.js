const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");

const findAllJohnDoes = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Find all John Doe accounts (by name or email)
    const johnDoesByEmail = await User.find({ email: "john.doe@company.com" });
    const johnDoesByName = await User.find({ name: "John Doe" });

    console.log("John Doe accounts by email (john.doe@company.com):");
    johnDoesByEmail.forEach((user) => {
      console.log(
        `- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Created: ${user.createdAt}`
      );
    });

    console.log("\nJohn Doe accounts by name:");
    johnDoesByName.forEach((user) => {
      console.log(
        `- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Created: ${user.createdAt}`
      );
    });

    // Find the one we want to keep (has john.doe@company.com email and is newest)
    const correctJohnDoe = johnDoesByEmail.reduce((latest, current) => {
      return current.createdAt > latest.createdAt ? current : latest;
    });

    console.log(`\nCorrect John Doe to keep: ${correctJohnDoe._id}`);

    // Find attendance records for the correct one
    const correctAttendance = await Log.find({ userId: correctJohnDoe._id });
    console.log(
      `Correct John Doe has ${correctAttendance.length} attendance records`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

findAllJohnDoes();
