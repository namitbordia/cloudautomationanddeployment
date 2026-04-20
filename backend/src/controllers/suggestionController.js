const asyncHandler = require("../utils/asyncHandler");
const { buildSuggestionPayloadForUser } = require("../utils/checkInService");

const getSuggestions = asyncHandler(async (req, res) => {
  const { mood, journalNote = "" } = req.body;

  const payload = await buildSuggestionPayloadForUser(req.user._id, mood, journalNote);

  res.json({
    message: "Suggestions generated.",
    data: payload,
  });
});

module.exports = { getSuggestions };
