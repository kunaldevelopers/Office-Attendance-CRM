const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const whatsappRoutes = require("./routes/whatsapp");

// Import WhatsApp service
const WhatsAppService = require("./services/whatsappService");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/login-logout-app",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Initialize WhatsApp service
const whatsappService = new WhatsAppService();
app.locals.whatsappService = whatsappService;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    whatsappReady: whatsappService.isReady(),
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
