const CheckIn = require("../models/CheckIn");
const asyncHandler = require("../utils/asyncHandler");
const { emptyMoodCounts } = require("../utils/moodAnalytics");

const getCommunityInsights = asyncHandler(async (_req, res) => {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const minimumSampleSize = Number(process.env.COMMUNITY_MIN_SAMPLE_SIZE || 5);

  const [allTimeResults, todayResults] = await Promise.all([
    CheckIn.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.preferences.allowCommunityAggregation": true } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
    ]),
    CheckIn.aggregate([
      { $match: { createdAt: { $gte: todayStart } } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.preferences.allowCommunityAggregation": true } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
    ]),
  ]);

  const moodBreakdown = emptyMoodCounts();
  const todayMoodBreakdown = emptyMoodCounts();

  allTimeResults.forEach((item) => {
    moodBreakdown[item._id] = item.count;
  });

  todayResults.forEach((item) => {
    todayMoodBreakdown[item._id] = item.count;
  });

  const total = Object.values(moodBreakdown).reduce((sum, value) => sum + value, 0);
  const todayTotal = Object.values(todayMoodBreakdown).reduce((sum, value) => sum + value, 0);
  const stressedTodayPercent = todayTotal
    ? Math.round((todayMoodBreakdown.stressed / todayTotal) * 100)
    : 0;

  const publicSummary =
    todayTotal >= minimumSampleSize
      ? `${stressedTodayPercent}% of users feel stressed today`
      : "Not enough anonymous data today to safely show a public summary.";

  res.json({
    message: "Community insights fetched.",
    data: {
      totalCheckIns: total,
      moodBreakdown,
      today: {
        totalCheckIns: todayTotal,
        moodBreakdown: todayMoodBreakdown,
        stressedPercent: stressedTodayPercent,
        publicSummary,
        isPublicSampleReady: todayTotal >= minimumSampleSize,
      },
    },
  });
});

module.exports = { getCommunityInsights };
