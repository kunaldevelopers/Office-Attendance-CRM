const User = require("../models/User");
const Log = require("../models/Log");
const { validationResult } = require("express-validator");

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "employee" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      message: "Staff retrieved successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Get all staff error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve staff",
        status: 500,
      },
    });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id).select("-password");

    if (!staff || staff.role !== "employee") {
      return res.status(404).json({
        error: {
          message: "Staff member not found",
          status: 404,
        },
      });
    }
    res.json({
      success: true,
      message: "Staff member retrieved successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Get staff by ID error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve staff member",
        status: 500,
      },
    });
  }
};

// Add new staff member
exports.addStaff = async (req, res) => {
  try {
    console.log("Add staff request body:", req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array(),
          status: 400,
        },
      });
    }

    const {
      name,
      email,
      password,
      jobRole,
      gender,
      age,
      dateOfBirth,
      qualification,
      employmentType,
      callingNumber,
      whatsappNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({
        error: {
          message: "User with this email already exists",
          status: 409,
        },
      });
    }

    // Create new staff member
    const staff = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "employee",
      jobRole,
      gender,
      age,
      dateOfBirth,
      qualification,
      employmentType,
      callingNumber,
      whatsappNumber,
    });

    await staff.save();
    res.status(201).json({
      success: true,
      message: "Staff member added successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Add staff error:", error);
    res.status(500).json({
      error: {
        message: "Failed to add staff member",
        status: 500,
      },
    });
  }
};

// Update staff member
exports.updateStaff = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array(),
          status: 400,
        },
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Don't allow role changes or password updates through this endpoint
    delete updateData.role;
    delete updateData.password;

    const staff = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!staff || staff.role !== "employee") {
      return res.status(404).json({
        error: {
          message: "Staff member not found",
          status: 404,
        },
      });
    }

    res.json({
      message: "Staff member updated successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({
      error: {
        message: "Failed to update staff member",
        status: 500,
      },
    });
  }
};

// Delete/Deactivate staff member
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id);

    if (!staff || staff.role !== "employee") {
      return res.status(404).json({
        error: {
          message: "Staff member not found",
          status: 404,
        },
      });
    }

    // Soft delete by setting isActive to false
    staff.isActive = false;
    await staff.save();
    res.json({
      success: true,
      message: "Staff member deactivated successfully",
      data: { id, isActive: false },
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      error: {
        message: "Failed to deactivate staff member",
        status: 500,
      },
    });
  }
};

// Reactivate staff member
exports.reactivateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id);

    if (!staff || staff.role !== "employee") {
      return res.status(404).json({
        error: {
          message: "Staff member not found",
          status: 404,
        },
      });
    }

    staff.isActive = true;
    await staff.save();

    res.json({
      message: "Staff member reactivated successfully",
      data: { id, isActive: true },
    });
  } catch (error) {
    console.error("Reactivate staff error:", error);
    res.status(500).json({
      error: {
        message: "Failed to reactivate staff member",
        status: 500,
      },
    });
  }
};

// Get attendance reports
exports.getAttendanceReports = async (req, res) => {
  try {
    const { startDate, endDate, userId, page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};

    if (userId) {
      query.userId = userId;
    }

    // Handle date filtering - ensure proper format
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

    console.log("Attendance query:", query);

    const skip = (page - 1) * limit;
    const attendanceRecords = await Log.find(query)
      .populate("userId", "name email jobRole employmentType")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`Found ${attendanceRecords.length} attendance records`);

    // Transform the data to match frontend expectations
    const transformedRecords = attendanceRecords.map((record) => {
      const checkInTime = record.loginTime;
      const checkOutTime = record.logoutTime;
      let hoursWorked = 0;
      let status = "absent";

      if (checkInTime && checkOutTime) {
        hoursWorked =
          Math.round(
            ((new Date(checkOutTime) - new Date(checkInTime)) /
              (1000 * 60 * 60)) *
              100
          ) / 100;
        status = "present";
      } else if (checkInTime && !checkOutTime) {
        status = "present"; // Still logged in
      }

      return {
        _id: record._id,
        userName: record.userId?.name || "Unknown",
        userEmail: record.userId?.email || "",
        jobRole: record.userId?.jobRole || "",
        employmentType: record.userId?.employmentType || "",
        date: record.date,
        checkInTime: checkInTime ? checkInTime.toISOString() : null,
        checkOutTime: checkOutTime ? checkOutTime.toISOString() : null,
        hoursWorked: hoursWorked.toFixed(2),
        status: status,
        loginMessageSent: record.loginMessageSent,
        logoutMessageSent: record.logoutMessageSent,
      };
    });

    const totalRecords = await Log.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      success: true,
      message: "Attendance reports retrieved successfully",
      data: transformedRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get attendance reports error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve attendance reports",
        status: 500,
      },
    });
  }
};

