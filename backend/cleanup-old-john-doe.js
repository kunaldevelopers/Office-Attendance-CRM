const mongoose = require("mongoose");
const User = require("./src/models/User");
const Log = require("./src/models/Log");

const cleanupOldJohnDoe = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login-logout-app");
    console.log("Connected to MongoDB");

    // Find all John Doe accounts with john.doe@company.com email
    const johnDoes = await User.find({ email: "john.doe@company.com" });
    console.log("Found John Doe accounts with john.doe@company.com:");
    johnDoes.forEach((user) => {
      console.log(`- ID: ${user._id}, Created: ${user.createdAt}`);
    });

    // Remove the old one (68385f5c7468e280f412b8d5)
    const oldUserId = "68385f5c7468e280f412b8d5";
    const oldUser = await User.findById(oldUserId);

    if (oldUser) {
      console.log(`\nRemoving old John Doe account: ${oldUserId}`);

      // First remove all logs associated with this user
      const logsRemoved = await Log.deleteMany({ userId: oldUserId });
      console.log(`Removed ${logsRemoved.deletedCount} log records`);

      // Then remove the user
      await User.findByIdAndDelete(oldUserId);
      console.log("Old user account removed");
    } else {
      console.log("Old user not found");
    }

    // Verify the correct one remains
    const remainingJohnDoes = await User.find({
      email: "john.doe@company.com",
    });
    console.log("\nRemaining John Doe accounts:");
    remainingJohnDoes.forEach((user) => {
      console.log(`- ID: ${user._id}, Created: ${user.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

cleanupOldJohnDoe();
