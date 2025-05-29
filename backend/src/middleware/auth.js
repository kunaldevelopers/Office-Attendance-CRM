const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: {
          message: "Access denied. No token provided.",
          status: 401,
        },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: {
          message: "Invalid token. User not found.",
          status: 401,
        },
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: {
          message: "Access denied. Account is deactivated.",
          status: 401,
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: {
          message: "Invalid token.",
          status: 401,
        },
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: {
          message: "Token expired.",
          status: 401,
        },
      });
    }

    res.status(500).json({
      error: {
        message: "Internal server error during authentication.",
        status: 500,
      },
    });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: {
        message: "Access denied. Admin privileges required.",
        status: 403,
      },
    });
  }
  next();
};

// Backward compatibility
const authMiddleware = protect;

module.exports = { protect, adminOnly, authMiddleware };
