import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });


    if (user.email === process.env.ADMIN_EMAIL) {
      user.role = "admin";
    }
    // ======================================================

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
