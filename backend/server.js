import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";

import readingRoutes from "./routes/readingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL 
}));
app.use(express.json());



// Routes
app.use("/api/readings", readingRoutes);
app.use("/api/auth", authRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected".bgGreen))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.bgMagenta));
