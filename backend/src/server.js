require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDatabase = require("./config/db");
const AppError = require("./utils/AppError");
const authRoutes = require("./routes/authRoutes");
const checkInRoutes = require("./routes/checkInRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const communityRoutes = require("./routes/communityRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const groupRoutes = require("./routes/groupRoutes");

const app = express();
const port = process.env.PORT || 5000;

connectDatabase();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mental-wellness-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/check-ins", checkInRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/groups", groupRoutes);

app.use((_req, _res, next) => {
  next(new AppError("Route not found.", 404));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const statusCode = err.statusCode || err.status || 500;

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed.",
      errors: Object.values(err.errors).map((item) => item.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid resource identifier.",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value detected.",
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Anonymous session token is invalid or expired.",
    });
  }

  res.status(statusCode).json({
    message: err.message || "Something went wrong.",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
