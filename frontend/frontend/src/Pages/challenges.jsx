import { useState } from "react";
import Layout from "../components/Layout";
import { TrophyIcon, CheckIcon, SparklesIcon, FlameIcon } from "../components/Icons";

function Challenges() {
  const [activeTab, setActiveTab] = useState("Active");
  const [completedDays, setCompletedDays] = useState({
    c1: [1, 2, 3],
    c2: [1, 2, 4],
    c3: [1],
  });

  const toggleDay = (challengeId, dayNum) => {
    setCompletedDays((prev) => {
      const current = prev[challengeId] || [];
      if (current.includes(dayNum)) {
        return { ...prev, [challengeId]: current.filter((d) => d !== dayNum) };
      } else {
        return { ...prev, [challengeId]: [...current, dayNum] };
      }
    });
  };

  const challengesList = [
    {
      id: "c1",
      title: "7-Day Mindful Morning Ritual",
      tag: "Daily Routine",
      duration: "7 Days",
      icon: "🌅",
      color: "var(--apple-orange)",
      description: "Start each morning with 3 conscious deep breaths before checking your phone, and write down 1 thing you are grateful for.",
      totalDays: 7,
      badge: "Early Zen Master",
    },
    {
      id: "c2",
      title: "Digital Sunset: 1-Hour Screen-Free",
      tag: "Sleep & Recovery",
      duration: "7 Days",
      icon: "🌙",
      color: "var(--apple-purple)",
      description: "Turn off screens 60 minutes before bed. Swap scrolling for calming music, reading, or gentle stretching.",
      totalDays: 7,
      badge: "Nocturnal Serenity",
    },
    {
      id: "c3",
      title: "Daily 5-Min Box Breathing Habit",
      tag: "Breathwork Mastery",
      duration: "14 Days",
      icon: "🌬️",
      color: "var(--apple-green)",
      description: "Complete one 5-minute box breathing session every afternoon to reset stress levels and recharge mental stamina.",
      totalDays: 14,
      badge: "Breathwork Virtuoso",
    },
  ];

  return (
    <Layout>
      <div className="page-content">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <TrophyIcon size={14} color="var(--apple-gold)" />
            <span>Habit Quests & Streaks</span>
          </div>
          <h1>Mindful Wellness Challenges</h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
            Build unshakable emotional fitness with bite-sized daily mindful challenges and unlock achievement trophies.
          </p>
        </div>

        {/* Top Active Challenges Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "36px" }}>
          {challengesList.map((ch) => {
            const completed = completedDays[ch.id] || [];
            const percent = Math.round((completed.length / ch.totalDays) * 100);

            return (
              <div
                key={ch.id}
                className="glass-card glass-card glass-glow"
                style={{
                  padding: "28px",
                  borderRadius: "26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "18px",
                        background: "rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
                      }}
                    >
                      {ch.icon}
                    </div>

                    <div>
                      <span className="glass-pill" style={{ fontSize: "0.75rem", color: "var(--apple-teal)" }}>
                        {ch.tag} • {ch.duration}
                      </span>
                      <h2 style={{ fontSize: "1.25rem", margin: "4px 0 2px" }}>{ch.title}</h2>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {percent}%
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {completed.length} of {ch.totalDays} Days Done
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  {ch.description}
                </p>

                {/* Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "999px",
                    background: "rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percent}%`,
                      background: "var(--grad-mint)",
                      borderRadius: "999px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                {/* Day Check-in Circles */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                  {Array.from({ length: ch.totalDays }, (_, i) => i + 1).map((dayNum) => {
                    const isDone = completed.includes(dayNum);
                    return (
                      <button
                        key={dayNum}
                        onClick={() => toggleDay(ch.id, dayNum)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "12px",
                          padding: 0,
                          background: isDone ? "var(--apple-green)" : "rgba(255, 255, 255, 0.06)",
                          color: isDone ? "#072714" : "var(--text-secondary)",
                          border: isDone ? "1px solid rgba(255,255,255,0.6)" : "1px solid var(--glass-border-subtle)",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all var(--transition-fast)",
                          boxShadow: isDone ? "0 4px 12px rgba(48,209,88,0.35)" : "none",
                        }}
                        title={`Day ${dayNum}: ${isDone ? "Completed" : "Tap to complete"}`}
                      >
                        {isDone ? <CheckIcon size={16} /> : `D${dayNum}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trophies & Milestones Cabinet */}
        <div>
          <h2 style={{ marginBottom: "16px" }}>🏆 Achievement Trophy Case</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            {[
              { title: "Early Zen Master", unlocked: true, icon: "🌅", desc: "Completed 3 morning ritual check-ins" },
              { title: "Mindful Streaker", unlocked: true, icon: "🔥", desc: "Achieved a 3-day continuous streak" },
              { title: "Deep Breather", unlocked: true, icon: "🍃", desc: "Completed 5 box breathing practices" },
              { title: "Serenity Seeker", unlocked: false, icon: "👑", desc: "Log moods for 14 consecutive days" },
            ].map((t, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  textAlign: "center",
                  opacity: t.unlocked ? 1 : 0.45,
                  border: t.unlocked ? "1px solid rgba(255, 214, 10, 0.3)" : "1px solid var(--glass-border-subtle)",
                }}
              >
                <div style={{ fontSize: "2.4rem", marginBottom: "6px" }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: t.unlocked ? "var(--apple-gold)" : "var(--text-muted)" }}>
                  {t.title}
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {t.desc}
                </p>
                <span className="glass-pill" style={{ marginTop: "10px", fontSize: "0.72rem" }}>
                  {t.unlocked ? "Unlocked ✨" : "Locked 🔒"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Challenges;