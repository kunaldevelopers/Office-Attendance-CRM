const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isClientReady = false;
    this.isInitializing = false;
    this.qrTimeout = null;
    this.initializationTimeout = null;
    this.qrCode = null;
    this.isManuallyDisconnected = false;
    this.messageQueue = [];
    this.lastError = null;
    this.restartAttempts = 0;
    this.maxRestartAttempts = 3;
    this.lastSuccessfulMessage = null;
    // Don't auto-initialize - wait for admin to start it
  }

  initialize() {
    if (this.isInitializing) {
      console.log("⚠️ WhatsApp client is already initializing...");
      return;
    }

    this.isInitializing = true;
    this.lastError = null;
    console.log("🔄 Initializing WhatsApp client...");

    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: "login-logout-bot",
          dataPath: "./.wwebjs_auth",
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
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-background-networking",
            "--force-color-profile=srgb",
            "--disable-ipc-flooding-protection",
            "--disable-extensions",
            "--disable-default-apps",
            "--disable-sync",
            "--metrics-recording-only",
            "--no-default-browser-check",
            "--mute-audio",
            "--hide-scrollbars",
            "--disable-plugins",
            "--disable-images",
            "--disable-javascript",
            "--disable-java",
            "--disable-popup-blocking",
            "--aggressive-cache-discard",
            "--memory-pressure-off",
            "--max-old-space-size=4096",
          ],
          executablePath: undefined,
          timeout: 60000, // Increase timeout for browser operations
        },
        session: undefined, // Use default session management
        takeoverOnConflict: true, // Take over if another session exists
        takeoverTimeoutMs: 60000, // Wait 60 seconds for takeover
      });

      // Set initialization timeout (3 minutes)
      this.initializationTimeout = setTimeout(() => {
        console.log(
          "⏰ WhatsApp initialization timeout - attempting restart..."
        );
        this.handleInitializationTimeout();
      }, 3 * 60 * 1000);

      this.client.on("loading_screen", (percent, message) => {
        console.log(`🔄 WhatsApp loading: ${percent}% - ${message}`);
      });

      this.client.on("qr", (qr) => {
        console.log("\n📱 WhatsApp QR Code Generated!");
        console.log("📱 QR code available in admin panel for scanning");

        // Store QR code for admin panel access
        this.qrCode = qr;

        // Set QR timeout
        if (this.qrTimeout) clearTimeout(this.qrTimeout);
        this.qrTimeout = setTimeout(() => {
          console.log("⏰ QR code expired, generating new one...");
          this.qrCode = null;
        }, 60000);
      });

      this.client.on("ready", async () => {
        console.log("✅ WhatsApp client is ready and connected!");
        this.isClientReady = true;
        this.isInitializing = false;
        this.qrCode = null;
        this.restartAttempts = 0; // Reset restart attempts on successful connection
        this.clearTimeouts();

        try {
          // Get client info with timeout
          const info = await Promise.race([
            this.client.info,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Info fetch timeout")), 10000)
            ),
          ]);

          console.log(`📱 Connected as: ${info.pushname} (${info.wid.user})`);
          this.connectedInfo = {
            name: info.pushname,
            number: info.wid.user,
          };
        } catch (err) {
          console.log(
            "📱 WhatsApp client ready but couldn't fetch user info:",
            err.message
          );
          this.connectedInfo = {
            name: "Unknown User",
            number: "Unknown",
          };
        }
      });

      this.client.on("authenticated", () => {
        console.log("✅ WhatsApp client authenticated successfully!");
        this.qrCode = null;
        if (this.qrTimeout) clearTimeout(this.qrTimeout);
      });

      this.client.on("auth_failure", (msg) => {
        console.error("❌ WhatsApp authentication failed:", msg);
        this.isClientReady = false;
        this.isInitializing = false;
        this.lastError = `Authentication failed: ${msg}`;
        this.clearTimeouts();

        // Attempt restart after failure with exponential backoff
        this.scheduleRestart(15000); // 15 seconds delay
      });

      this.client.on("disconnected", (reason) => {
        console.log("❌ WhatsApp client disconnected:", reason);
        this.isClientReady = false;
        this.isInitializing = false;
        this.qrCode = null;
        this.connectedInfo = null;
        this.lastError = `Disconnected: ${reason}`;
        this.clearTimeouts();

        // Check if disconnection was due to external logout
        if (reason === "LOGOUT" || reason === "NAVIGATION") {
          console.log(
            "📱 WhatsApp session ended externally (logged out from phone)"
          );
          this.isManuallyDisconnected = true;
        } else if (reason === "CONFLICT" || reason === "UNLAUNCHED") {
          console.log("📱 WhatsApp session conflict detected");
          this.isManuallyDisconnected = true;
        }

        // Only attempt reconnection if not manually disconnected and within retry limits
        if (
          !this.isManuallyDisconnected &&
          this.restartAttempts < this.maxRestartAttempts
        ) {
          this.scheduleRestart(10000); // 10 seconds delay
        } else if (this.restartAttempts >= this.maxRestartAttempts) {
          console.log(
            "❌ Max restart attempts reached. Manual intervention required."
          );
          this.isManuallyDisconnected = true;
        }
      });

      // Enhanced error handling to prevent server crashes
      this.client.on("error", (error) => {
        console.error("❌ WhatsApp client error:", error);
        this.isClientReady = false;
        this.lastError = error.message;

        // Handle specific error types that cause the serialize issue
        try {
          if (
            error.message &&
            (error.message.includes("Session timed out") ||
              error.message.includes("Protocol error") ||
              error.message.includes("Evaluation failed") ||
              error.message.includes("serialize") ||
              error.message.includes("Target closed") ||
              error.message.includes("Session closed"))
          ) {
            console.log("🔄 Critical error detected - attempting recovery");

            // Force cleanup but allow for recovery attempts
            this.forceCleanup();

            // Only mark as manually disconnected if we've exceeded retry attempts
            if (this.restartAttempts >= this.maxRestartAttempts) {
              console.log(
                "❌ Max restart attempts reached after critical error"
              );
              this.isManuallyDisconnected = true;
            } else {
              // Schedule restart with delay
              this.scheduleRestart(10000);
            }
          }

          // Reset state safely
          this.qrCode = null;
          this.connectedInfo = null;
          this.clearTimeouts();
        } catch (handleError) {
          console.error(
            "❌ Error in error handler (non-critical):",
            handleError
          );
        }
      });

      // Add message handling to detect when WhatsApp is working
      this.client.on("message", (message) => {
        // This helps confirm the client is still responsive
        if (message.from && message.body) {
          // Client is receiving messages, so it's working
          this.lastError = null;
        }
      });

      console.log("🚀 Starting WhatsApp client initialization...");
      this.client.initialize().catch((error) => {
        console.error("❌ Failed to initialize WhatsApp client:", error);
        this.isInitializing = false;
        this.lastError = error.message;
        this.clearTimeouts();
        this.scheduleRestart(20000); // 20 seconds delay on init failure
      });
    } catch (error) {
      console.error("❌ Error creating WhatsApp client:", error);
      this.isInitializing = false;
      this.lastError = error.message;
      this.clearTimeouts();
    }
  }

  // New method to handle initialization timeout
  handleInitializationTimeout() {
    console.log("⏰ Initialization timeout reached");
    this.isInitializing = false;
    this.lastError = "Initialization timeout";
    this.scheduleRestart(30000); // 30 seconds delay
  }

  // New method to schedule restart with exponential backoff
  scheduleRestart(delay = 5000) {
    if (this.isManuallyDisconnected) {
      console.log("⚠️ Manual disconnection detected, skipping auto-restart");
      return;
    }

    if (this.restartAttempts >= this.maxRestartAttempts) {
      console.log(
        "❌ Max restart attempts reached, marking as manually disconnected"
      );
      this.isManuallyDisconnected = true;
      return;
    }

    this.restartAttempts++;
    const backoffDelay = delay * Math.pow(2, this.restartAttempts - 1); // Exponential backoff

    console.log(
      `🔄 Scheduling restart attempt ${this.restartAttempts}/${
        this.maxRestartAttempts
      } in ${backoffDelay / 1000} seconds`
    );

    setTimeout(() => {
      if (!this.isManuallyDisconnected) {
        console.log(`🔄 Executing restart attempt ${this.restartAttempts}`);
        this.restart();
      }
    }, backoffDelay);
  }

  // New method to force cleanup browser resources
  async forceCleanup() {
    console.log("🧹 Force cleaning up browser resources...");

    try {
      if (this.client && this.client.pupBrowser) {
        const browser = this.client.pupBrowser;
        const pages = await browser.pages();

        // Close all pages
        for (const page of pages) {
          try {
            await page.close();
          } catch (e) {
            console.log("⚠️ Error closing page:", e.message);
          }
        }

        // Close browser
        try {
          await browser.close();
        } catch (e) {
          console.log("⚠️ Error closing browser:", e.message);
        }
      }
    } catch (error) {
      console.log("⚠️ Error during force cleanup:", error.message);
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

    // Force cleanup first
    await this.forceCleanup();

    if (this.client) {
      try {
        await this.client.destroy();
      } catch (error) {
        console.log("⚠️ Error destroying client:", error.message);
      }
    }

    // Reset all state
    this.client = null;
    this.isClientReady = false;
    this.isInitializing = false;
    this.qrCode = null;
    this.connectedInfo = null;
    this.lastError = null;

    // Wait a bit before reinitializing to allow cleanup
    setTimeout(() => {
      if (!this.isManuallyDisconnected) {
        this.initialize();
      }
    }, 3000); // Increased delay for better cleanup
  }
  isReady() {
    return this.isClientReady;
  }

  getStatus() {
    return {
      ready: this.isClientReady,
      initializing: this.isInitializing,
      hasClient: !!this.client,
      qrCode: this.qrCode,
      connectedInfo: this.connectedInfo || null,
      isManuallyDisconnected: this.isManuallyDisconnected,
      lastError: this.lastError,
      restartAttempts: this.restartAttempts,
      maxRestartAttempts: this.maxRestartAttempts,
      lastSuccessfulMessage: this.lastSuccessfulMessage,
    };
  }

  // Method to start WhatsApp service manually
  async startService() {
    if (this.isInitializing || this.isClientReady) {
      throw new Error("WhatsApp service is already running or initializing");
    }

    this.isManuallyDisconnected = false;
    this.initialize();
    return { message: "WhatsApp service started successfully" };
  }

  // Method to force reset and start (for stuck states)
  async forceRestart() {
    console.log("🔄 Force restarting WhatsApp service...");

    // Clear all states
    this.isManuallyDisconnected = true;
    this.clearTimeouts();

    // Force cleanup browser resources first
    await this.forceCleanup();

    // Destroy existing client
    if (this.client) {
      try {
        await this.client.destroy();
      } catch (error) {
        console.log(
          "⚠️ Error destroying client during force restart:",
          error.message
        );
      }
    }

    // Reset all properties
    this.client = null;
    this.isClientReady = false;
    this.isInitializing = false;
    this.qrCode = null;
    this.connectedInfo = null;
    this.lastError = null;
    this.restartAttempts = 0; // Reset restart attempts
    this.isManuallyDisconnected = false;

    // Wait longer for force restart to ensure cleanup
    setTimeout(() => {
      this.initialize();
    }, 5000);

    return { message: "WhatsApp service force restart initiated" };
  }

  // Soft recovery method - tries to recover without full restart
  async softRecover() {
    console.log("🔄 Attempting soft recovery of WhatsApp session...");

    if (!this.client) {
      console.log("❌ No client to recover, performing full restart");
      return this.forceRestart();
    }

    try {
      // Try to check if client is still alive
      const state = await this.client.getState();
      console.log("📱 Current WhatsApp state:", state);

      if (state === "CONNECTED") {
        this.isClientReady = true;
        console.log("✅ Soft recovery successful - client is connected");
        return { message: "WhatsApp session recovered successfully" };
      } else if (state === "OPENING") {
        console.log("⏳ WhatsApp is opening, waiting...");
        this.isClientReady = false;
        this.isInitializing = true;
        return { message: "WhatsApp session is reconnecting" };
      } else {
        console.log(
          "⚠️ WhatsApp state indicates disconnection, performing restart"
        );
        return this.forceRestart();
      }
    } catch (error) {
      console.log("❌ Soft recovery failed:", error.message);
      return this.forceRestart();
    }
  }

  // Method to stop WhatsApp service manually
  async stopService() {
    this.isManuallyDisconnected = true;
    this.clearTimeouts();

    if (this.client) {
      try {
        await this.client.destroy();
        console.log("🛑 WhatsApp service stopped manually");
      } catch (error) {
        console.log("⚠️ Error stopping WhatsApp service:", error.message);
      }
    }

    this.client = null;
    this.isClientReady = false;
    this.isInitializing = false;
    this.qrCode = null;
    this.connectedInfo = null;

    return { message: "WhatsApp service stopped successfully" };
  }

  // Method to get QR code for admin panel
  getQRCode() {
    return this.qrCode;
  }

  // Method to check session health
  async checkSessionHealth() {
    if (!this.client || !this.isClientReady) {
      return false;
    }

    try {
      // Quick health checks with short timeouts
      const healthChecks = [this.client.getState(), this.client.info];

      // Run health checks with timeout
      await Promise.race([
        Promise.all(healthChecks),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Health check timeout")), 8000)
        ),
      ]);

      return true;
    } catch (error) {
      console.log("⚠️ Session health check failed:", error.message);
      return false;
    }
  }

  // Add method to validate and prepare chat ID
  validateAndPrepareChatId(target) {
    if (!target || typeof target !== "string") {
      throw new Error("Invalid target specified");
    }

    let chatId;
    // Check if it's a phone number (starts with +)
    if (target.startsWith("+")) {
      // Remove + and add @c.us for individual contact
      const phoneNumber = target.replace(/[^\d]/g, ""); // Remove all non-digits
      if (phoneNumber.length < 10) {
        throw new Error("Phone number too short");
      }
      chatId = phoneNumber + "@c.us";
    } else if (target.includes("@c.us") || target.includes("@g.us")) {
      chatId = target;
    } else {
      // Assume it's a group ID or plain number
      if (/^\d+$/.test(target)) {
        // All digits, treat as phone number
        chatId = target + "@c.us";
      } else {
        // Treat as group ID
        chatId = `${target}@g.us`;
      }
    }

    return chatId;
  }

  async sendMessage(target, message) {
    // Multiple safety checks
    if (!this.isClientReady) {
      throw new Error(
        "WhatsApp client is not ready. Please wait for initialization to complete."
      );
    }

    if (!this.client) {
      throw new Error("WhatsApp client is not initialized");
    }

    // Perform session health check before attempting to send
    const isHealthy = await this.checkSessionHealth();
    if (!isHealthy) {
      console.log("⚠️ Session health check failed, marking as not ready");
      this.isClientReady = false;
      throw new Error(
        "WhatsApp session is not healthy. Please restart the service."
      );
    }

    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        let chatId;
        // Validate and prepare the chat ID
        chatId = this.validateAndPrepareChatId(target);

        console.log(
          `📤 Sending WhatsApp message to: ${target} (attempt ${
            retryCount + 1
          })`
        );

        // Use alternative message sending method to avoid serialize issues
        try {
          // Method 1: Try the standard sendMessage with timeout
          const sendPromise = this.client.sendMessage(chatId, message);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Message send timeout")), 30000)
          );

          await Promise.race([sendPromise, timeoutPromise]);
          console.log("✅ WhatsApp message sent successfully");
          this.lastSuccessfulMessage = new Date();
          return true;
        } catch (standardError) {
          console.log(`⚠️ Standard method failed: ${standardError.message}`);

          // Method 2: Try using chat object directly
          try {
            const chat = await this.client.getChatById(chatId);
            await chat.sendMessage(message);
            console.log(
              "✅ WhatsApp message sent successfully (alternative method)"
            );
            this.lastSuccessfulMessage = new Date();
            return true;
          } catch (chatError) {
            console.log(`⚠️ Chat method failed: ${chatError.message}`);

            // Method 3: Try to find the chat and send
            try {
              const chats = await this.client.getChats();
              const targetChat = chats.find(
                (chat) =>
                  chat.id._serialized === chatId ||
                  chat.id.user ===
                    chatId.replace("@c.us", "").replace("@g.us", "")
              );

              if (targetChat) {
                await targetChat.sendMessage(message);
                console.log(
                  "✅ WhatsApp message sent successfully (search method)"
                );
                this.lastSuccessfulMessage = new Date();
                return true;
              } else {
                throw new Error("Target chat not found");
              }
            } catch (searchError) {
              throw standardError; // Throw the original error
            }
          }
        }
      } catch (error) {
        console.error(
          `❌ Failed to send WhatsApp message (attempt ${retryCount + 1}):`,
          error
        );
        retryCount++;

        // Enhanced error handling to prevent server crashes
        try {
          // Check for critical errors that indicate the session is dead
          if (
            error.message &&
            (error.message.includes("Protocol error") ||
              error.message.includes("Session closed") ||
              error.message.includes("Evaluation failed") ||
              error.message.includes("serialize") ||
              error.message.includes("Target closed") ||
              error.message.includes("Page crashed") ||
              error.message.includes("Connection closed") ||
              error.message.includes("Navigation failed"))
          ) {
            console.log(
              "🔄 Critical WhatsApp error detected - session lost, attempting recovery"
            );
            this.isClientReady = false;

            // Don't mark as manually disconnected - allow for automatic recovery
            // Force cleanup to prevent zombie processes
            await this.forceCleanup();

            // Schedule a restart after a short delay
            setTimeout(() => {
              if (
                !this.isManuallyDisconnected &&
                this.restartAttempts < this.maxRestartAttempts
              ) {
                console.log(
                  "🔄 Attempting automatic recovery after critical error"
                );
                this.restart();
              }
            }, 5000);

            throw new Error(
              `Critical WhatsApp error: ${error.message}. Attempting automatic recovery...`
            );
          }

          // For non-critical errors, retry if attempts remain
          if (retryCount <= maxRetries) {
            console.log(
              `🔄 Retrying message send in 3 seconds... (${retryCount}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          }
        } catch (handleError) {
          console.error(
            "❌ Error in sendMessage error handler (non-critical):",
            handleError
          );
        }

        // If we've exhausted all retries, throw the error
        if (retryCount > maxRetries) {
          throw new Error(
            `Failed to send WhatsApp message after ${maxRetries} retries: ${error.message}`
          );
        }
      }
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

  // Method to logout/disconnect current WhatsApp session
  async logout() {
    if (!this.client || !this.isClientReady) {
      throw new Error("WhatsApp client is not connected");
    }

    try {
      console.log("🔓 Logging out current WhatsApp session...");

      // Logout the current session
      await this.client.logout();

      // Reset state
      this.isClientReady = false;
      this.qrCode = null;

      console.log("✅ WhatsApp session logged out successfully");

      return {
        success: true,
        message: "WhatsApp session logged out successfully",
      };
    } catch (error) {
      console.error("❌ Error logging out WhatsApp session:", error);

      // If logout fails, force destroy the client
      try {
        await this.client.destroy();
        this.isClientReady = false;
        this.qrCode = null;
        console.log("🔄 Client destroyed after logout failure");
      } catch (destroyError) {
        console.error(
          "❌ Error destroying client after logout failure:",
          destroyError
        );
      }

      throw new Error(`Failed to logout WhatsApp session: ${error.message}`);
    }
  }
}

module.exports = WhatsAppService;
