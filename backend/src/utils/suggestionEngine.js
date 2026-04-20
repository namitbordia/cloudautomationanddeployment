const suggestionRules = [
  {
    id: "stressed-breathing",
    when: ({ mood }) => mood === "stressed",
    suggestions: [
      "Try a 4-4-4 breathing cycle for 5 minutes before restarting work.",
      "Pick one study block of 25 minutes instead of tackling everything at once.",
    ],
  },
  {
    id: "stressed-study-tips",
    when: ({ mood, urgentTasksCount }) => mood === "stressed" && urgentTasksCount > 0,
    suggestions: [
      "You have a close deadline. Start with the nearest exam or assignment first.",
      "Write a tiny study plan: review, practice, then rest.",
    ],
  },
  {
    id: "sad-motivation",
    when: ({ mood }) => mood === "sad",
    suggestions: [
      "Take one small win today: finish a short task and acknowledge it.",
      "Read or save a motivational quote, playlist, or note that usually helps you reset.",
    ],
  },
  {
    id: "happy-journaling",
    when: ({ mood }) => mood === "happy",
    suggestions: [
      "Capture what is going well today in a short journal note.",
      "Write down one habit or routine that helped create this good mood.",
    ],
  },
  {
    id: "heavy-workload",
    when: ({ pendingTasksCount }) => pendingTasksCount >= 4,
    suggestions: [
      "Your workload looks heavy. Break big tasks into smaller next steps.",
    ],
  },
  {
    id: "sleep-aware",
    when: ({ journalNote }) => (journalNote || "").toLowerCase().match(/sleep|tired|exhausted/),
    suggestions: [
      "Energy may be affecting your mood. Consider rest, hydration, and a lighter study sprint.",
    ],
  },
  {
    id: "exam-aware",
    when: ({ journalNote }) => (journalNote || "").toLowerCase().includes("exam"),
    suggestions: [
      "Try active recall or one timed practice set instead of rereading notes passively.",
    ],
  },
];

function runSuggestionRules(context) {
  return suggestionRules
    .filter((rule) => rule.when(context))
    .flatMap((rule) => rule.suggestions);
}

function buildSuggestions(context) {
  const suggestions = runSuggestionRules(context);

  if (!suggestions.length) {
    return ["Check in again tomorrow to build a steady wellness habit."];
  }

  return [...new Set(suggestions)];
}

module.exports = {
  suggestionRules,
  buildSuggestions,
};
