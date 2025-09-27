// routes/readingRoutes.js

import express from "express";
import Reading from "../models/Reading.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
  try {
    // 1. Find the admin user based on the email in the .env file
    const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

    // 2. If no admin is found, return an empty list
    if (!adminUser) {
      console.error("Admin user not found. Check ADMIN_EMAIL in your .env file.");
      return res.json([]);
    }

    // 3. Find all readings where the user is the admin
    const readings = await Reading.find({ user: adminUser._id }).sort({ date: -1 });
    res.json(readings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST a new reading
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

    try {
        const { date, ...readings } = req.body;

        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999);

        const updatedEntry = await Reading.findOneAndUpdate(
            { user: req.user._id, date: { $gte: startDate, $lt: endDate } },
            { $set: readings, $setOnInsert: { user: req.user._id, date: startDate } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json(updatedEntry);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE an existing reading by ID
router.put("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }
    try {
        const updatedReading = await Reading.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // This option returns the updated document
        );
        if (!updatedReading) {
            return res.status(404).json({ message: "Reading not found" });
        }
        res.json(updatedReading);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// DELETE a reading by ID
router.delete("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }
    try {
        const deletedReading = await Reading.findByIdAndDelete(req.params.id);
        if (!deletedReading) {
            return res.status(404).json({ message: "Reading not found" });
        }
        res.json({ message: "Reading deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }

    try {
        const { date, ...readings } = req.body;

        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999);

        const updatedEntry = await Reading.findOneAndUpdate(
            {
                user: req.user._id,
                date: { $gte: startDate, $lt: endDate }
            },
            {
                $set: readings, // Update with new reading values
                $setOnInsert: { user: req.user._id, date: startDate } // Set these fields only when creating
            },
            {
                new: true, // Return the new/updated document
                upsert: true, // This is the magic: create if it doesn't exist
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json(updatedEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// GET stats for the last 15 days for the chart
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminUser) {
            return res.json([]);
        }

        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const readings = await Reading.find({
            user: adminUser._id,
            date: { $gte: fifteenDaysAgo }
        }).sort({ date: 'asc' }); // Sort ascending for the chart

        res.json(readings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;