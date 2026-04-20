const CheckIn = require("../models/CheckIn");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const {
  buildExamCorrelation,
  buildInsights,
  buildMonthlyDistributionRow,
  buildWeeklyTrendRows,
  findMostFrequentMood,
  weekdayLabels,
} = require("../utils/moodAnalytics");

const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - 6);
  weekStart.setUTCHours(0, 0, 0, 0);

  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const userMatch = { userId: req.user._id };

  const [recentCheckIns, tasks, weeklyTrendRaw, monthlyDistributionRaw, stressedWeekdayRaw, examCorrelationRaw] = await Promise.all([
    CheckIn.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10),
    Task.find({ userId: req.user._id }).sort({ dueDate: 1 }),
    CheckIn.aggregate([
      {
        $match: {
          ...userMatch,
          createdAt: { $gte: weekStart, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            weekday: { $dayOfWeek: "$createdAt" },
          },
          happy: { $sum: { $cond: [{ $eq: ["$mood", "happy"] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ["$mood", "neutral"] }, 1, 0] } },
          stressed: { $sum: { $cond: [{ $eq: ["$mood", "stressed"] }, 1, 0] } },
          sad: { $sum: { $cond: [{ $eq: ["$mood", "sad"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]),
    CheckIn.aggregate([
      {
        $match: {
          ...userMatch,
          createdAt: { $gte: monthStart, $lt: nextMonthStart },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          happy: { $sum: { $cond: [{ $eq: ["$mood", "happy"] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ["$mood", "neutral"] }, 1, 0] } },
          stressed: { $sum: { $cond: [{ $eq: ["$mood", "stressed"] }, 1, 0] } },
          sad: { $sum: { $cond: [{ $eq: ["$mood", "sad"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]),
    CheckIn.aggregate([
      {
        $match: {
          ...userMatch,
          mood: "stressed",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]),
    CheckIn.aggregate([
      { $match: userMatch },
      {
        $lookup: {
          from: "tasks",
          let: {
            uid: "$userId",
            checkInAt: "$createdAt",
            examWindowEnd: {
              $dateAdd: {
                startDate: "$createdAt",
                unit: "day",
                amount: 3,
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$uid"] },
                    { $eq: ["$type", "exam"] },
                    { $gte: ["$dueDate", "$$checkInAt"] },
                    { $lte: ["$dueDate", "$$examWindowEnd"] },
                  ],
                },
              },
            },
          ],
          as: "nearbyExams",
        },
      },
      {
        $addFields: {
          nearExam: { $gt: [{ $size: "$nearbyExams" }, 0] },
        },
      },
      {
        $group: {
          _id: "$nearExam",
          happy: { $sum: { $cond: [{ $eq: ["$mood", "happy"] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ["$mood", "neutral"] }, 1, 0] } },
          stressed: { $sum: { $cond: [{ $eq: ["$mood", "stressed"] }, 1, 0] } },
          sad: { $sum: { $cond: [{ $eq: ["$mood", "sad"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]),
  ]);

  const weeklyTrend = buildWeeklyTrendRows(weeklyTrendRaw);
  const monthlyDistribution = buildMonthlyDistributionRow(monthlyDistributionRaw[0], now);
  const mostFrequentMood = findMostFrequentMood(weeklyTrend, monthlyDistribution);
  const moodVsExamCorrelation = buildExamCorrelation(examCorrelationRaw);
  const stressedWeekdayBreakdown = stressedWeekdayRaw.map((entry) => ({
    day: weekdayLabels[entry._id - 1],
    count: entry.count,
  }));
  const insights = buildInsights({
    stressedWeekdays: stressedWeekdayBreakdown,
    mostFrequentMood,
    examCorrelation: moodVsExamCorrelation,
  });

  res.json({
    message: "Dashboard fetched.",
    data: {
      analytics: {
        weeklyTrend,
        monthlyDistribution,
        mostFrequentMood,
        moodVsExamCorrelation,
        stressedWeekdayBreakdown,
        insights,
      },
      recentCheckIns,
      tasks,
    },
  });
});

module.exports = { getDashboard };
