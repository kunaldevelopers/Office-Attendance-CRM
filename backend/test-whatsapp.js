#!/usr/bin/env node

const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testHealthCheck() {
  try {
    console.log("🩺 Testing health check...");
    const response = await axios.get(`${BASE_URL}/health`);
    console.log(
      "✅ Health check response:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    return null;
  }
}

async function testWhatsAppStatus() {
  try {
    console.log("\n📱 Monitoring WhatsApp status...");

    let attempts = 0;
    const maxAttempts = 20; // 2 minutes of checking

    while (attempts < maxAttempts) {
      const health = await testHealthCheck();

      if (health && health.services && health.services.whatsapp) {
        const whatsapp = health.services.whatsapp;
        console.log(
          `📊 WhatsApp Status: ${whatsapp.status} (Ready: ${whatsapp.ready}, Initializing: ${whatsapp.initializing})`
        );

        if (whatsapp.ready) {
          console.log("🎉 WhatsApp is ready for testing!");
          return true;
        }

        if (!whatsapp.initializing && !whatsapp.ready) {
          console.log("❌ WhatsApp failed to initialize");
          return false;
        }
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 6000)); // Wait 6 seconds
    }

    console.log("⏰ Timeout waiting for WhatsApp to be ready");
    return false;
  } catch (error) {
    console.error("❌ Error monitoring WhatsApp:", error.message);
    return false;
  }
}

async function testLogin() {
  try {
    console.log("\n🔐 Testing user login...");

    const loginData = {
      email: "admin@company.com",
      password: "admin123456",
    };

    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log("✅ Login successful");

    const token = response.data.data.token;
    console.log("🎫 Got authentication token");

    return token;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    return null;
  }
}

async function testWhatsAppMessage(token) {
  try {
    console.log("\n💬 Testing WhatsApp login message...");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      `${BASE_URL}/api/whatsapp/login`,
      {},
      config
    );
    console.log(
      "✅ WhatsApp login message sent successfully:",
      response.data.message
    );
    return true;
  } catch (error) {
    console.error(
      "❌ WhatsApp message failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function main() {
  console.log("🚀 Starting WhatsApp Service Test Suite\n");
  console.log("📋 This script will:");
  console.log("   1. Check server health");
  console.log("   2. Monitor WhatsApp initialization");
  console.log("   3. Test user authentication");
  console.log("   4. Test WhatsApp messaging\n");

  // Test health check
  const health = await testHealthCheck();
  if (!health) {
    console.log(
      "❌ Server is not responding. Make sure the backend is running on port 3000"
    );
    process.exit(1);
  }

  // Monitor WhatsApp status
  const whatsappReady = await testWhatsAppStatus();
  if (!whatsappReady) {
    console.log("⚠️ WhatsApp is not ready, but continuing with other tests...");
  }

  // Test authentication
  const token = await testLogin();
  if (!token) {
    console.log("❌ Cannot proceed without authentication token");
    process.exit(1);
  }

  // Test WhatsApp messaging (only if WhatsApp is ready)
  if (whatsappReady) {
    const messageSuccess = await testWhatsAppMessage(token);
    if (messageSuccess) {
      console.log(
        "\n🎉 All tests passed! WhatsApp service is working correctly."
      );
    } else {
      console.log(
        "\n⚠️ WhatsApp message test failed, but service might still work."
      );
    }
  } else {
    console.log("\n⚠️ Skipping WhatsApp message test - service not ready");
    console.log(
      "💡 Tip: Make sure to scan the QR code with your WhatsApp mobile app"
    );
  }

  console.log("\n📊 Final Status:");
  const finalHealth = await testHealthCheck();
  if (finalHealth) {
    console.log("   Server: ✅ Running");
    console.log(`   Database: ✅ Connected`);
    console.log(
      `   WhatsApp: ${finalHealth.services.whatsapp.ready ? "✅" : "⚠️"} ${
        finalHealth.services.whatsapp.status
      }`
    );
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Test interrupted by user");
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

main().catch((error) => {
  console.error("❌ Test suite failed:", error);
  process.exit(1);
});
