const Log = require("../models/Log");

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
};

exports.sendLoginMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const today = getTodayDate();
    const whatsappService = req.app.locals.whatsappService;

    // Check if user has already logged in today
    let log = await Log.findOne({ userId, date: today });

    if (log && log.loginTime) {
      return res.status(409).json({
        error: {
          message: "You have already logged in today",
          status: 409,
        },
      });
    }

    let whatsappSent = false;
    let whatsappError = null;

    // Try to send WhatsApp message if service is available
    if (whatsappService && whatsappService.isReady()) {
      const groupId = process.env.WHATSAPP_GROUP_ID;
      if (groupId) {
        try {
          await whatsappService.sendLoginMessage(groupId, userName);
          whatsappSent = true;
          console.log("✅ WhatsApp login message sent successfully");
        } catch (error) {
          console.error("❌ Failed to send WhatsApp message:", error.message);
          whatsappError = error.message;
        }
      }
    } else {
      console.log(
        "ℹ️ WhatsApp service not available, proceeding without message"
      );
    }

    // Update or create log entry (regardless of WhatsApp status)
    if (log) {
      log.loginTime = new Date();
      log.loginMessageSent = whatsappSent;
    } else {
      log = new Log({
        userId,
        date: today,
        loginTime: new Date(),
        loginMessageSent: whatsappSent,
      });
    }

    await log.save();

    const responseMessage = whatsappSent
      ? "Login recorded and WhatsApp message sent successfully"
      : whatsappError
      ? `Login recorded successfully (WhatsApp failed: ${whatsappError})`
      : "Login recorded successfully (WhatsApp service unavailable)";

    res.json({
      message: responseMessage,
      data: {
        timestamp: new Date(),
        action: "login",
        whatsappSent,
        whatsappError,
      },
    });
  } catch (error) {
    console.error("Send login message error:", error);
    res.status(500).json({
      error: {
        message: "Failed to record login",
        status: 500,
      },
    });
  }
};

exports.sendLogoutMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const today = getTodayDate();
    const whatsappService = req.app.locals.whatsappService;

    // Check if user has already logged out today
    let log = await Log.findOne({ userId, date: today });

    if (log && log.logoutTime) {
      return res.status(409).json({
        error: {
          message: "You have already logged out today",
          status: 409,
        },
      });
    }

    let whatsappSent = false;
    let whatsappError = null;

    // Try to send WhatsApp message if service is available
    if (whatsappService && whatsappService.isReady()) {
      const groupId = process.env.WHATSAPP_GROUP_ID;
      if (groupId) {
        try {
          await whatsappService.sendLogoutMessage(groupId, userName);
          whatsappSent = true;
          console.log("✅ WhatsApp logout message sent successfully");
        } catch (error) {
          console.error("❌ Failed to send WhatsApp message:", error.message);
          whatsappError = error.message;
        }
      }
    } else {
      console.log(
        "ℹ️ WhatsApp service not available, proceeding without message"
      );
    }

    // Update or create log entry (regardless of WhatsApp status)
    if (log) {
      log.logoutTime = new Date();
      log.logoutMessageSent = whatsappSent;
    } else {
      log = new Log({
        userId,
        date: today,
        logoutTime: new Date(),
        logoutMessageSent: whatsappSent,
      });
    }

    await log.save();

    const responseMessage = whatsappSent
      ? "Logout recorded and WhatsApp message sent successfully"
      : whatsappError
      ? `Logout recorded successfully (WhatsApp failed: ${whatsappError})`
      : "Logout recorded successfully (WhatsApp service unavailable)";

    res.json({
      message: responseMessage,
      data: {
        timestamp: new Date(),
        action: "logout",
        whatsappSent,
        whatsappError,
      },
    });
  } catch (error) {
    console.error("Send logout message error:", error);
    res.status(500).json({
      error: {
        message: "Failed to record logout",
        status: 500,
      },
    });
  }
};

exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getTodayDate();

    const log = await Log.findOne({ userId, date: today });

    res.json({
      message: "Today status retrieved successfully",
      data: {
        date: today,
        loginSent: log ? !!log.loginTime : false,
        logoutSent: log ? !!log.logoutTime : false,
        loginTime: log ? log.loginTime : null,
        logoutTime: log ? log.logoutTime : null,
        whatsappLoginSent: log ? log.loginMessageSent : false,
        whatsappLogoutSent: log ? log.logoutMessageSent : false,
      },
    });
  } catch (error) {
    console.error("Get today status error:", error);
    res.status(500).json({
      error: {
        message: "Failed to get today status",
        status: 500,
      },
    });
  }
};
