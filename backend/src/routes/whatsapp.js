const express = require("express");
const whatsappController = require("../controllers/whatsappController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// All WhatsApp routes require authentication
router.use(authMiddleware);

// Routes
router.post("/login", whatsappController.sendLoginMessage);
router.post("/logout", whatsappController.sendLogoutMessage);
router.get("/status", whatsappController.getTodayStatus);

module.exports = router;
