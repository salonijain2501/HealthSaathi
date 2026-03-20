import express from "express";
import { getAISuggestion } from "../services/ai.service.js";
import { getFallbackSuggestion } from "../utils/fallbackSuggestions.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    let reply;

    try {
      reply = await getAISuggestionFromOpenAI(message);
    } catch (error) {
      console.log("OpenAI failed → using fallback");
      reply = getFallbackSuggestion("stressed"); 
    }

    res.json({ reply });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "AI chat failed" });
  }
});

export default router;