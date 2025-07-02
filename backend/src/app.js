const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  console.error(
    "Please check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

// Warn about optional WhatsApp configuration
if (!process.env.WHATSAPP_GROUP_ID) {
  console.warn(
    "⚠️  WHATSAPP_GROUP_ID not configured - WhatsApp features will be disabled"
  );
}

// Import routes
const authRoutes = require("./routes/auth");
const whatsappRoutes = require("./routes/whatsapp");
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employee");

// Import WhatsApp service
const WhatsAppService = require("./services/whatsappService");

// Import admin seeding function
const seedAdmin = require("./utils/seedAdmin");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Seed admin user after MongoDB connection
    seedAdmin();
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Initialize WhatsApp service (don't auto-start)
const whatsappService = new WhatsAppService();
app.locals.whatsappService = whatsappService;
console.log("📱 WhatsApp service initialized (manual start required)");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  const whatsappStatus = whatsappService.getStatus();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      server: "running",
      database: "connected",
      whatsapp: {
        ready: whatsappStatus.ready,
        initializing: whatsappStatus.initializing,
        hasClient: whatsappStatus.hasClient,
        status: whatsappStatus.ready
          ? "connected"
          : whatsappStatus.initializing
          ? "initializing"
          : "disconnected",
      },
    },
    // Legacy field for backward compatibility
    whatsappReady: whatsappStatus.ready,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Error:", error);
  res.status(error.status || 500).json({
    error: {
      message: error.message || "Internal Server Error",
      status: error.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  });
});

module.exports = app;
