import express from "express";
import rateLimit from "express-rate-limit";
import { getAISuggestion } from "../services/ai.service.js";
import { getFallbackSuggestion } from "../utils/fallbackSuggestions.js";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // max 30 chat messages per minute per IP
  message: { message: "Too many AI chat requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "A message string is required." });
    }

    let reply;

    try {
      reply = await getAISuggestion(message.trim());
    } catch (error) {
      console.log("Primary AI failed → using fallback");
      reply = getFallbackSuggestion("stressed");
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "AI chat failed" });
  }
});

export default router;