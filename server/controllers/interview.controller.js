const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Interview = require("../models/interview.model");
const { interviewSchema } = require("../validators/interview.validator");
const { generateInterviewQuestions, evaluateAnswer } = require("../services/ai.service");
const Question = require("../models/question.model");

// Interview Creation
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
    startedAt: new Date(),
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

// Interview Session
const getInterview = asyncHandler(async (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(
      400,
      "Invalid interview id"
    );
  }

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    throw new ApiError(
      404,
      "Interview not found"
    );
  }

  const isOwner = interview.user.equals(req.user._id);

  if (!isOwner) {
    throw new ApiError(
      403,
      "You are not authorized to access this interview"
    );
  }

  const questions = await Question.find({
    interview: interview._id
  })
    .select("-expectedAnswer")
    .sort({ order: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview,
        questions
      },
      "interview fetched successfully"
    )
  );
});

const submitAnswer = asyncHandler(async (req, res) => {
  const { answer, questionId } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  const isOwner = interview.user.equals(req.user._id);

  if (!isOwner) {
    throw new ApiError(
      403,
      "You are not authorized"
    );
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(404, "Question not found")
  }

  if (question.userAnswer) {
    throw new ApiError(
      400,
      "This question has already been answered."
    );
  }

  question.userAnswer = answer;

  if (!question.interview.equals(interview._id)) {
    throw new ApiError(
      400,
      "Question does not belong to this interview."
    );
  }

  const evaluation = await evaluateAnswer({
    question: question.question,
    expectedAnswer: question.expectedAnswer,
    userAnswer: answer
  });

  question.score = evaluation.score;
  question.feedback = evaluation.feedback;

  await question.save();

  interview.completedQuestions += 1;

  const nextQuestion = await Question.findOne({
    interview: interview._id,
    order: question.order + 1
  }).select("-expectedAnswer");

  if (!nextQuestion) {

    const answeredQuestions = await Question.find({
      interview: interview._id
    })
      .select(
        "question expectedAnswer userAnswer score feedback"
      )
      .sort({ order: 1 });

    const overallResult = await generateOverallFeedback({
      questions: answeredQuestions
    });

    interview.status = "Completed";
    interview.completedAt = new Date();
    interview.duration = Math.floor(
      (interview.completedAt - interview.startedAt) / 1000
    );

    interview.overallScore = overallResult.overallScore;
    interview.overallFeedback = overallResult.overallFeedback;
    interview.weakTopics = overallResult.weakTopics;

    await interview.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          overallScore: interview.overallScore,
          overallFeedback: interview.overallFeedback,
          weakTopics: interview.weakTopics
        },
        "Interview completed successfully."
      )
    );
  }

  await interview.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        score: evaluation.score,
        feedback: evaluation.feedback,
        nextQuestion
      },
      "Answer submitted successfully"
    )
  );

});

// Interview History
const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id
  })
    .select(
      "title role difficulty mode overallScore status duration createdAt"
    )
    .sort({
      createdAt: -1
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      interviews,
      "Interview history fetched successfully"
    )
  );
});

const getInterviewResult = asyncHandler(async (req, res) => {
  const interviewId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(
      400,
      "Invalid interview id"
    );
  }

  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new ApiError(
      404,
      "Interview not found"
    );
  }

  if (!interview.user.equals(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to access this interview."
    );
  }

  if (interview.status !== "Completed") {
    throw new ApiError(
      400,
      "Interview is not completed yet."
    );
  }

  const questions = await Question.find({
    interview: interview._id
  })
    .sort({ order: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview,
        questions
      },
      "result fetched successfully"
    )
  );
});

module.exports = {
  startInterview,
  getInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewResult
}