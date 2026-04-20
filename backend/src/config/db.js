const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Create backend/.env and set a MongoDB connection string.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
