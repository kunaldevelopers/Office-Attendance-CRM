const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");

const cleanupDuplicates = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Find all John Doe accounts
    const johnDoes = await User.find({ email: "john.doe@company.com" });
    console.log("Found John Doe accounts:");
    johnDoes.forEach((user) => {
      console.log(`- ID: ${user._id}, Created: ${user.createdAt}`);
    });

    if (johnDoes.length > 1) {
      // Keep the newest one, remove others
      const newest = johnDoes.reduce((latest, current) => {
        return current.createdAt > latest.createdAt ? current : latest;
      });

      console.log(`\nKeeping newest account: ${newest._id}`);

      const toDelete = johnDoes.filter(
        (user) => user._id.toString() !== newest._id.toString()
      );

      for (const user of toDelete) {
        console.log(`Deleting old account: ${user._id}`);
        // Also delete logs associated with old account
        await Log.deleteMany({ userId: user._id });
        await User.deleteById(user._id);
      }

      console.log("Cleanup completed");
    } else {
      console.log("No duplicates found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

cleanupDuplicates();
