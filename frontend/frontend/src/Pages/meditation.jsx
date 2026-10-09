import Layout from "../components/Layout";
import Bb from "../components/bb";
import { LotusIcon, SparklesIcon, HeartIcon } from "../components/Icons";

function Meditation() {
  return (
    <Layout>
      <div className="page-content" style={{ maxWidth: "920px" }}>
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "12px" }}>
            <LotusIcon size={14} color="var(--apple-green)" />
            <span>Mindfulness & Breathwork</span>
          </div>
          <h1>Mindful Box Breathing</h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
            Regulate your autonomic nervous system with the scientifically-proven 4-4-4-4 rhythm. Lower stress, sharpen focus, and regain tranquility.
          </p>
        </div>

        {/* Breathing Box Component */}
        <Bb />

        {/* Breathwork Tips Glass Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
            marginTop: "32px",
          }}
        >
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>🌬️</div>
            <h3 style={{ fontSize: "1rem", marginBottom: "4px" }}>Inhale Through Nose</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Engage your diaphragm to allow maximum oxygen intake and trigger the relaxation response.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>✨</div>
            <h3 style={{ fontSize: "1rem", marginBottom: "4px" }}>Still the Mind</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              During the hold phases, soften your eyes and gently observe physical sensations without judgment.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>🌿</div>
            <h3 style={{ fontSize: "1rem", marginBottom: "4px" }}>Smooth Exhale</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Release physical tension in your jaw, neck, and shoulders with every slow exhale.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Meditation;