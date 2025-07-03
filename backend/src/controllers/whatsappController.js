const Log = require("../models/Log");

const getTodayDate = () => {
  // Use local timezone instead of UTC to get correct local date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD format in local timezone
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

    // Debug logging to help track the date calculation
    console.log(`📅 Today's date calculation:`, {
      localTime: new Date().toString(),
      utcTime: new Date().toISOString(),
      calculatedDate: today,
      userId: userId,
    });

    const log = await Log.findOne({ userId, date: today });

    console.log(`📊 Today's status for ${userId}:`, {
      date: today,
      hasLog: !!log,
      loginTime: log?.loginTime,
      logoutTime: log?.logoutTime,
    });

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
        // Break status
        lunchBreakActive: log ? log.activeLunchBreak : false,
        miscBreakActive: log ? log.activeMiscBreak : false,
        lunchBreaks: log ? log.lunchBreaks : [],
        miscBreaks: log ? log.miscBreaks : [],
        totalLunchBreakDuration: log ? log.totalLunchBreakDuration : 0,
        totalMiscBreakDuration: log ? log.totalMiscBreakDuration : 0,
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

// Lunch Break Management
exports.startLunchBreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const today = getTodayDate();

    // Find or create today's log
    let log = await Log.findOne({ userId, date: today });
    if (!log) {
      log = new Log({
        userId,
        date: today,
      });
    }

    // Check if lunch break is already active
    if (log.activeLunchBreak) {
      return res.status(409).json({
        error: {
          message: "Lunch break is already active",
          status: 409,
        },
      });
    }

    // Start lunch break
    const breakStartTime = new Date();
    log.lunchBreaks.push({
      startTime: breakStartTime,
    });
    log.activeLunchBreak = true;

    await log.save();

    res.json({
      message: "Lunch break started successfully",
      data: {
        timestamp: breakStartTime,
        action: "lunch_break_start",
      },
    });
  } catch (error) {
    console.error("Start lunch break error:", error);
    res.status(500).json({
      error: {
        message: "Failed to start lunch break",
        status: 500,
      },
    });
  }
};

exports.stopLunchBreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const today = getTodayDate();

    // Find today's log
    let log = await Log.findOne({ userId, date: today });
    if (!log) {
      return res.status(404).json({
        error: {
          message: "No log found for today",
          status: 404,
        },
      });
    }

    // Check if lunch break is active
    if (!log.activeLunchBreak) {
      return res.status(409).json({
        error: {
          message: "No active lunch break to stop",
          status: 409,
        },
      });
    }

    // Find the active lunch break and end it
    const activeLunchBreak = log.lunchBreaks[log.lunchBreaks.length - 1];
    if (activeLunchBreak && !activeLunchBreak.endTime) {
      const breakEndTime = new Date();
      activeLunchBreak.endTime = breakEndTime;

      // Calculate duration in minutes
      const duration = Math.round(
        (breakEndTime - activeLunchBreak.startTime) / (1000 * 60)
      );
      activeLunchBreak.duration = duration;

      // Update total lunch break duration
      log.totalLunchBreakDuration =
        (log.totalLunchBreakDuration || 0) + duration;
    }

    log.activeLunchBreak = false;
    await log.save();

    res.json({
      message: "Lunch break ended successfully",
      data: {
        timestamp: new Date(),
        action: "lunch_break_stop",
        duration: activeLunchBreak.duration,
      },
    });
  } catch (error) {
    console.error("Stop lunch break error:", error);
    res.status(500).json({
      error: {
        message: "Failed to stop lunch break",
        status: 500,
      },
    });
  }
};

// Miscellaneous Break Management
exports.startMiscBreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const today = getTodayDate();

    // Find or create today's log
    let log = await Log.findOne({ userId, date: today });
    if (!log) {
      log = new Log({
        userId,
        date: today,
      });
    }

    // Check if misc break is already active
    if (log.activeMiscBreak) {
      return res.status(409).json({
        error: {
          message: "Miscellaneous break is already active",
          status: 409,
        },
      });
    }

    // Start misc break
    const breakStartTime = new Date();
    log.miscBreaks.push({
      startTime: breakStartTime,
    });
    log.activeMiscBreak = true;

    await log.save();

    res.json({
      message: "Miscellaneous break started successfully",
      data: {
        timestamp: breakStartTime,
        action: "misc_break_start",
      },
    });
  } catch (error) {
    console.error("Start misc break error:", error);
    res.status(500).json({
      error: {
        message: "Failed to start miscellaneous break",
        status: 500,
      },
    });
  }
};

exports.stopMiscBreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const today = getTodayDate();

    // Find today's log
    let log = await Log.findOne({ userId, date: today });
    if (!log) {
      return res.status(404).json({
        error: {
          message: "No log found for today",
          status: 404,
        },
      });
    }

    // Check if misc break is active
    if (!log.activeMiscBreak) {
      return res.status(409).json({
        error: {
          message: "No active miscellaneous break to stop",
          status: 409,
        },
      });
    }

    // Find the active misc break and end it
    const activeMiscBreak = log.miscBreaks[log.miscBreaks.length - 1];
    if (activeMiscBreak && !activeMiscBreak.endTime) {
      const breakEndTime = new Date();
      activeMiscBreak.endTime = breakEndTime;

      // Calculate duration in minutes
      const duration = Math.round(
        (breakEndTime - activeMiscBreak.startTime) / (1000 * 60)
      );
      activeMiscBreak.duration = duration;

      // Update total misc break duration
      log.totalMiscBreakDuration = (log.totalMiscBreakDuration || 0) + duration;
    }

    log.activeMiscBreak = false;
    await log.save();

    res.json({
      message: "Miscellaneous break ended successfully",
      data: {
        timestamp: new Date(),
        action: "misc_break_stop",
        duration: activeMiscBreak.duration,
      },
    });
  } catch (error) {
    console.error("Stop misc break error:", error);
    res.status(500).json({
      error: {
        message: "Failed to stop miscellaneous break",
        status: 500,
      },
    });
  }
};
