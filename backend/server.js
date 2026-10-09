import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import moodRoutes from "./routes/mood.routes.js";

connectDB();

const app = express();

// Trust reverse proxy (Essential for Render / Cloudflare / Heroku load balancers)
app.set("trust proxy", 1);

// ── Security Headers with Helmet ─────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // allows Google OAuth popups
  })
);

// ── General API Rate Limiting ─────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  message: { message: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", generalLimiter);

// ── CORS — allow dev + production domains ────────────────────
const localOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:3000",
];

const isAllowedOrigin = (origin) => {
  // Allow requests with no origin (mobile apps, curl, server-to-server)
  if (!origin) return true;

  if (localOrigins.includes(origin)) return true;

  // Explicit FRONTEND_URL from environment
  if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true;

  // Allow Cloudflare Pages domains (*.pages.dev)
  if (/^https:\/\/[a-z0-9_-]+\.pages\.dev$/i.test(origin)) return true;

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not allowed by policy`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Request Body Parser (Strict limits to mitigate DOS) ──────
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/chat", chatRoutes);

// ── Health checks (for Render & uptime monitoring) ───────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "HealthSaathi API",
    version: "1.0.0",
    auth: "JWT + Google OAuth 2.0",
    docs: "/health",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Centralized Error Handler (No stack leaks in production) ──
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith("CORS Error")) {
    return res.status(403).json({ message: err.message });
  }

  console.error("Unhandled Error:", err.stack || err.message);

  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    message: isProd ? "Internal server error" : (err.message || "Internal server error"),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HealthSaathi API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});