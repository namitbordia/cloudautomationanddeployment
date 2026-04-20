const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    anonymousId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    preferences: {
      allowCommunityAggregation: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
