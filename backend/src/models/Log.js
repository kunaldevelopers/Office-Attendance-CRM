const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    loginTime: {
      type: Date,
      default: null,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    loginMessageSent: {
      type: Boolean,
      default: false,
    },
    logoutMessageSent: {
      type: Boolean,
      default: false,
    },
    // Lunch break tracking
    lunchBreaks: [
      {
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          default: null,
        },
        duration: {
          type: Number, // in minutes
          default: 0,
        },
      },
    ],
    // Miscellaneous break tracking
    miscBreaks: [
      {
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          default: null,
        },
        duration: {
          type: Number, // in minutes
          default: 0,
        },
      },
    ],
    // Current active break status
    activeLunchBreak: {
      type: Boolean,
      default: false,
    },
    activeMiscBreak: {
      type: Boolean,
      default: false,
    },
    // Total break durations for the day (in minutes)
    totalLunchBreakDuration: {
      type: Number,
      default: 0,
    },
    totalMiscBreakDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
logSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Log", logSchema);
