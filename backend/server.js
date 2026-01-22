import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import moodRoutes from "./routes/mood.routes.js";

dotenv.config();          // ✅ load env variables
connectDB();              // ✅ connect MongoDB

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
