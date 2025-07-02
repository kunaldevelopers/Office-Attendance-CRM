const mongoose = require("mongoose");
const User = require("./src/models/User");

const freshDbCheck = async () => {
  try {
    // Create a fresh connection
    const connection = await mongoose.createConnection(
      "mongodb://localhost:27017/login-logout-app"
    );
    const UserModel = connection.model("User", User.schema);

    console.log("Fresh MongoDB connection established");

    // Find all users with john.doe@company.com
    const users = await UserModel.find({ email: "john.doe@company.com" });
    console.log(`Found ${users.length} users with john.doe@company.com:`);

    users.forEach((user) => {
      console.log(
        `- ID: ${user._id}, Name: ${user.name}, Created: ${user.createdAt}`
      );
    });

    // Find all users with the problematic ID
    const problemUser = await UserModel.findById("68385f5c7468e280f412b8d5");
    if (problemUser) {
      console.log(`\nFound problematic user: ${problemUser._id}`);
      console.log(`Name: ${problemUser.name}, Email: ${problemUser.email}`);
    } else {
      console.log("\nProblematic user not found");
    }

    // Find all users named John Doe
    const allJohnDoes = await UserModel.find({ name: "John Doe" });
    console.log(`\nAll John Doe users (${allJohnDoes.length}):`);
    allJohnDoes.forEach((user) => {
      console.log(
        `- ID: ${user._id}, Email: ${user.email}, Created: ${user.createdAt}`
      );
    });

    await connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

freshDbCheck();
