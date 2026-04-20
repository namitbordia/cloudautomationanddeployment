const express = require("express");
const { createAnonymousSession } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { createAnonymousSessionValidator } = require("../validators/authValidators");

const router = express.Router();

router.post("/anonymous", createAnonymousSessionValidator, validateRequest, createAnonymousSession);

module.exports = router;
