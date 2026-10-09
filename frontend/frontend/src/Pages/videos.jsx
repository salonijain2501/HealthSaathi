import { useState } from "react";
import Layout from "../components/Layout";
import { VideoIcon, PlayIcon, CloseIcon, SparklesIcon, CheckIcon } from "../components/Icons";

function Videos() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Mindfulness", "Sleep", "Stress Relief", "Breathwork"];

  const videoList = [
    {
      id: 1,
      title: "10-Minute Morning Awakening Meditation",
      instructor: "Elena Rostova",
      duration: "10:24",
      category: "Mindfulness",
      views: "14.2K",
      thumbnailGradient: "linear-gradient(135deg, #0a84ff 0%, #5e5ce6 100%)",
      emoji: "🌅",
      description: "Start your day centered and grounded. Cultivate gratitude, expand awareness, and set clear intentions for the hours ahead.",
    },
    {
      id: 2,
      title: "Deep Sleep & Theta Wave Body Scan",
      instructor: "Dr. Marcus Vance",
      duration: "22:15",
      category: "Sleep",
      views: "28.9K",
      thumbnailGradient: "linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%)",
      emoji: "🌙",
      description: "Release somatic tension from head to toe with guided neuro-relaxation techniques designed to induce restorative slow-wave sleep.",
    },
    {
      id: 3,
      title: "Emergency Panic & Anxiety Reset",
      instructor: "Sarah Jenkins, LMFT",
      duration: "06:45",
      category: "Stress Relief",
      views: "45.1K",
      thumbnailGradient: "linear-gradient(135deg, #ff375f 0%, #ff9f0a 100%)",
      emoji: "🛡️",
      description: "A fast-acting somatic grounding exercise using the 5-4-3-2-1 method and physiological sighs to halt adrenaline surges immediately.",
    },
    {
      id: 4,
      title: "Mastering the 4-7-8 Breath Technique",
      instructor: "Ravi Sharma",
      duration: "12:30",
      category: "Breathwork",
      views: "19.3K",
      thumbnailGradient: "linear-gradient(135deg, #30d158 0%, #64d2ff 100%)",
      emoji: "🍃",
      description: "Learn how the ancient pranayama 4-7-8 technique stimulates the vagus nerve and down-regulates cortisol within minutes.",
    },
    {
      id: 5,
      title: "Midday Mental Recharge & Focus Boost",
      instructor: "Chloe Dubois",
      duration: "08:15",
      category: "Mindfulness",
      views: "11.7K",
      thumbnailGradient: "linear-gradient(135deg, #ffd60a 0%, #ff9f0a 100%)",
      emoji: "⚡",
      description: "Reset brain fog and mental fatigue midway through your workday with mindful sensory scanning and micro-stretches.",
    },
    {
      id: 6,
      title: "Bedtime Forest Rain Visualization",
      instructor: "HealthSaathi Studio",
      duration: "30:00",
      category: "Sleep",
      views: "36.4K",
      thumbnailGradient: "linear-gradient(135deg, #0a84ff 0%, #30d158 100%)",
      emoji: "🌧️",
      description: "Gentle guided imagery through a mist-covered pine forest accompanied by binaural rain frequencies for effortless slumber.",
    },
  ];

  const filteredVideos = activeCategory === "All"
    ? videoList
    : videoList.filter((v) => v.category === activeCategory);

  return (
    <Layout>
      <div className="page-content">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <VideoIcon size={14} color="var(--apple-pink)" />
            <span>Guided Masterclasses</span>
          </div>
          <h1>Mindful Video Studio</h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
            Expert-led guided sessions, somatic nervous system resets, and immersive sound visualizers.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
          <div className="seg-control">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`seg-item ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="glass-card glass-card interactive"
              style={{
                padding: "0",
                overflow: "hidden",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  height: "170px",
                  background: video.thumbnailGradient,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
                }}
              >
                <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
                  {video.emoji}
                </span>

                {/* Play Button Overlay */}
                <div
                  style={{
                    position: "absolute",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.45)",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  }}
                >
                  <PlayIcon size={20} />
                </div>

                {/* Duration Badge */}
                <span
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    background: "rgba(0, 0, 0, 0.65)",
                    backdropFilter: "blur(10px)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {video.duration}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: "20px" }}>
                <span className="glass-pill" style={{ fontSize: "0.75rem", color: "var(--apple-teal)", marginBottom: "8px" }}>
                  {video.category}
                </span>
                <h3 style={{ fontSize: "1.08rem", margin: "4px 0 6px", lineHeight: 1.4 }}>
                  {video.title}
                </h3>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                  <span>{video.instructor}</span>
                  <span>{video.views} mindful views</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "680px",
                padding: "32px",
                borderRadius: "28px",
                background: "rgba(16, 22, 38, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <CloseIcon size={16} />
              </button>

              {/* Simulated Ambient Player Stage */}
              <div
                style={{
                  width: "100%",
                  height: "260px",
                  borderRadius: "20px",
                  background: selectedVideo.thumbnailGradient,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  marginBottom: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                }}
              >
                <span style={{ fontSize: "4.5rem", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}>
                  {selectedVideo.emoji}
                </span>

                <div className="equalizer-bars" style={{ height: "24px", marginTop: "12px" }}>
                  <div className="equalizer-bar" style={{ height: "18px" }} />
                  <div className="equalizer-bar" style={{ height: "24px" }} />
                  <div className="equalizer-bar" style={{ height: "14px" }} />
                  <div className="equalizer-bar" style={{ height: "20px" }} />
                </div>
              </div>

              <span className="glass-pill" style={{ fontSize: "0.75rem", color: "var(--apple-teal)" }}>
                {selectedVideo.category} • {selectedVideo.duration}
              </span>
              <h2 style={{ fontSize: "1.4rem", margin: "8px 0 4px" }}>{selectedVideo.title}</h2>
              <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                Guided by {selectedVideo.instructor}
              </div>

              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {selectedVideo.description}
              </p>

              <button
                onClick={() => setSelectedVideo(null)}
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "24px",
                  padding: "13px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Complete Practice
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Videos;