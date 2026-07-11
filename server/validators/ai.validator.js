const { z } = require("zod");

const aiQuestionsSchema = z.array(
  z.object({
    question: z.string(),
    expectedAnswer: z.string()
  })
);

module.exports = {
  aiQuestionsSchema
}