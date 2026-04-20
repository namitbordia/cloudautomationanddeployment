const jwt = require("jsonwebtoken");

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required.");
  }

  return process.env.JWT_SECRET;
}

function signAnonymousToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      anonymousId: user.anonymousId,
      scope: "anonymous-user",
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    }
  );
}

function verifyAnonymousToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  signAnonymousToken,
  verifyAnonymousToken,
};
