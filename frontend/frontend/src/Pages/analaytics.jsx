import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";
import MoodGraph from "../components/MoodGraph";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { AnalyticsIcon, HeartIcon, FlameIcon, LotusIcon, SparklesIcon } from "../components/Icons";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement);

function Analaytics() {
  const [stats, setStats] = useState([]);
  const [graphMoods, setGraphMoods] = useState([]);
  const [streak, setStreak] = useState(3);
  const [timeRange, setTimeRange] = useState("Weekly");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, graphRes, streakRes] = await Promise.allSettled([
          API.get("/mood/stats"),
          API.get("/mood/graph"),
          API.get("/mood/streak"),
        ]);
        if (statsRes.status === "fulfilled" && statsRes.value?.data) setStats(statsRes.value.data);
        if (graphRes.status === "fulfilled" && graphRes.value?.data) setGraphMoods(graphRes.value.data);
        if (streakRes.status === "fulfilled" && streakRes.value?.data) setStreak(streakRes.value.data.streak || 3);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAnalytics();
  }, []);

  const doughnutData = {
    labels: stats.length > 0 ? stats.map((s) => s._id) : ["Happy", "Calm", "Anxious", "Sad", "Angry"],
    datasets: [
      {
        data: stats.length > 0 ? stats.map((s) => s.count) : [12, 8, 4, 2, 1],
        backgroundColor: [
          "#30d158",
          "#64d2ff",
          "#ffd60a",
          "#bf5af2",
          "#ff453a",
        ],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.75)",
          padding: 16,
          font: { family: "Plus Jakarta Sans", size: 12 },
        },
      },
    },
  };

  return (
    <Layout>
      <div className="page-content">
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <AnalyticsIcon size={14} color="var(--apple-teal)" />
            <span>Health Insights & Trends</span>
          </div>
          <h1>Mental Wellness Analytics</h1>
          <p style={{ fontSize: "1rem", marginTop: "4px" }}>
            Comprehensive metrics and emotional equilibrium trends powered by HealthSaathi intelligence.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div className="glass-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Equilibrium Score</span>
              <HeartIcon size={20} color="var(--apple-pink)" />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "8px 0 4px" }}>
              88<span style={{ fontSize: "1rem", color: "var(--apple-green)" }}>/100</span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--apple-green)" }}>↑ 6% higher than last week</span>
          </div>

          <div className="glass-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Consistency Streak</span>
              <FlameIcon size={20} color="var(--apple-orange)" />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "8px 0 4px" }}>
              {streak} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>Days</span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Mindful daily check-in</span>
          </div>

          <div className="glass-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Mindful Minutes</span>
              <LotusIcon size={20} color="var(--apple-green)" />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "8px 0 4px" }}>
              45 <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>Mins</span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--apple-teal)" }}>9 box breathing sessions</span>
          </div>

          <div className="glass-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Calm Ratio</span>
              <SparklesIcon size={20} color="var(--apple-purple)" />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "8px 0 4px" }}>
              74<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>%</span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--apple-teal)" }}>Optimal relaxation zone</span>
          </div>
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Emotional Trajectory Bar Chart */}
          <div className="glass-card" style={{ padding: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <h2>📊 Emotional Trajectory</h2>
                <p style={{ fontSize: "0.85rem" }}>Daily mood level variations</p>
              </div>
              <div className="seg-control">
                <button
                  onClick={() => setTimeRange("Weekly")}
                  className={`seg-item ${timeRange === "Weekly" ? "active" : ""}`}
                  style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange("Monthly")}
                  className={`seg-item ${timeRange === "Monthly" ? "active" : ""}`}
                  style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div style={{ height: "260px" }}>
              <MoodGraph moods={graphMoods} />
            </div>
          </div>

          {/* Emotion Distribution Doughnut */}
          <div className="glass-card" style={{ padding: "26px" }}>
            <h2>🎯 Emotion Distribution</h2>
            <p style={{ fontSize: "0.85rem", marginBottom: "16px" }}>
              Breakdown of logged feelings
            </p>

            <div style={{ height: "240px", position: "relative" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* AI Mental Health Summary */}
        <div
          className="glass-card glass-card glass-glow"
          style={{
            padding: "26px",
            background: "linear-gradient(135deg, rgba(191, 90, 242, 0.12) 0%, rgba(10, 132, 255, 0.1) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "var(--grad-intelligence)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <SparklesIcon size={18} />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>HealthSaathi Wellness Summary</h3>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
            Your data demonstrates strong emotional resilience with 74% of your week spent in positive (Happy & Calm) states. Brief anxious intervals are effectively managed following your breathwork routines. Keep up the 5-minute morning sessions to maintain peak equilibrium!
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Analaytics;