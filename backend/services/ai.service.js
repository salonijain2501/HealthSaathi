export const getAISuggestion = async (prompt) => {
  try {
    const res = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: prompt,
        max_tokens: 80,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    // 🔥 DEBUG (IMPORTANT)
    console.log("AI RESPONSE:", data);

    // ✅ SAFE CHECK
    if (!data.generations || !data.generations.length) {
      throw new Error("Invalid AI response");
    }

    return data.generations[0].text.trim();

  } catch (err) {
    console.error("AI Error:", err);
    throw new Error("AI failed");
  }
};