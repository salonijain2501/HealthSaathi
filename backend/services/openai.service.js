import OpenAI from "openai";
console.log("API KEY:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const getAISuggestionFromOpenAI = async (prompt) => {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: "You are a supportive mental health assistant."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content;
};