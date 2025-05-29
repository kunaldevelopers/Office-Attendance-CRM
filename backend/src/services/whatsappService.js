const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isClientReady = false;
    this.initialize();
  }

  initialize() {
    console.log("🔄 Initializing WhatsApp client...");

    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "login-logout-bot",
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
        ],
      },
    });

    this.client.on("qr", (qr) => {
      console.log("📱 WhatsApp QR Code:");
      qrcode.generate(qr, { small: true });
      console.log("📱 Scan the QR code above with your WhatsApp mobile app");
    });

    this.client.on("ready", () => {
      console.log("✅ WhatsApp client is ready!");
      this.isClientReady = true;
    });

    this.client.on("authenticated", () => {
      console.log("✅ WhatsApp client authenticated!");
    });

    this.client.on("auth_failure", (msg) => {
      console.error("❌ WhatsApp authentication failed:", msg);
    });

    this.client.on("disconnected", (reason) => {
      console.log("❌ WhatsApp client disconnected:", reason);
      this.isClientReady = false;
    });

    this.client.initialize();
  }

  isReady() {
    return this.isClientReady;
  }
  async sendMessage(target, message) {
    if (!this.isClientReady) {
      throw new Error("WhatsApp client is not ready");
    }

    try {
      let chatId;
      // Check if it's a phone number (starts with +)
      if (target.startsWith("+")) {
        // Remove + and add @c.us for individual contact
        chatId = target.replace("+", "") + "@c.us";
      } else if (target.includes("@")) {
        chatId = target;
      } else {
        // Assume it's a group ID
        chatId = `${target}@g.us`;
      }

      await this.client.sendMessage(chatId, message);
      console.log("✅ Message sent to WhatsApp");
      return true;
    } catch (error) {
      console.error("❌ Failed to send WhatsApp message:", error);
      throw error;
    }
  }

  formatLoginMessage(userName) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const date = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return `✅ ${userName} login kiya\n🕒 ${time}\n📅 ${date}`;
  }

  formatLogoutMessage(userName) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const date = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return `🚫 ${userName} logout kiya\n🕒 ${time}\n📅 ${date}`;
  }
  async sendLoginMessage(target, userName) {
    const message = this.formatLoginMessage(userName);
    return await this.sendMessage(target, message);
  }

  async sendLogoutMessage(target, userName) {
    const message = this.formatLogoutMessage(userName);
    return await this.sendMessage(target, message);
  }
}

module.exports = WhatsAppService;
