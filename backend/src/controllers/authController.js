const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { signAnonymousToken } = require("../utils/jwt");

const createAnonymousSession = asyncHandler(async (req, res) => {
  const anonymousId = uuidv4();
  const user = await User.create({
    anonymousId,
    preferences: {
      allowCommunityAggregation: req.body.allowCommunityAggregation ?? true,
    },
  });
  const token = signAnonymousToken(user);

  res.status(201).json({
    message: "Anonymous session created.",
    data: {
      anonymousId: user.anonymousId,
      token,
      preferences: user.preferences,
    },
  });
});

module.exports = { createAnonymousSession };
