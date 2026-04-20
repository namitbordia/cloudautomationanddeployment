const express = require("express");
const authenticateAnonymous = require("../middleware/authenticateAnonymous");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", authenticateAnonymous, getDashboard);

module.exports = router;
