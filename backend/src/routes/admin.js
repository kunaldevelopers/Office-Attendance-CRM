const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/adminController");
const whatsappAdminController = require("../controllers/whatsappAdminController");
const { protect, adminOnly } = require("../middleware/auth");

// Apply protection and admin-only middleware to all routes
router.use(protect);
router.use(adminOnly);

// Staff management routes
router.get("/staff", adminController.getAllStaff);
router.post(
  "/staff",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("jobRole")
      .isIn([
        "Developer",
        "Sales Executive",
        "Graphics Designer",
        "Video Editor",
        "Photo Editor",
        "Cyber Security",
        "WordPress Developer",
      ])
      .withMessage("Please select a valid job role"),
    body("gender")
      .isIn(["Male", "Female"])
      .withMessage("Please select a valid gender"),
    body("age")
      .isInt({ min: 16, max: 65 })
      .withMessage("Age must be between 16 and 65"),
    body("dateOfBirth")
      .isISO8601()
      .withMessage("Please provide a valid date of birth"),
    body("qualification")
      .isIn(["12th", "Diploma", "UG", "PG"])
      .withMessage("Please select a valid qualification"),
    body("employmentType")
      .isIn(["Regular", "Intern"])
      .withMessage("Please select a valid employment type"),
    body("callingNumber")
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage("Please provide a valid calling number"),
    body("whatsappNumber")
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage("Please provide a valid WhatsApp number"),
  ],
  adminController.addStaff
);
router.get("/staff/:id", adminController.getStaffById);
router.put(
  "/staff/:id",
  [
    body("name").optional().trim().isLength({ min: 2, max: 50 }),
    body("email").optional().isEmail().normalizeEmail(),
    body("jobRole")
      .optional()
      .isIn([
        "Developer",
        "Sales Executive",
        "Graphics Designer",
        "Video Editor",
        "Photo Editor",
        "Cyber Security",
        "WordPress Developer",
      ]),
    body("gender").optional().isIn(["Male", "Female"]),
    body("age").optional().isInt({ min: 16, max: 65 }),
    body("dateOfBirth").optional().isISO8601(),
    body("qualification").optional().isIn(["12th", "Diploma", "UG", "PG"]),
    body("employmentType").optional().isIn(["Regular", "Intern"]),
    body("callingNumber")
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/),
    body("whatsappNumber")
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/),
  ],
  adminController.updateStaff
);
router.delete("/staff/:id", adminController.deleteStaff);
router.patch("/staff/:id/reactivate", adminController.reactivateStaff);

// Attendance reports routes
router.get("/attendance-reports", adminController.getAttendanceReports);
router.get(
  "/attendance-reports/download",
  adminController.downloadAttendanceReport
);
router.get(
  "/attendance-reports/user/:userId",
  adminController.getUserAttendance
);

// Dashboard routes
router.get("/dashboard", adminController.getDashboardStats);
router.get("/dashboard/by-role", adminController.getDashboardStatsByRole);

// WhatsApp management routes
router.get("/whatsapp/status", whatsappAdminController.getWhatsAppStatus);
router.post("/whatsapp/start", whatsappAdminController.startWhatsAppService);
router.post("/whatsapp/stop", whatsappAdminController.stopWhatsAppService);
router.post(
  "/whatsapp/restart",
  whatsappAdminController.restartWhatsAppService
);
router.post(
  "/whatsapp/force-restart",
  whatsappAdminController.forceRestartWhatsAppService
);
router.post(
  "/whatsapp/soft-recover",
  whatsappAdminController.softRecoverWhatsAppService
);
router.post("/whatsapp/disconnect", whatsappAdminController.disconnectWhatsApp);
router.get("/whatsapp/qr", whatsappAdminController.getQRCode);
router.post(
  "/whatsapp/test",
  [
    body("message")
      .optional()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Message must be between 1 and 1000 characters"),
  ],
  whatsappAdminController.testWhatsAppMessage
);

module.exports = router;
