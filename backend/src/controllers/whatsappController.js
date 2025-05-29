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
    // Use the specific phone number instead of group ID
    const phoneNumber = "+919142130225";

    if (!whatsappService.isReady()) {
      return res.status(503).json({
        error: {
          message: "WhatsApp service is not ready. Please try again later.",
          status: 503,
        },
      });
    }

    // Check if user has already logged in today
    let log = await Log.findOne({ userId, date: today });

    if (log && log.loginMessageSent) {
      return res.status(409).json({
        error: {
          message: "You have already logged in today",
          status: 409,
        },
      });
    }

    // Send WhatsApp message
    await whatsappService.sendLoginMessage(phoneNumber, userName);

    // Update or create log entry
    if (log) {
      log.loginTime = new Date();
      log.loginMessageSent = true;
    } else {
      log = new Log({
        userId,
        date: today,
        loginTime: new Date(),
        loginMessageSent: true,
      });
    }

    await log.save();

    res.json({
      message: "Login message sent successfully",
      data: {
        timestamp: new Date(),
        action: "login",
      },
    });
  } catch (error) {
    console.error("Send login message error:", error);
    res.status(500).json({
      error: {
        message: "Failed to send login message",
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
    // Use the specific phone number instead of group ID
    const phoneNumber = "+919142130225";

    if (!whatsappService.isReady()) {
      return res.status(503).json({
        error: {
          message: "WhatsApp service is not ready. Please try again later.",
          status: 503,
        },
      });
    }

    // Check if user has already logged out today
    let log = await Log.findOne({ userId, date: today });

    if (log && log.logoutMessageSent) {
      return res.status(409).json({
        error: {
          message: "You have already logged out today",
          status: 409,
        },
      });
    }

    // Send WhatsApp message
    await whatsappService.sendLogoutMessage(phoneNumber, userName);

    // Update or create log entry
    if (log) {
      log.logoutTime = new Date();
      log.logoutMessageSent = true;
    } else {
      log = new Log({
        userId,
        date: today,
        logoutTime: new Date(),
        logoutMessageSent: true,
      });
    }

    await log.save();

    res.json({
      message: "Logout message sent successfully",
      data: {
        timestamp: new Date(),
        action: "logout",
      },
    });
  } catch (error) {
    console.error("Send logout message error:", error);
    res.status(500).json({
      error: {
        message: "Failed to send logout message",
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
        loginSent: log ? log.loginMessageSent : false,
        logoutSent: log ? log.logoutMessageSent : false,
        loginTime: log ? log.loginTime : null,
        logoutTime: log ? log.logoutTime : null,
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
