const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { verifyAnonymousToken } = require("../utils/jwt");

const authenticateAnonymous = asyncHandler(async (req, _res, next) => {
  const authHeader = req.header("authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Bearer token is required.", 401);
  }

  const token = authHeader.slice(7);
  const decoded = verifyAnonymousToken(token);

  if (decoded.scope !== "anonymous-user") {
    throw new AppError("Invalid token scope.", 401);
  }

  const user = await User.findById(decoded.sub);

  if (!user || user.anonymousId !== decoded.anonymousId) {
    throw new AppError("Anonymous session is invalid or expired.", 401);
  }

  req.user = user;
  req.auth = decoded;
  next();
});

module.exports = authenticateAnonymous;
