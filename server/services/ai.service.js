const Groq = require("groq-sdk");
require("dotenv").config();

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

module.exports = {
  generateInterviewQuestions
};
