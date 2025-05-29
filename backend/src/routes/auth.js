const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const signupValidation = [
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
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", signupValidation, authController.signup);
router.post("/signup", signupValidation, authController.signup); // Keep both for compatibility
router.post("/login", loginValidation, authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
router.get("/me", authMiddleware, authController.getProfile); // Add /me endpoint

module.exports = router;
