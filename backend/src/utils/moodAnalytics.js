const moodOrder = ["happy", "neutral", "stressed", "sad"];
const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function emptyMoodCounts() {
  return {
    happy: 0,
    neutral: 0,
    stressed: 0,
    sad: 0,
  };
}

function sortMoodsByFrequency(moodCounts) {
  return Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
}

function buildWeeklyTrendRows(records) {
  return records.map((entry) => ({
    date: `${entry._id.year}-${String(entry._id.month).padStart(2, "0")}-${String(entry._id.day).padStart(2, "0")}`,
    label: `${weekdayLabels[entry._id.weekday - 1].slice(0, 3)} ${entry._id.day}`,
    moodCounts: {
      happy: entry.happy,
      neutral: entry.neutral,
      stressed: entry.stressed,
      sad: entry.sad,
    },
    total: entry.total,
  }));
}

function buildMonthlyDistributionRow(record, referenceDate) {
  const monthIndex = (record?._id?.month || referenceDate.getUTCMonth() + 1) - 1;

  return {
    month: monthLabels[monthIndex],
    moodCounts: {
      happy: record?.happy || 0,
      neutral: record?.neutral || 0,
      stressed: record?.stressed || 0,
      sad: record?.sad || 0,
    },
    total: record?.total || 0,
  };
}

function buildExamCorrelation(records) {
  const mapped = {
    nearExam: emptyMoodCounts(),
    noExamNearby: emptyMoodCounts(),
  };

  records.forEach((entry) => {
    const bucket = entry._id.nearExam ? "nearExam" : "noExamNearby";
    mapped[bucket] = {
      happy: entry.happy,
      neutral: entry.neutral,
      stressed: entry.stressed,
      sad: entry.sad,
    };
  });

  return mapped;
}

function findMostFrequentMood(weeklyRows, monthlyRow) {
  const source = weeklyRows.length
    ? weeklyRows.reduce((acc, item) => {
        moodOrder.forEach((mood) => {
          acc[mood] += item.moodCounts[mood];
        });
        return acc;
      }, emptyMoodCounts())
    : monthlyRow.moodCounts;

  const [mood, count] = sortMoodsByFrequency(source)[0] || ["neutral", 0];
  return { mood, count };
}

function buildInsights({ stressedWeekdays, mostFrequentMood, examCorrelation }) {
  const insights = [];

  if (stressedWeekdays.length && stressedWeekdays[0].count > 0) {
    insights.push(`User is mostly stressed on ${stressedWeekdays[0].day}.`);
  }

  if (mostFrequentMood.count > 0) {
    insights.push(`Most frequent mood this period is ${mostFrequentMood.mood}.`);
  }

  const nearExamStressed = examCorrelation.nearExam.stressed || 0;
  const noExamStressed = examCorrelation.noExamNearby.stressed || 0;

  if (nearExamStressed > noExamStressed) {
    insights.push("Stress appears higher when exams are within the next 3 days.");
  } else if (nearExamStressed > 0) {
    insights.push("Stress is present near exams, but it is not higher than other periods.");
  }

  if (!insights.length) {
    insights.push("Not enough data yet. More regular check-ins will unlock clearer patterns.");
  }

  return insights;
}

module.exports = {
  emptyMoodCounts,
  buildWeeklyTrendRows,
  buildMonthlyDistributionRow,
  buildExamCorrelation,
  findMostFrequentMood,
  buildInsights,
  weekdayLabels,
};
