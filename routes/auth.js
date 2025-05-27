const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv").config();

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, username, email, password, plan } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await db.User.create({
      name,
      username,
      email,
      password: hashed,
      plan,
    });
    res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ where: { email } });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({ message: "Login successful" });
});

// Logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
