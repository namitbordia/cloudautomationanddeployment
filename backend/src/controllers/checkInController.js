const CheckIn = require("../models/CheckIn");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { computeSuggestionsForUser } = require("../utils/checkInService");

const createCheckIn = asyncHandler(async (req, res) => {
  const { mood, journalNote = "" } = req.body;

  const suggestions = await computeSuggestionsForUser(req.user._id, mood, journalNote);

  const checkIn = await CheckIn.create({
    userId: req.user._id,
    mood,
    journalNote,
    suggestions,
  });

  res.status(201).json({
    message: "Mood entry created.",
    data: checkIn,
  });
});

const listCheckIns = asyncHandler(async (req, res) => {
  const checkIns = await CheckIn.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.json({
    message: "Mood entries fetched.",
    data: checkIns,
  });
});

const getCheckInById = asyncHandler(async (req, res) => {
  const checkIn = await CheckIn.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!checkIn) {
    throw new AppError("Mood entry not found.", 404);
  }

  res.json({
    message: "Mood entry fetched.",
    data: checkIn,
  });
});

const updateCheckIn = asyncHandler(async (req, res) => {
  const { mood, journalNote = "" } = req.body;

  const checkIn = await CheckIn.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!checkIn) {
    throw new AppError("Mood entry not found.", 404);
  }

  checkIn.mood = mood;
  checkIn.journalNote = journalNote;
  checkIn.suggestions = await computeSuggestionsForUser(req.user._id, mood, journalNote);
  await checkIn.save();

  res.json({
    message: "Mood entry updated.",
    data: checkIn,
  });
});

const deleteCheckIn = asyncHandler(async (req, res) => {
  const deleted = await CheckIn.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!deleted) {
    throw new AppError("Mood entry not found.", 404);
  }

  res.json({
    message: "Mood entry deleted.",
  });
});

module.exports = {
  createCheckIn,
  listCheckIns,
  getCheckInById,
  updateCheckIn,
  deleteCheckIn,
};
