const parseAIResponse = (content) => {
  try {
    const cleanedResponse = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    throw new Error(
      `Failed to parse AI response: ${error.message}`
    );
  }
};

module.exports = parseAIResponse;