const User = require("../models/User");

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log(
        "⚠️  Admin credentials not provided in environment variables"
      );
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: "System Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      jobRole: "Developer", // Default for admin
      gender: "Male", // Default
      age: 30, // Default
      dateOfBirth: new Date("1995-01-01"), // Default
      qualification: "PG", // Default
      employmentType: "Regular", // Default
      callingNumber: "+919142130225", // Default
      whatsappNumber: "+919142130225", // Default
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully");
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

module.exports = seedAdmin;
