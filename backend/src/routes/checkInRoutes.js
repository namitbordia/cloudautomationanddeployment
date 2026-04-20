const express = require("express");
const authenticateAnonymous = require("../middleware/authenticateAnonymous");
const validateRequest = require("../middleware/validateRequest");
const { checkInPayloadValidator } = require("../validators/checkInValidators");
const {
  createCheckIn,
  listCheckIns,
  getCheckInById,
  updateCheckIn,
  deleteCheckIn,
} = require("../controllers/checkInController");

const router = express.Router();

router.get("/", authenticateAnonymous, listCheckIns);
router.post("/", authenticateAnonymous, checkInPayloadValidator, validateRequest, createCheckIn);
router.get("/:id", authenticateAnonymous, getCheckInById);
router.put("/:id", authenticateAnonymous, checkInPayloadValidator, validateRequest, updateCheckIn);
router.delete("/:id", authenticateAnonymous, deleteCheckIn);

module.exports = router;
