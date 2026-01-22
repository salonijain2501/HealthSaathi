import express from "express";
import Mood from "../models/mood.model.js";
import authMiddleware from "../middleware/auth.js";
import { getTimeOfDay } from "../utils/timeOfDay.js";
import { buildPrompt } from "../utils/buildPrompt.js";
import { calculateStreak } from "../utils/streak.js";
import { getAISuggestionFromOpenAI } from "../services/openai.service.js";
import { getFallbackSuggestion } from "../utils/fallbackSuggestions.js";

const router = express.Router();

/**
 * @route   POST /api/mood/add
 * @desc    Add mood + generate AI suggestion
 * @access  Private
 */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { mood, note } = req.body;

    // 1️⃣ Fetch user's previous moods
    const userMoods = await Mood.find({ user: req.user.id }).sort({ date: 1 });

    // 2️⃣ Calculate streak & time
    const streak = calculateStreak(userMoods);
    const timeOfDay = getTimeOfDay();

    // 3️⃣ Build prompt
    const prompt = buildPrompt({
      mood,
      note,
      timeOfDay,
      streak,
    });

    // 4️⃣ AI suggestion (OpenAI → fallback)
    let aiSuggestion;

    try {
      aiSuggestion = await getAISuggestionFromOpenAI(prompt);
    } catch (error) {
      console.error("OpenAI failed:", error.message);
      aiSuggestion = getFallbackSuggestion(mood);
    }

    // 5️⃣ SAVE TO DATABASE ✅ (THIS WAS MISSING)
    const savedMood = await Mood.create({
      user: req.user.id,
      mood,
      note,
      aiSuggestion,
    });

    // 6️⃣ Send response
    res.status(201).json(savedMood);
  } catch (err) {
    console.error("Mood add error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
