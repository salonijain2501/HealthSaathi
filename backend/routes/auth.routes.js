import express from "express";
import User from "../models/user.model.js";
import Mood from "../models/mood.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { OAuth2Client } from "google-auth-library";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ── Rate limiter for sensitive auth endpoints ─────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 auth requests per 15 minutes
  message: { message: "Too many authentication attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────────────────────
// PUBLIC: SIGNUP
// ─────────────────────────────────────────────────────────────
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid field format." });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    res.status(201).json({ message: "Account created successfully. Please sign in." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: LOGIN
// ─────────────────────────────────────────────────────────────
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid credentials format." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Account registered via Google OAuth without password
    if (!user.password && user.authProvider === "google") {
      return res.status(400).json({
        message: "This account was created with Google Sign-In. Please sign in using Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        authProvider: user.authProvider || "local",
        hasPassword: Boolean(user.password),
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: GOOGLE OAUTH 2.0 LOGIN & SIGNUP
// ─────────────────────────────────────────────────────────────
router.post("/google", authLimiter, async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== "string") {
      return res.status(400).json({ message: "Google credential token is required." });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not configured in backend environment variables.");
      return res.status(500).json({
        message: "Google authentication is not yet configured on this server.",
      });
    }

    // Securely verify token with Google's public keys
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload." });
    }

    if (!payload.email_verified) {
      return res.status(400).json({ message: "Google email is not verified." });
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    const googleId = payload.sub;
    const name = (payload.name || payload.given_name || "Mindful Soul").trim();
    const picture = payload.picture || null;

    // Find existing user by Google ID or by email
    let user = await User.findOne({
      $or: [{ googleId }, { email: cleanEmail }],
    });

    if (user) {
      let shouldSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        shouldSave = true;
      }
      if ((!user.avatar || user.avatar === "🌿") && picture) {
        user.avatar = picture;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email: cleanEmail,
        googleId,
        authProvider: "google",
        avatar: picture || "🌿",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google authentication successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        authProvider: user.authProvider || "google",
        hasPassword: Boolean(user.password),
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Google authentication error:", err.message);
    res.status(401).json({
      message: "Google verification failed. Token may be invalid or expired.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED: GET CURRENT USER PROFILE
// ─────────────────────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      authProvider: user.authProvider || "local",
      hasPassword: Boolean(user.password),
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Could not fetch profile." });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED: UPDATE PROFILE (name, bio, avatar)
// ─────────────────────────────────────────────────────────────
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Name cannot be empty." });
    }

    if (bio && (typeof bio !== "string" || bio.length > 200)) {
      return res.status(400).json({ message: "Bio must be 200 characters or less." });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
        bio: (bio || "").trim(),
        avatar: avatar || "🌿",
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        bio: updated.bio,
        avatar: updated.avatar,
        authProvider: updated.authProvider || "local",
        hasPassword: Boolean(updated.password),
        createdAt: updated.createdAt,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Could not update profile." });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED: CHANGE / SET PASSWORD
// ─────────────────────────────────────────────────────────────
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If user already has a password, verify the current password
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required." });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must differ from current password." });
      }
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    await user.save();

    res.json({ message: user.password ? "Password updated successfully." : "Password created successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Could not change password." });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED: DELETE ACCOUNT (+ all user data)
// ─────────────────────────────────────────────────────────────
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    const { password, confirm } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // For local users with password, verify current password
    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: "Password confirmation is required." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password is incorrect. Account not deleted." });
      }
    } else {
      // For social accounts without password, require explicit confirmation flag
      if (confirm !== "DELETE") {
        return res.status(400).json({ message: "Please type DELETE to confirm account removal." });
      }
    }

    // Delete all moods belonging to this user
    await Mood.deleteMany({ user: req.user._id });

    // Delete the user account
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "Account and all associated data permanently deleted." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Could not delete account." });
  }
});

export default router;
