const { z } = require("zod");

const aiQuestionsSchema = z.array(
  z.object({
    question: z.string(),
    expectedAnswer: z.string()
  })
);

const aiEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string()
});

const aiOverallFeedbackSchema = z.object({
  overallScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
  weakTopics: z.array(z.string())
});

module.exports = {
  aiQuestionsSchema,
  aiEvaluationSchema,
  aiOverallFeedbackSchema
}