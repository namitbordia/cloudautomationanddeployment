const express = require("express");
const { getCommunityInsights } = require("../controllers/communityController");

const router = express.Router();

router.get("/insights", getCommunityInsights);

module.exports = router;
