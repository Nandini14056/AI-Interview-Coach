const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Interview = require("../models/interview.model");
const Question = require("../models/question.model");

const { interviewSchema } = require("../validators/interview.validator");
const {
  generateInterviewQuestions,
  evaluateAnswer,
  generateOverallFeedback,
} = require("../services/ai.service");
const mongoose = require("mongoose");

const processAnswer = async ({ interview, question, answer }) => {

  if (!answer || !answer.trim()) {
    throw new ApiError(
      400,
      "Answer cannot be empty."
    );
  }

  const alreadyAnswered = Boolean(question.userAnswer && question.userAnswer.trim());

  const evaluation = await evaluateAnswer({
    question: question.question,
    expectedAnswer: question.expectedAnswer,
    userAnswer: answer.trim(),
  });

  question.userAnswer = answer.trim();
  question.score = evaluation.score;
  question.feedback = evaluation.feedback;

  await question.save();

  if (!alreadyAnswered) {
    interview.completedQuestions += 1;
  }

  const answeredCount = await Question.countDocuments({
    interview: interview._id,
    userAnswer: {
      $exists: true,
      $ne: "",
    },
  });

  const allAnswered = answeredCount >= interview.totalQuestions;

  if (allAnswered) {
    const answeredQuestions = await Question.find({ interview: interview._id, })
      .select(
        "question expectedAnswer userAnswer score feedback"
      )
      .sort({
        order: 1,
      });
    const overallResult = await generateOverallFeedback({
      questions: answeredQuestions,
    });

    interview.status = "Completed";

    interview.completedAt = new Date();

    interview.duration = Math.floor((
      interview.completedAt - interview.startedAt) / 1000);

    interview.overallScore = overallResult.overallScore;

    interview.overallFeedback = overallResult.overallFeedback;

    interview.weakTopics = overallResult.weakTopics;

    await interview.save();

    return {
      completed: true,
      overallScore: interview.overallScore,
      overallFeedback: interview.overallFeedback,
      weakTopics: interview.weakTopics,
      score: evaluation.score,
      feedback: evaluation.feedback,
      nextQuestion: null,
    };
  }

  const nextQuestion = await Question.findOne({
    interview: interview._id,
    userAnswer: {
      $in: [null, ""],
    },
    order: {
      $gt: question.order,
    },
  })
    .select("-expectedAnswer")
    .sort({
      order: 1,
    });

  return {
    completed: false,
    score: evaluation.score,
    feedback: evaluation.feedback,
    nextQuestion,
  };
};

const startInterview = asyncHandler(
  async (req, res) => {
    const validateData =
      interviewSchema.parse(req.body);
    const {
      role,
      difficulty,
      techStack,
      numberOfQuestions,
      resumeText,
      interviewType,
      mode,
    } = validateData;

    const aiQuestions =
      await generateInterviewQuestions({
        role,
        difficulty,
        techStack,
        numberOfQuestions,
        resumeText,
      });

    if (!aiQuestions || aiQuestions.length === 0) {
      throw new ApiError(
        500,
        "Failed to generate interview questions."
      );
    }

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
      overallFeedback: "",
    };

    const interview = await Interview.create(interviewData);

    const questions = aiQuestions.map((question, index) => ({
      interview: interview._id,
      order: index + 1,
      question: question.question,
      expectedAnswer: question.expectedAnswer,
    }));

    try {
      await Question.insertMany(
        questions
      );
    } catch (error) {
      await Interview.findByIdAndDelete(
        interview._id
      );
      throw error;
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          interviewId: interview._id,
          totalQuestions: interview.totalQuestions,
        },
        "Interview created successfully"
      )
    );
  }
);

const getInterview = asyncHandler(async (req, res) => {
  const interviewId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
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
      "You are not authorized to access this interview"
    );
  }

  const questions = await Question.find({ interview: interview._id })
    .select("-expectedAnswer")
    .sort({
      order: 1,
    });


  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview,
        questions,
      },
      "Interview fetched successfully"
    )
  );
}
);

const submitAnswer = asyncHandler(async (req, res) => {
  const { answer, questionId, } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    throw new ApiError(
      404,
      "Interview not found"
    );
  }

  if (!interview.user.equals(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized"
    );
  }

  if (interview.status === "Completed") {
    throw new ApiError(
      400,
      "This interview has already been completed."
    );
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(
      400,
      "Invalid question id"
    );
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(
      404,
      "Question not found"
    );
  }

  if (!question.interview.equals(interview._id)) {
    throw new ApiError(
      400,
      "Question does not belong to this interview."
    );
  }

  const result = await processAnswer({
    interview,
    question,
    answer,
  });


  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      result.completed
        ? "Interview completed successfully."
        : "Answer submitted successfully"
    )
  );
}
);

const submitVoiceAnswer = asyncHandler(async (req, res) => {
  const { answer, questionId, } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    throw new ApiError(
      404,
      "Interview not found"
    );
  }

  if (!interview.user.equals(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized"
    );
  }

  if (interview.status === "Completed") {
    throw new ApiError(
      400,
      "This interview has already been completed."
    );
  }

  if (interview.mode !== "Voice") {
    throw new ApiError(
      400,
      "This interview is not a voice interview."
    );
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(
      400,
      "Invalid question id"
    );
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(
      404,
      "Question not found"
    );
  }

  if (!question.interview.equals(interview._id)) {
    throw new ApiError(
      400,
      "Question does not belong to this interview."
    );
  }


  const result = await processAnswer({
    interview,
    question,
    answer,
  });


  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      result.completed
        ? "Voice interview completed successfully."
        : "Voice answer submitted successfully."
    )
  );
}
);

const submitVideoAnswer = asyncHandler(async (req, res) => {
  const { answer, questionId, } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    throw new ApiError(
      404,
      "Interview not found"
    );
  }

  if (!interview.user.equals(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized"
    );
  }

  if (interview.status === "Completed") {
    throw new ApiError(
      400,
      "This interview has already been completed."
    );
  }

  if (interview.mode !== "Video") {
    throw new ApiError(
      400,
      "This interview is not a video interview."
    );
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(
      400,
      "Invalid question id"
    );
  }

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(
      404,
      "Question not found"
    );
  }

  if (!question.interview.equals(interview._id)) {
    throw new ApiError(
      400,
      "Question does not belong to this interview."
    );
  }

  const result = await processAnswer({
    interview,
    question,
    answer,
  });


  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      result.completed
        ? "Video interview completed successfully."
        : "Video answer submitted successfully."
    )
  );
}
);


const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id, })
    .select(
      "title role difficulty mode overallScore status duration createdAt"
    )
    .sort({
      createdAt: -1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      interviews,
      "Interview history fetched successfully"
    )
  );
}
);

const getInterviewResult = asyncHandler(async (req, res) => {

  const interviewId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
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

  const questions = await Question.find({ interview: interview._id })
    .sort({
      order: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview,
        questions,
      },
      "Result fetched successfully"
    )
  );
}
);

module.exports = {
  startInterview,
  getInterview,
  submitAnswer,
  submitVoiceAnswer,
  submitVideoAnswer,
  getInterviewHistory,
  getInterviewResult,
};