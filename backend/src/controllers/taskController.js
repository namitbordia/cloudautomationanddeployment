const Task = require("../models/Task");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).sort({ dueDate: 1 });
  res.json({
    message: "Events fetched.",
    data: tasks,
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, type, dueDate } = req.body;

  const task = await Task.create({
    userId: req.user._id,
    title,
    type,
    dueDate,
  });

  res.status(201).json({
    message: "Event created.",
    data: task,
  });
});

const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!task) {
    throw new AppError("Event not found.", 404);
  }

  task.completed = !task.completed;
  await task.save();

  res.json({
    message: "Event updated.",
    data: task,
  });
});

module.exports = { listTasks, createTask, toggleTask };
