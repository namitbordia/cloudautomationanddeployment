const express = require("express");
const authenticateAnonymous = require("../middleware/authenticateAnonymous");
const validateRequest = require("../middleware/validateRequest");
const { taskPayloadValidator } = require("../validators/taskValidators");
const { listTasks, createTask, toggleTask } = require("../controllers/taskController");

const router = express.Router();

router.get("/", authenticateAnonymous, listTasks);
router.post("/", authenticateAnonymous, taskPayloadValidator, validateRequest, createTask);
router.patch("/:id/toggle", authenticateAnonymous, toggleTask);

module.exports = router;
