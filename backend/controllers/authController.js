import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc   Register new user
// @route  POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, phone, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    preferences: user.preferences,
    token: generateToken(user._id),
  });
});

// @desc   Login user
// @route  POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc   Get logged in user's profile
// @route  GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc   Update logged-in user's name, phone, and/or notification preferences
// @route  PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, phone, preferences } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (preferences !== undefined) {
    user.preferences = { ...user.preferences.toObject(), ...preferences };
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    role: updated.role,
    preferences: updated.preferences,
  });
});

// @desc   Change the logged-in user's password
// @route  PUT /api/auth/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error("Provide your current password and a new password of at least 6 characters");
  }

  const user = await User.findById(req.user._id);
  if (!user || !(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword; // pre-save hook re-hashes this automatically
  await user.save();
  res.json({ message: "Password updated successfully" });
});

// @desc   Permanently delete the logged-in user's account
// @route  DELETE /api/auth/account
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Password is incorrect");
  }

  await user.deleteOne();
  res.json({ message: "Account deleted" });
});