const { Client, LocalAuth } = require("whatsapp-web.js");

console.log("🔍 WhatsApp-Web.js Library Test");
console.log("================================");

// Test 1: Check library version
try {
  const pkg = require("whatsapp-web.js/package.json");
  console.log(`✅ Library Version: ${pkg.version}`);
} catch (e) {
  console.log("⚠️ Could not read library version");
}

// Test 2: Try creating a basic client
try {
  const testClient = new Client({
    authStrategy: new LocalAuth({
      clientId: "test-client",
    }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  console.log("✅ Client creation successful");

  // Clean up
  setTimeout(() => {
    testClient
      .destroy()
      .then(() => {
        console.log("✅ Test client destroyed");
        process.exit(0);
      })
      .catch(() => {
        console.log("⚠️ Error destroying test client");
        process.exit(0);
      });
  }, 2000);
} catch (error) {
  console.log("❌ Client creation failed:", error.message);
  process.exit(1);
}
