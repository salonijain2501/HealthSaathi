import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    avatar: {
      type: String,
      default: "🌿",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
