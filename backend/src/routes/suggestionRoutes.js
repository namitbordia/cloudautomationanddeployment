const express = require("express");
const authenticateAnonymous = require("../middleware/authenticateAnonymous");
const validateRequest = require("../middleware/validateRequest");
const { checkInPayloadValidator } = require("../validators/checkInValidators");
const { getSuggestions } = require("../controllers/suggestionController");

const router = express.Router();

router.post("/", authenticateAnonymous, checkInPayloadValidator, validateRequest, getSuggestions);

module.exports = router;
