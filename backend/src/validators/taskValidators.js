const { body } = require("express-validator");

const taskPayloadValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Event title is required.")
    .isLength({ max: 120 })
    .withMessage("Event title must be 120 characters or fewer."),
  body("type")
    .isIn(["exam", "assignment"])
    .withMessage("Event type must be exam or assignment."),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601()
    .withMessage("Due date must be a valid ISO date."),
];

module.exports = {
  taskPayloadValidator,
};
