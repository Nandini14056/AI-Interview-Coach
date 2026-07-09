const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    expectedAnswer: {
      type: String,
      required: true,
      trim: true
    },
    userAnswer: {
      type: String,
      default: "",
      trim: true
    },
    score: {
      type: Number,
      default: 0
    },
    feedback: {
      type: String,
      default: ""
    },
    timeTaken: {
      type: Number,
      default: 0
    },
    isFollowUp: {
      type: Boolean,
      default: false
    },
    status: {
    type: String,
    enum: [
        "Pending",
        "Answered",
        "Evaluated"
    ],
    default: "Pending"
}
  },
  {
    timestamps: true
  }
);

const Question = new mongoose.model("Question", questionSchema);

module.exports = Question;