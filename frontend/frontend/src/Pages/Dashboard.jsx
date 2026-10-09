import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import MoodGraph from "../components/MoodGraph";
import {
  SparklesIcon, FlameIcon, MoodIcon, LotusIcon,
  MusicIcon, TrophyIcon, ChevronRightIcon, HeartIcon,
} from "../components/Icons";

const moodEmoji = { Happy: "😊", Calm: "😌", Anxious: "😰", Sad: "😔", Angry: "😡", stressed: "😤" };
const moodColor = {
  Happy:   "rgba(48,209,88,0.18)",
  Calm:    "rgba(90,200,250,0.18)",
  Anxious: "rgba(255,214,10,0.18)",
  Sad:     "rgba(191,90,242,0.18)",
  Angry:   "rgba(255,69,58,0.18)",
};

const quickActions = [
  { title: "Log Mood",       sub: "Record your feelings",     Icon: MoodIcon,   gradient: "var(--grad-sunset)",   to: "/moodtracker" },
  { title: "Box Breathing",  sub: "Guided 4-4-4-4 rhythm",   Icon: LotusIcon,  gradient: "var(--grad-mint)",     to: "/meditation" },
  { title: "Relax Sounds",   sub: "Ambient rain & nature",    Icon: MusicIcon,  gradient: "var(--grad-aurora)",   to: "/relaxsounds" },
  { title: "Daily Challenge", sub: "Mindfulness quests",      Icon: TrophyIcon, gradient: "var(--grad-primary)",  to: "/challenges" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [graphMoods, setGraphMoods] = useState([]);
  const [analysis, setAnalysis] = useState("Reflecting on your emotional patterns…");
  const [streak, setStreak] = useState(1);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [g, a, s, st] = await Promise.allSettled([
        API.get("/mood/graph"),
        API.get("/mood/analysis"),
        API.get("/mood/streak"),
        API.get("/mood/stats"),
      ]);
      if (g.status === "fulfilled"  && g.value?.data)  setGraphMoods(g.value.data);
      if (a.status === "fulfilled"  && a.value?.data)  setAnalysis(a.value.data.suggestion || "Your emotional balance is thriving. Try 5 minutes of box breathing today.");
      if (s.status === "fulfilled"  && s.value?.data)  setStreak(s.value.data.streak || 1);
      if (st.status === "fulfilled" && st.value?.data) setStats(st.value.data);
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="page-content">

        {/* ── Hero Banner ── */}
        <div className="glass-card glass-glow" style={{
          padding: "32px 36px",
          marginBottom: "26px",
          background: "linear-gradient(135deg, rgba(20,30,58,0.8) 0%, rgba(12,18,38,0.88) 100%)",
          borderRadius: "24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}>
          <div style={{ maxWidth: "560px" }}>
            <span className="glass-pill" style={{ marginBottom: "12px", color: "var(--teal)", borderColor: "rgba(90,200,250,0.25)" }}>
              <HeartIcon size={13} color="var(--pink)" />
              Daily Mental Sanctuary
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "10px" }}>
              Welcome back to your Sanctuary ✨
            </h1>
            <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
              "Peace comes from within." Take a conscious breath and embrace today with clarity.
            </p>
          </div>

          <button
            onClick={() => navigate("/moodtracker")}
            className="btn-primary"
            style={{ padding: "13px 26px", borderRadius: "var(--r-md)", fontSize: "0.97rem" }}
          >
            Log Today's Mood
            <ChevronRightIcon size={18} />
          </button>
        </div>

        {/* ── Streak + AI Insight ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "22px", marginBottom: "26px" }}>
          {/* Streak */}
          <div className="glass-card" style={{
            display: "flex", alignItems: "center", gap: "20px",
            background: "linear-gradient(135deg, rgba(255,159,10,0.12), rgba(16,22,46,0.72))",
            border: "1px solid rgba(255,159,10,0.22)",
          }}>
            <div style={{
              width: "68px", height: "68px", borderRadius: "22px", flexShrink: 0,
              background: "var(--grad-sunset)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(255,159,10,0.42)",
            }}>
              <FlameIcon size={36} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--orange)", fontWeight: 700, marginBottom: "4px" }}>
                Active Mindfulness Streak
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                {streak} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>Day{streak !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                {streak >= 7 ? "🔥 Extraordinary!" : streak >= 3 ? "💪 Great momentum!" : "🌱 Keep going!"}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="glass-card glass-glow" style={{
            display: "flex", flexDirection: "column", gap: "14px",
            background: "linear-gradient(135deg, rgba(191,90,242,0.12), rgba(10,132,255,0.08), rgba(16,22,46,0.72))",
            border: "1px solid rgba(191,90,242,0.28)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "var(--grad-intelligence)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <SparklesIcon size={15} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.93rem" }}>AI Wellness Insight</span>
              </div>
              <span className="glass-pill" style={{ fontSize: "0.72rem", color: "var(--teal)" }}>Personalized</span>
            </div>

            <p style={{ fontSize: "0.93rem", color: "var(--text-primary)", lineHeight: 1.6, flex: 1 }}>
              {analysis}
            </p>

            <div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/meditation")} className="btn-glass" style={{ fontSize: "0.82rem", padding: "7px 14px" }}>
                🧘 Start Breathwork
              </button>
              <button onClick={() => navigate("/relaxsounds")} className="btn-glass" style={{ fontSize: "0.82rem", padding: "7px 14px" }}>
                🎵 Calming Sound
              </button>
            </div>
          </div>
        </div>

        {/* ── Mood Chart ── */}
        <div className="glass-card" style={{ padding: "28px", marginBottom: "26px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2>📊 Emotional Trajectory</h2>
              <p style={{ fontSize: "0.85rem", marginTop: "3px" }}>Your logged mood levels over recent days</p>
            </div>
            <div className="seg-control">
              <button className="seg-item active">Recent Days</button>
              <button className="seg-item" onClick={() => navigate("/analytics")}>Full Analytics →</button>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <MoodGraph moods={graphMoods} />
          </div>
        </div>

        {/* ── Mood Stats ── */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <h2>📈 Mood Breakdown</h2>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Total logged emotion counts</span>
          </div>

          {stats.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "14px" }}>
              {stats.map(item => (
                <div
                  key={item._id}
                  className="glass-card interactive"
                  style={{
                    padding: "18px",
                    background: moodColor[item._id] || "var(--glass-bg)",
                  }}
                >
                  <div style={{ fontSize: "1.75rem", marginBottom: "8px" }}>
                    {moodEmoji[item._id] || "🌿"}
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>{item._id}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                    {item.count} <span style={{ fontSize: "0.78rem", fontWeight: 400, color: "var(--text-muted)" }}>logs</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: "center", padding: "28px", color: "var(--text-muted)" }}>
              No mood entries yet. Start by logging how you feel right now! 😊
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 style={{ marginBottom: "14px" }}>⚡ Mindful Shortcuts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "14px" }}>
            {quickActions.map(({ title, sub, Icon, gradient, to }, idx) => (
              <div
                key={idx}
                onClick={() => navigate(to)}
                className="glass-card interactive"
                style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px" }}
              >
                <div style={{
                  width: "46px", height: "46px", borderRadius: "15px", flexShrink: 0,
                  background: gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
                }}>
                  <Icon size={22} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>{sub}</div>
                </div>
                <ChevronRightIcon size={17} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}