const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

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