// Download attendance report as CSV
exports.downloadAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    // Build query
    const query = {};

    if (userId) {
      query.userId = userId;
    }

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

    const attendanceRecords = await Log.find(query)
      .populate("userId", "name email jobRole employmentType")
      .sort({ date: -1, createdAt: -1 });

    // Generate CSV content
    const csvHeaders = [
      "Date",
      "Employee Name",
      "Email",
      "Job Role",
      "Employment Type",
      "Login Time",
      "Logout Time",
      "Login Message Sent",
      "Logout Message Sent",
    ];

    const csvRows = attendanceRecords.map((record) => [
      record.date,
      record.userId?.name || "N/A",
      record.userId?.email || "N/A",
      record.userId?.jobRole || "N/A",
      record.userId?.employmentType || "N/A",
      record.loginTime ? new Date(record.loginTime).toLocaleString() : "N/A",
      record.logoutTime ? new Date(record.logoutTime).toLocaleString() : "N/A",
      record.loginMessageSent ? "Yes" : "No",
      record.logoutMessageSent ? "Yes" : "No",
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    // Set headers for file download
    const filename = `attendance_report_${startDate || "all"}_to_${
      endDate || "all"
    }.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.send(csvContent);
  } catch (error) {
    console.error("Download attendance report error:", error);
    res.status(500).json({
      error: {
        message: "Failed to download attendance report",
        status: 500,
      },
    });
  }
};

// Get attendance for specific user
exports.getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, page = 1, limit = 50 } = req.query;

    // Check if user exists and is an employee
    const user = await User.findById(userId);
    if (!user || user.role !== "employee") {
      return res.status(404).json({
        error: {
          message: "Employee not found",
          status: 404,
        },
      });
    }

    // Build query
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

    const skip = (page - 1) * limit;

    const attendanceRecords = await Log.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalRecords = await Log.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      message: "User attendance retrieved successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          jobRole: user.jobRole,
          employmentType: user.employmentType,
        },
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
    console.error("Get user attendance error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve user attendance",
        status: 500,
      },
    });
  }
};

// Get attendance summary
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    // Get date range for the month
    const startDate = `${targetYear}-${targetMonth
      .toString()
      .padStart(2, "0")}-01`;
    const endDate = new Date(targetYear, targetMonth, 0)
      .toISOString()
      .split("T")[0];

    // Get all active employees
    const employees = await User.find({
      role: "employee",
      isActive: true,
    }).select("name email jobRole employmentType");

    // Get attendance data for the month
    const attendanceData = await Log.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("userId", "name email");

    // Calculate summary for each employee
    const summary = employees.map((employee) => {
      const employeeAttendance = attendanceData.filter(
        (record) => record.userId._id.toString() === employee._id.toString()
      );

      const totalDays = employeeAttendance.length;
      const presentDays = employeeAttendance.filter(
        (record) => record.loginTime && record.logoutTime
      ).length;
      const partialDays = employeeAttendance.filter(
        (record) =>
          (record.loginTime && !record.logoutTime) ||
          (!record.loginTime && record.logoutTime)
      ).length;

      return {
        employee,
        totalDays,
        presentDays,
        partialDays,
        absentDays: 0, // This would need business logic to calculate working days
        attendancePercentage:
          totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
      };
    });

    res.json({
      message: "Attendance summary retrieved successfully",
      data: {
        month: targetMonth,
        year: targetYear,
        summary,
      },
    });
  } catch (error) {
    console.error("Get attendance summary error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve attendance summary",
        status: 500,
      },
    });
  }
};

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format to match database
    const today = new Date().toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD format
    console.log("Getting dashboard stats for date:", today);

    // Get total counts
    const totalEmployees = await User.countDocuments({
      role: "employee",
      isActive: true,
    });
    const totalInactiveEmployees = await User.countDocuments({
      role: "employee",
      isActive: false,
    });

    console.log(`Total active employees: ${totalEmployees}`);

    // Get today's attendance (only for active employees)
    const todayAttendance = await Log.find({ date: today }).populate({
      path: "userId",
      match: { isActive: true },
      select: "name email jobRole",
    });

    // Filter out logs where userId is null (inactive employees)
    const activeAttendance = todayAttendance.filter((record) => record.userId);

    console.log(
      `Found ${activeAttendance.length} attendance records for active employees today`
    );

    const presentToday = activeAttendance.filter(
      (record) => record.loginTime
    ).length;
    const loggedOutToday = activeAttendance.filter(
      (record) => record.logoutTime
    ).length;

    console.log(
      `Present today: ${presentToday}, Logged out: ${loggedOutToday}`
    );

    // Get this month's data
    const currentDate = new Date();
    const startOfMonth = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-01`;
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).toLocaleDateString("en-CA");

    const monthlyAttendance = await Log.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const absentToday = Math.max(0, totalEmployees - presentToday);
    const averageAttendance =
      totalEmployees > 0
        ? Math.round((presentToday / totalEmployees) * 100)
        : 0;

    // Transform today's attendance for display (only active employees)
    const todayAttendanceDisplay = activeAttendance
      .slice(0, 10)
      .map((record) => ({
        _id: record._id,
        userName: record.userId?.name || "Unknown",
        userEmail: record.userId?.email || "",
        jobRole: record.userId?.jobRole || "",
        date: record.date,
        checkInTime: record.loginTime ? record.loginTime.toISOString() : null,
        checkOutTime: record.logoutTime
          ? record.logoutTime.toISOString()
          : null,
        status: record.loginTime ? "present" : "absent",
      }));

    const stats = {
      totalEmployees,
      presentToday,
      absentToday,
      averageAttendance,
      totalInactiveEmployees,
      loggedOutToday,
      monthlyAttendance,
      todayAttendance: todayAttendanceDisplay,
    };

    console.log("Dashboard stats:", stats);

    res.json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      error: {
        message: "Failed to retrieve dashboard stats",
        status: 500,
      },
    });
  }
};
