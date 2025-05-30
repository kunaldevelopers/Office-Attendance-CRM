const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isClientReady = false;
    this.isInitializing = false;
    this.qrTimeout = null;
    this.initializationTimeout = null;
    this.initialize();
  }

  initialize() {
    if (this.isInitializing) {
      console.log("⚠️ WhatsApp client is already initializing...");
      return;
    }

    this.isInitializing = true;
    console.log("🔄 Initializing WhatsApp client...");

    try {
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
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
          ],
        },
      });

      // Set initialization timeout (5 minutes)
      this.initializationTimeout = setTimeout(() => {
        console.log(
          "⏰ WhatsApp initialization timeout - attempting restart..."
        );
        this.restart();
      }, 5 * 60 * 1000);

      this.client.on("loading_screen", (percent, message) => {
        console.log(`🔄 WhatsApp loading: ${percent}% - ${message}`);
      });

      this.client.on("qr", (qr) => {
        console.log("\n📱 WhatsApp QR Code Generated!");
        console.log("📱 Scan the QR code below with your WhatsApp mobile app:");
        console.log("📱 WhatsApp > Linked Devices > Link a Device");
        qrcode.generate(qr, { small: true });
        console.log("📱 QR code will expire in 60 seconds...\n");

        // Set QR timeout
        if (this.qrTimeout) clearTimeout(this.qrTimeout);
        this.qrTimeout = setTimeout(() => {
          console.log("⏰ QR code expired, generating new one...");
        }, 60000);
      });

      this.client.on("ready", () => {
        console.log("✅ WhatsApp client is ready and connected!");
        this.isClientReady = true;
        this.isInitializing = false;
        this.clearTimeouts();

        // Get client info
        this.client.info
          .then((info) => {
            console.log(`📱 Connected as: ${info.pushname} (${info.wid.user})`);
          })
          .catch((err) => {
            console.log(
              "📱 WhatsApp client ready but couldn't fetch user info"
            );
          });
      });

      this.client.on("authenticated", () => {
        console.log("✅ WhatsApp client authenticated successfully!");
        if (this.qrTimeout) clearTimeout(this.qrTimeout);
      });

      this.client.on("auth_failure", (msg) => {
        console.error("❌ WhatsApp authentication failed:", msg);
        this.isClientReady = false;
        this.isInitializing = false;
        this.clearTimeouts();

        // Attempt restart after failure
        setTimeout(() => {
          console.log("🔄 Attempting to restart WhatsApp service...");
          this.restart();
        }, 10000);
      });

      this.client.on("disconnected", (reason) => {
        console.log("❌ WhatsApp client disconnected:", reason);
        this.isClientReady = false;
        this.isInitializing = false;
        this.clearTimeouts();

        // Attempt reconnection
        setTimeout(() => {
          console.log("🔄 Attempting to reconnect WhatsApp...");
          this.restart();
        }, 5000);
      });

      // Error handling
      this.client.on("error", (error) => {
        console.error("❌ WhatsApp client error:", error);
        this.isClientReady = false;
        this.isInitializing = false;
      });

      console.log("🚀 Starting WhatsApp client initialization...");
      this.client.initialize().catch((error) => {
        console.error("❌ Failed to initialize WhatsApp client:", error);
        this.isInitializing = false;
        this.clearTimeouts();
      });
    } catch (error) {
      console.error("❌ Error creating WhatsApp client:", error);
      this.isInitializing = false;
      this.clearTimeouts();
    }
  }

  clearTimeouts() {
    if (this.qrTimeout) {
      clearTimeout(this.qrTimeout);
      this.qrTimeout = null;
    }
    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
      this.initializationTimeout = null;
    }
  }

  async restart() {
    console.log("🔄 Restarting WhatsApp service...");
    this.clearTimeouts();

    if (this.client) {
      try {
        await this.client.destroy();
      } catch (error) {
        console.log("⚠️ Error destroying client:", error.message);
      }
    }

    this.client = null;
    this.isClientReady = false;
    this.isInitializing = false;

    // Wait a bit before reinitializing
    setTimeout(() => {
      this.initialize();
    }, 2000);
  }
  isReady() {
    return this.isClientReady;
  }

  getStatus() {
    return {
      ready: this.isClientReady,
      initializing: this.isInitializing,
      hasClient: !!this.client,
    };
  }

  async sendMessage(target, message) {
    if (!this.isClientReady) {
      throw new Error(
        "WhatsApp client is not ready. Please wait for initialization to complete."
      );
    }

    if (!this.client) {
      throw new Error("WhatsApp client is not initialized");
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

      console.log(`📤 Sending WhatsApp message to: ${target}`);
      await this.client.sendMessage(chatId, message);
      console.log("✅ WhatsApp message sent successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to send WhatsApp message:", error);

      // If client is not ready anymore, mark it as such
      if (
        error.message.includes("Protocol error") ||
        error.message.includes("Session closed")
      ) {
        this.isClientReady = false;
        console.log("🔄 WhatsApp session lost, attempting restart...");
        this.restart();
      }

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

    return `👤 ${userName}\n✅ Logged in at: ${time}\n📅 Date: ${date}`;
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

    return `👤 ${userName}\n🚫 Logged out at: ${time}\n📅 Date: ${date}`;
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
