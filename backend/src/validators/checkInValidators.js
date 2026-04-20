const { body } = require("express-validator");

const moodValidator = body("mood")
  .isIn(["happy", "neutral", "stressed", "sad"])
  .withMessage("Mood must be one of: happy, neutral, stressed, sad.");

const journalValidator = body("journalNote")
  .optional()
  .isString()
  .isLength({ max: 500 })
  .withMessage("Journal note must be 500 characters or fewer.");

const checkInPayloadValidator = [moodValidator, journalValidator];

module.exports = {
  checkInPayloadValidator,
};
