const Groq = require("groq-sdk");
require("dotenv").config();
const parseAIResponse = require("../utils/parseAIResponse");
const ApiError = require("../utils/ApiError");
const {aiEvaluationSchema} = require("../validators/ai.validator");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateInterviewQuestions = async ({
  role,
  difficulty,
  techStack,
  numberOfQuestions,
  resumeText
}) => {

  try {
    const prompt = `You are a Senior Software Engineer with over 10 years of experience.
  
    Generate exactly ${numberOfQuestions} interview questions.
  
    Candidate Role: ${role}
  
    Difficulty: ${difficulty}
  
    Tech Stack: ${techStack.join(",")}
    
    Resume: ${resumeText || "No resume provided"}
  
    Instructions:
  
    - Focus on practical questions.
    - Avoid duplicates.
    - Include ideal answers.
    - Return only JSON.
    - Do not use markdown.
    - Do not wrap it inside triple backticks.
    - Do not include introductory text.
    - Do not include concluding text.
    - If resume text is provided, generate questions based on the candidate's experience and projects.
    - Otherwise generate questions using only the role and tech stack.
  
    Output:
  
    [
    {
      "question":"",
      "expectedAnswer":""
    }
    ]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are senior developer with more than 10 years of experience."
        }, {
          role: "user",
          content: prompt
        }
      ]
    })

    const questions = JSON.parse(
      response.choices[0].message.content
    );

    return questions;
  } catch (error) {
    return error.message;
  }
};

const evaluateAnswer = async ({
  question,
  userAnswer,
  expectedAnswer
}) => {
  try {
    const prompt = `
     You are a Senior Technical Interviewer.
 
   Question:
   ${question}
 
   Expected Answer:
   ${expectedAnswer}
 
   Candidate Answer:
   ${userAnswer}
 
   Evaluate the candidate's answer.
 
   Instructions:
   - Give a score from 0 to 10.
   - Provide constructive feedback explaining the strengths and weaknesses of the candidate's answer.
   - Be fair.
   - Return ONLY valid JSON.
   - Do not use markdown.
   - Do not wrap the JSON inside triple backticks.
   - Do not include explanations.
   - Do not include introductory text.
   - Do not include concluding text.
 
    Scoring Guidelines:
    - 0–2: Completely incorrect or irrelevant.
    - 3–5: Partially correct but missing key concepts.
    - 6–8: Mostly correct with minor omissions.
    - 9–10: Accurate, complete, and well explained.

   Output:
 
   {
     "score": 0,
     "feedback": ""
   }
   `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced Senior Technical Interviewer. Always evaluate answers fairly and return only valid JSON."
        }, {
          role: "user",
          content: prompt
        }
      ]
    })

    const evaluation = parseAIResponse(
      response.choices[0].message.content
    );

    aiEvaluationSchema.parse(evaluation);

    return evaluation ;

  } catch (error) {
    throw new ApiError(
        500,
        `Failed to evaluate answer: ${error.message}`
    );
  }
}

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer
};
