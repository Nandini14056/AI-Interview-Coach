const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy"
    },
    techStack: [{
      type: String,
      trim: true
    }],
    interviewType: {
      type: String,
      required: true,
      enum: [
        "Role",
        "Resume",
        "Mixed"
      ]
    },
    mode: {
      type: String,
      required: true,
      enum: ["Text", "Voice", "Video"],
      default: "Text"
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    completedQuestions: {
      type: Number,
      default: 0
    },
    overallScore: {
      type: Number,
      default: 0
    },
    overallFeedback: {
      type: String,
      default: ""
    },
    weakTopics: {
      type: [String],
      default: []
    },
    duration: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      required: true,
      enum: ["Completed", "In Progress", "Cancelled"],
      default: "In Progress"
    },
    resumeUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Interview = new mongoose.model("Interview", interviewSchema);

module.exports = Interview;