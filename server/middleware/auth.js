
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User not authorized",
    });
  }

  try {
    // Verify the token and extract its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Your JWT payload contains { id: userId }
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
