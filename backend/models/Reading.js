// models/Reading.js

import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", 
  },
    date: { 
    type: Date, 
    required: true 
  },
  beforeLunch: Number,
  afterLunch: Number,
  beforeDinner: Number,
  afterDinner: Number,
});

export default mongoose.model("Reading", readingSchema);