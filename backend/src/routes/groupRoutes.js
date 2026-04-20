const express = require("express");
const { body } = require("express-validator");
const authenticateAnonymous = require("../middleware/authenticateAnonymous");
const validateRequest = require("../middleware/validateRequest");
const {
  createGroup,
  joinGroup,
  listGroups,
  listGroupMessages,
  createGroupMessage,
} = require("../controllers/groupController");

const router = express.Router();

const createGroupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Group name is required.")
    .isLength({ max: 80 })
    .withMessage("Group name must be 80 characters or fewer."),
  body("interest")
    .trim()
    .notEmpty()
    .withMessage("Interest is required.")
    .isLength({ max: 50 })
    .withMessage("Interest must be 50 characters or fewer."),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 280 })
    .withMessage("Description must be 280 characters or fewer."),
];

const createMessageValidator = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ max: 400 })
    .withMessage("Message must be 400 characters or fewer."),
];

router.get("/", authenticateAnonymous, listGroups);
router.post("/", authenticateAnonymous, createGroupValidator, validateRequest, createGroup);
router.post("/:id/join", authenticateAnonymous, joinGroup);
router.get("/:id/messages", authenticateAnonymous, listGroupMessages);
router.post("/:id/messages", authenticateAnonymous, createMessageValidator, validateRequest, createGroupMessage);

module.exports = router;
