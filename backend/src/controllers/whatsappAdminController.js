const qrcode = require("qrcode");

// Get WhatsApp service status
exports.getWhatsAppStatus = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const status = whatsappService.getStatus();

    res.json({
      success: true,
      message: "WhatsApp status retrieved successfully",
      data: status,
    });
  } catch (error) {
    console.error("Get WhatsApp status error:", error);
    res.status(500).json({
      error: {
        message: "Failed to get WhatsApp status",
        status: 500,
      },
    });
  }
};

// Start WhatsApp service
exports.startWhatsAppService = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const result = await whatsappService.startService();

    res.json({
      success: true,
      message: result.message,
      data: {
        timestamp: new Date(),
        action: "start",
      },
    });
  } catch (error) {
    console.error("Start WhatsApp service error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to start WhatsApp service",
        status: 500,
      },
    });
  }
};

// Stop WhatsApp service
exports.stopWhatsAppService = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const result = await whatsappService.stopService();

    res.json({
      success: true,
      message: result.message,
      data: {
        timestamp: new Date(),
        action: "stop",
      },
    });
  } catch (error) {
    console.error("Stop WhatsApp service error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to stop WhatsApp service",
        status: 500,
      },
    });
  }
};

// Get QR code for authentication
exports.getQRCode = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const qrCodeText = whatsappService.getQRCode();

    if (!qrCodeText) {
      return res.status(404).json({
        error: {
          message:
            "QR code not available. Please start the WhatsApp service first.",
          status: 404,
        },
      });
    }

    // Generate QR code as data URL
    const qrCodeDataURL = await qrcode.toDataURL(qrCodeText, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      message: "QR code retrieved successfully",
      data: {
        qrCode: qrCodeDataURL,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Get QR code error:", error);
    res.status(500).json({
      error: {
        message: "Failed to generate QR code",
        status: 500,
      },
    });
  }
};

// Test WhatsApp message sending
exports.testWhatsAppMessage = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const { message } = req.body;

    if (!whatsappService.isReady()) {
      return res.status(503).json({
        error: {
          message: "WhatsApp service is not ready",
          status: 503,
        },
      });
    }

    const groupId = process.env.WHATSAPP_GROUP_ID;
    if (!groupId) {
      return res.status(500).json({
        error: {
          message: "WhatsApp group ID not configured",
          status: 500,
        },
      });
    }

    const testMessage =
      message ||
      `🧪 Test message from admin panel\n📅 Time: ${new Date().toLocaleString()}`;

    await whatsappService.sendMessage(groupId, testMessage);

    res.json({
      success: true,
      message: "Test message sent successfully",
      data: {
        timestamp: new Date(),
        sentMessage: testMessage,
      },
    });
  } catch (error) {
    console.error("Test WhatsApp message error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to send test message",
        status: 500,
      },
    });
  }
};

// Restart WhatsApp service
exports.restartWhatsAppService = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;

    // Stop first, then start
    await whatsappService.stopService();

    // Wait a bit before restarting
    setTimeout(async () => {
      try {
        await whatsappService.startService();
      } catch (error) {
        console.error("Failed to restart WhatsApp service:", error);
      }
    }, 2000);

    res.json({
      success: true,
      message: "WhatsApp service restart initiated",
      data: {
        timestamp: new Date(),
        action: "restart",
      },
    });
  } catch (error) {
    console.error("Restart WhatsApp service error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to restart WhatsApp service",
        status: 500,
      },
    });
  }
};

// Force restart WhatsApp service (for stuck states)
exports.forceRestartWhatsAppService = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const result = await whatsappService.forceRestart();

    res.json({
      success: true,
      message: result.message,
      data: {
        timestamp: new Date(),
        action: "force_restart",
      },
    });
  } catch (error) {
    console.error("Force restart WhatsApp service error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to force restart WhatsApp service",
        status: 500,
      },
    });
  }
};

// Soft recovery for WhatsApp service
exports.softRecoverWhatsAppService = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const result = await whatsappService.softRecover();

    res.json({
      success: true,
      message: result.message,
      data: {
        timestamp: new Date(),
        action: "soft_recover",
      },
    });
  } catch (error) {
    console.error("Soft recover WhatsApp service error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to recover WhatsApp service",
        status: 500,
      },
    });
  }
};

// Disconnect current WhatsApp account
exports.disconnectWhatsApp = async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;

    if (!whatsappService.isReady()) {
      return res.status(400).json({
        error: {
          message: "WhatsApp service is not connected",
          status: 400,
        },
      });
    }

    // Logout the current WhatsApp session
    await whatsappService.logout();

    res.json({
      success: true,
      message:
        "WhatsApp account disconnected successfully. You can now connect a different account.",
      data: {
        timestamp: new Date(),
        action: "disconnect",
      },
    });
  } catch (error) {
    console.error("Disconnect WhatsApp error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Failed to disconnect WhatsApp account",
        status: 500,
      },
    });
  }
};
