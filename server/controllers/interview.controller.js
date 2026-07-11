const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Interview = require("../models/interview.model");
const { interviewSchema } = require("../validators/interview.validator");
const generateInterviewQuestions = require("../services/ai.service");
const Question = require("../models/question.model");

const startInterview = asyncHandler(async (req, res) => {
  const validateData = interviewSchema.parse(req.body);

  const {
    role,
    difficulty,
    techStack,
    numberOfQuestions,
    resumeText,
    interviewType,
    mode
  } = validateData;

  const aiQuestions = await generateInterviewQuestions({
    role,
    difficulty,
    techStack,
    numberOfQuestions,
    resumeText
  });

  const interviewData = {
    user: req.user._id,
    role,
    difficulty,
    techStack,
    totalQuestions: numberOfQuestions,
    interviewType,
    mode,
    overallScore: 0,
    completedQuestions: 0,
    status: "In Progress",
    overallFeedback: ""
  }

  const interview = await Interview.create(interviewData);

  const questions = aiQuestions.map((question, index) => ({
    interview: interview._id,
    order: index + 1,
    question: question.question,
    expectedAnswer: question.expectedAnswer
  }));

  try {
    await Question.insertMany(questions);
  } catch (error) {
    await Interview.findByIdAndDelete(interview._id);
    throw error;
  }

  return res.status(201).json(
    new ApiResponse(201,
      {
        interviewId: interview._id,
        totalQuestions: interview.totalQuestions
      },
      "Interview created successfully"));
});

module.exports = {
  startInterview
}