import mongoose from "mongoose";

/*
  Ye schema batata hai:
  - kis user ka mood hai
  - mood kya hai
  - kab ka hai
  - optional note
*/

const moodSchema = new mongoose.Schema(
  {
    // 🔗 Mood kis user ka hai (relation with User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User model se connect
      required: true,
    },

    // 😊 User ka mood
    mood: {
      type: String,
      required: true,
      enum: ["happy", "sad", "anxious", "calm", "stressed"],
    },

    // 📝 Optional note
    note: {
      type: String,
    },

    // 📅 Date (default = aaj)
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // createdAt, updatedAt auto
);

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
