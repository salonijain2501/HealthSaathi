import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAISuggestionFromOpenAI = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    // 🔥 THIS IS THE MAGIC
    temperature: 0.9,   // creativity
    top_p: 0.95,        // variation
    frequency_penalty: 0.6, // avoid repetition
    presence_penalty: 0.6,  // encourage new ideas

    messages: [
      {
        role: "system",
        content:
          "You are a warm, motivating mental health companion. Every response must be unique, empathetic, and slightly different from previous ones. Do not repeat phrases.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
};
