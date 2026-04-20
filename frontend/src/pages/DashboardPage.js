import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import MetricCard from "../components/MetricCard";
import SectionHeader from "../components/SectionHeader";
import { useWellness } from "../state/WellnessContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const chartColors = {
  happy: "#679289",
  neutral: "#efc56c",
  stressed: "#f28c6f",
  sad: "#8ba6c9",
};

function DashboardPage() {
  const { dashboard, community, loading } = useWellness();

  const analytics = dashboard?.analytics || {};
  const weeklyTrend = analytics.weeklyTrend || [];
  const monthlyDistribution = analytics.monthlyDistribution || {
    month: "",
    moodCounts: { happy: 0, neutral: 0, stressed: 0, sad: 0 },
  };
  const moodVsExamCorrelation = analytics.moodVsExamCorrelation || {
    nearExam: { happy: 0, neutral: 0, stressed: 0, sad: 0 },
    noExamNearby: { happy: 0, neutral: 0, stressed: 0, sad: 0 },
  };
  const communityBreakdown = community?.moodBreakdown || {
    happy: 0,
    neutral: 0,
    stressed: 0,
    sad: 0,
  };
  const todayCommunity = community?.today || {
    totalCheckIns: 0,
    stressedPercent: 0,
    publicSummary: "Not enough anonymous data today to safely show a public summary.",
    isPublicSampleReady: false,
  };

  const completedCount = (dashboard?.tasks || []).filter((task) => task.completed).length;
  const mostFrequentMood = analytics.mostFrequentMood?.mood || "n/a";

  const weeklyTrendData = {
    labels: weeklyTrend.map((item) => item.label),
    datasets: [
      {
        label: "Stressed",
        data: weeklyTrend.map((item) => item.moodCounts.stressed),
        borderColor: chartColors.stressed,
        backgroundColor: "rgba(242, 140, 111, 0.22)",
        tension: 0.35,
        fill: true,
      },
      {
        label: "Happy",
        data: weeklyTrend.map((item) => item.moodCounts.happy),
        borderColor: chartColors.happy,
        backgroundColor: "rgba(103, 146, 137, 0.18)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const monthlyDistributionData = {
    labels: Object.keys(monthlyDistribution.moodCounts),
    datasets: [
      {
        data: Object.values(monthlyDistribution.moodCounts),
        backgroundColor: Object.keys(monthlyDistribution.moodCounts).map((key) => chartColors[key]),
        borderWidth: 0,
      },
    ],
  };

  const examCorrelationData = {
    labels: ["Happy", "Neutral", "Stressed", "Sad"],
    datasets: [
      {
        label: "Near exam",
        data: [
          moodVsExamCorrelation.nearExam.happy,
          moodVsExamCorrelation.nearExam.neutral,
          moodVsExamCorrelation.nearExam.stressed,
          moodVsExamCorrelation.nearExam.sad,
        ],
        backgroundColor: "rgba(33, 104, 105, 0.78)",
        borderRadius: 10,
      },
      {
        label: "No exam nearby",
        data: [
          moodVsExamCorrelation.noExamNearby.happy,
          moodVsExamCorrelation.noExamNearby.neutral,
          moodVsExamCorrelation.noExamNearby.stressed,
          moodVsExamCorrelation.noExamNearby.sad,
        ],
        backgroundColor: "rgba(239, 197, 108, 0.72)",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="pageStack">
      <SectionHeader
        eyebrow="Dashboard"
        title="Your wellness analytics snapshot"
        description="Track weekly trends, monthly distribution, dominant mood patterns, and how check-ins shift near exams."
      />

      <section className="metricsGrid">
        <MetricCard label="Recent check-ins" value={dashboard?.recentCheckIns?.length || 0} tone="warm" />
        <MetricCard label="Upcoming events" value={dashboard?.tasks?.length || 0} tone="cool" />
        <MetricCard label="Completed events" value={completedCount} tone="sage" />
        <MetricCard label="Most frequent mood" value={mostFrequentMood} tone="peach" />
      </section>

      <section className="chartGrid">
        <article className="panelCard chartCard">
          <h3>Weekly mood trends</h3>
          <div className="chartWrap">
            <Line
              data={weeklyTrendData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
            />
          </div>
        </article>

        <article className="panelCard chartCard">
          <h3>Monthly mood distribution</h3>
          <div className="chartWrap">
            <Doughnut
              data={monthlyDistributionData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                cutout: "62%",
              }}
            />
          </div>
          <p className="muted">Distribution for {monthlyDistribution.month || "this month"}.</p>
        </article>
      </section>

      <section className="chartGrid">
        <article className="panelCard chartCard">
          <h3>Mood vs exam correlation</h3>
          <div className="chartWrap">
            <Bar
              data={examCorrelationData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
            />
          </div>
        </article>

        <article className="panelCard">
          <h3>Generated insights</h3>
          {analytics.insights?.length ? (
            <ul className="insightList">
              {analytics.insights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">More check-ins will unlock stronger pattern detection.</p>
          )}

          <div className="publicSummaryCard">
            <strong>Community snapshot</strong>
            <p>{todayCommunity.publicSummary}</p>
            <small>
              {todayCommunity.isPublicSampleReady
                ? `Based on ${todayCommunity.totalCheckIns} anonymous check-ins today.`
                : "Public summaries appear only after the minimum privacy threshold is met."}
            </small>
          </div>

          <div className="communityFacts">
            {Object.entries(communityBreakdown).map(([mood, value]) => (
              <div key={mood} className="communityFact">
                <strong>{value}</strong>
                <span>{mood}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panelCard">
        <h3>Recent mood history</h3>
        {loading && !dashboard ? (
          <p className="muted">Loading dashboard...</p>
        ) : dashboard?.recentCheckIns?.length ? (
          <div className="historyGrid">
            {dashboard.recentCheckIns.map((entry) => (
              <article key={entry._id} className="historyCard">
                <strong>{entry.mood}</strong>
                <p>{entry.journalNote || "No journal note added."}</p>
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No recent check-ins yet. Add one from the Check-In page.</p>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
