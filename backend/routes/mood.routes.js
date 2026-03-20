import express from "express";
import mongoose from "mongoose";
import Mood from "../models/mood.model.js";
import authMiddleware from "../middleware/auth.js";
import { getTimeOfDay } from "../utils/timeOfDay.js";
import { buildPrompt } from "../utils/buildPrompt.js";
import { calculateStreak } from "../utils/streak.js";
import { getAISuggestion } from "../services/ai.service.js";
import { getFallbackSuggestion } from "../utils/fallbackSuggestions.js";

const router = express.Router();

/**
 * 🔹 ADD MOOD
 */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { mood, note } = req.body;

    const userMoods = await Mood.find({ user: req.user.id }).sort({ createdAt: 1 });

    const streak = calculateStreak(userMoods);
    const timeOfDay = getTimeOfDay();

    const prompt = buildPrompt({
      mood,
      note,
      timeOfDay,
      streak,
    });

    let aiSuggestion;

    try {
      aiSuggestion = await getAISuggestion(prompt);
    } catch {
      aiSuggestion = getFallbackSuggestion(mood);
    }

    const savedMood = await Mood.create({
      user: req.user.id,
      mood,
      note,
      aiSuggestion,
    });

    res.status(201).json(savedMood);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 GET MY MOODS
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 GRAPH DATA
 */
router.get("/graph", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 DELETE MOOD
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ message: "Mood deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 UPDATE MOOD
 */
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

/**
 * 🔹 STATS
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Mood.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);

  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🔥 STREAK
 */
router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: 1 });

    const streak = calculateStreak(moods);

    res.json({ streak });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🔥 AI ANALYSIS
 */
router.get("/analysis", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7);

    if (moods.length === 0) {
      return res.json({
        suggestion: "Start logging moods to get AI insights 😊"
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
      suggestion = await getAISuggestion(prompt);
    } catch {
      suggestion = getFallbackSuggestion(moods[0].mood);
    }

    res.json({ suggestion });

  } catch (err) {
    res.status(500).json({ message: "AI analysis failed" });
  }
});

export default router;