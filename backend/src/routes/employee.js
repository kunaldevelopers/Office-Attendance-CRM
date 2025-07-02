const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const { authMiddleware } = require("../middleware/auth");

// Apply protection middleware to all routes
router.use(authMiddleware);

// Get employee's own attendance data
router.get("/attendance", async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 50 } = req.query;
    const userId = req.user._id || req.user.id;

    console.log("🔍 Employee attendance request:", {
      userId,
      userEmail: req.user.email,
      startDate,
      endDate,
    });

    // Build query for the logged-in employee only
    const query = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    console.log("📋 Query:", query);

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const skip = (page - 1) * limit;

    const attendanceRecords = await Log.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalRecords = await Log.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    console.log("📊 Results:", {
      recordsFound: attendanceRecords.length,
      totalRecords,
      recordDates: attendanceRecords.map((r) => r.date),
    });

    res.json({
      success: true,
      message: "Employee attendance retrieved successfully",
      data: {
        records: attendanceRecords,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get employee attendance error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve employee attendance",
        status: 500,
      },
    });
  }
});

module.exports = router;
