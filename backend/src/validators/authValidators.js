const { body } = require("express-validator");

const createAnonymousSessionValidator = [
  body("allowCommunityAggregation")
    .optional()
    .isBoolean()
    .withMessage("allowCommunityAggregation must be a boolean."),
];

module.exports = {
  createAnonymousSessionValidator,
};
