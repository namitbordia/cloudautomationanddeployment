const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mood: {
      type: String,
      enum: ["happy", "neutral", "stressed", "sad"],
      required: true,
    },
    journalNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

checkInSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("CheckIn", checkInSchema);
