import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Car } from "../models/Car.js";

//Generate JWT token
const generateToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || password.length < 8) {
      return res.json({ success: false, message: "Fill all the fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newUser._id.toString());
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(409)
        .json({ success: false, message: "User not found!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ success: true, message: "User logged in successfully!", token });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// Get user data using JWT
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

//Get all cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    return res.json({ success: true, cars });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
