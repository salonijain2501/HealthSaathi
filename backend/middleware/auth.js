import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import "dotenv/config"; // Ensure variables are loaded if not in server.js

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if Header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "No token provided or format is incorrect. Use: Bearer <token>" 
      });
    }

    // 2. Extract token (split by space)
    const token = authHeader.split(" ")[1];

    // 3. Verify Token
    // We wrap this in a try-catch or check if SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env file");
      return res.status(500).json({ message: "Internal server authentication error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find User (Ensure the key 'id' matches what you used in jwt.sign)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found or account deleted" });
    }

    // 5. Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    // 6. Detailed error logging for debugging
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    
    return res.status(401).json({ 
      message: "Invalid token", 
      error: error.message // This helps you see why it failed in Postman
    });
  }
};

export default authMiddleware;