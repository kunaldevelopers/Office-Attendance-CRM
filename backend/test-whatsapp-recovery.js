const WhatsAppService = require("./src/services/whatsappService");

async function testWhatsAppRecovery() {
  console.log("🧪 Testing WhatsApp service recovery mechanisms...");

  const service = new WhatsAppService();

  try {
    // Test 1: Basic initialization
    console.log("\n1️⃣ Testing basic initialization...");
    service.initialize();

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Status after init:", service.getStatus());

    // Test 2: Health check when not ready
    console.log("\n2️⃣ Testing health check when not ready...");
    const healthWhenNotReady = await service.checkSessionHealth();
    console.log("Health check result (should be false):", healthWhenNotReady);

    // Test 3: Soft recovery when not ready
    console.log("\n3️⃣ Testing soft recovery...");
    const softRecoveryResult = await service.softRecover();
    console.log("Soft recovery result:", softRecoveryResult);

    // Test 4: Force restart
    console.log("\n4️⃣ Testing force restart...");
    const forceRestartResult = await service.forceRestart();
    console.log("Force restart result:", forceRestartResult);

    console.log("\n✅ All recovery mechanism tests completed");
  } catch (error) {
    console.error("❌ Test error:", error.message);
  } finally {
    // Cleanup
    console.log("\n🧹 Cleaning up...");
    await service.stopService();
  }
}

// Run the test
testWhatsAppRecovery()
  .then(() => {
    console.log("🏁 Test script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test script error:", error);
    process.exit(1);
  });
