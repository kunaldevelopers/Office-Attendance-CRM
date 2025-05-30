#!/usr/bin/env node

const axios = require("axios");
require("dotenv").config();

const BASE_URL = "http://localhost:3000";

async function testGroupMessage() {
  try {
    console.log("🧪 Testing WhatsApp Group Message");
    console.log(`📍 Group ID: ${process.env.WHATSAPP_GROUP_ID}`);

    // First, let's check if the server is running
    console.log("\n🩺 Checking server health...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);

    if (!healthResponse.data.services.whatsapp.ready) {
      console.log(
        "⏳ WhatsApp service is not ready yet. Please wait for initialization."
      );
      return;
    }

    console.log("✅ WhatsApp service is ready!");

    // Test user credentials (using admin for testing)
    console.log("\n🔐 Logging in as admin...");
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    const token = loginResponse.data.token;
    console.log("✅ Login successful!");

    // Send test login message to group
    console.log("\n📱 Sending login message to WhatsApp group...");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const messageResponse = await axios.post(
      `${BASE_URL}/api/whatsapp/login`,
      {},
      config
    );

    console.log("✅ Message sent successfully to group!");
    console.log("📝 Response:", messageResponse.data.message);

    // Wait a bit and send logout message
    console.log("\n⏳ Waiting 3 seconds before sending logout message...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("📱 Sending logout message to WhatsApp group...");
    const logoutResponse = await axios.post(
      `${BASE_URL}/api/whatsapp/logout`,
      {},
      config
    );

    console.log("✅ Logout message sent successfully to group!");
    console.log("📝 Response:", logoutResponse.data.message);
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

async function main() {
  console.log("🚀 Testing WhatsApp Group Messaging\n");
  console.log(
    "📋 This will test sending login/logout messages to the WhatsApp group"
  );
  console.log(`📍 Target Group: ${process.env.WHATSAPP_GROUP_ID}\n`);

  await testGroupMessage();
}

main().catch(console.error);
