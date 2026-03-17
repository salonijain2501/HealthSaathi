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
// 🔹 GET MY MOODS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 GET GRAPH DATA
router.get("/graph", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 DELETE MOOD
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ message: "Mood deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 UPDATE MOOD
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { mood, note } = req.body;

    const updated = await Mood.findByIdAndUpdate(
      req.params.id,
      { mood, note },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔹 AI MOOD ANALYSIS
router.get("/analysis", authMiddleware, async (req, res) => {
  try {

    const moods = await Mood.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(7);

    if (moods.length === 0) {
      return res.json({
        suggestion: "Start logging moods to get AI insights."
      });
    }

    const prompt = buildPrompt({
      mood: moods[0].mood,
      note: moods[0].note,
      timeOfDay: getTimeOfDay(),
      streak: calculateStreak(moods)
    });

    let suggestion;

    try {
      suggestion = await getAISuggestionFromOpenAI(prompt);
    } catch (error) {
      suggestion = getFallbackSuggestion(moods[0].mood);
    }

    res.json({ suggestion });

  } catch (err) {
    console.error("AI analysis error:", err);
    res.status(500).json({ message: "AI analysis failed" });
  }
});
export default router;
