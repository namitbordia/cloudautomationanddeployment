const Task = require("../models/Task");
const { buildSuggestions } = require("./suggestionEngine");

async function computeSuggestionsForUser(userId, mood, journalNote) {
  const pendingTasks = await Task.find({
    userId,
    completed: false,
  });

  const now = new Date();
  const urgentTasksCount = pendingTasks.filter((task) => {
    const diff = new Date(task.dueDate).getTime() - now.getTime();
    const daysLeft = diff / (1000 * 60 * 60 * 24);
    return daysLeft <= 3;
  }).length;

  return buildSuggestions({
    mood,
    journalNote,
    pendingTasksCount: pendingTasks.length,
    urgentTasksCount,
  });
}

async function buildSuggestionPayloadForUser(userId, mood, journalNote = "") {
  const suggestions = await computeSuggestionsForUser(userId, mood, journalNote);

  return {
    mood,
    journalNote,
    suggestions,
  };
}

module.exports = { computeSuggestionsForUser, buildSuggestionPayloadForUser };
