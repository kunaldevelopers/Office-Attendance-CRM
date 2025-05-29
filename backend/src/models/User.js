const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    jobRole: {
      type: String,
      enum: [
        "Developer",
        "Sales Executive",
        "Graphics Designer",
        "Video Editor",
        "Photo Editor",
        "Cyber Security",
        "WordPress Developer",
      ],
      required: function () {
        return this.role === "employee";
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [16, "Age must be at least 16"],
      max: [65, "Age must be less than 65"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    qualification: {
      type: String,
      enum: ["12th", "Diploma", "UG", "PG"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Regular", "Intern"],
      required: true,
    },
    callingNumber: {
      type: String,
      required: [true, "Calling number is required"],
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid WhatsApp number"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
