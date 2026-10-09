import React from "react";
import { PlayIcon, PauseIcon } from "./Icons";

function RelaxCard({
  sound,
  onPlay,
  currentSound,
  isPlaying,
}) {
  const active = currentSound?.id === sound.id && isPlaying;

  return (
    <div
      onClick={() => onPlay(sound)}
      className="glass-card glass-card interactive"
      style={{
        padding: "24px 20px",
        borderRadius: "22px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        background: active
          ? "linear-gradient(135deg, rgba(191, 90, 242, 0.2) 0%, rgba(10, 132, 255, 0.2) 100%)"
          : "var(--glass-surface)",
        border: active
          ? "2px solid var(--apple-blue)"
          : "1px solid var(--glass-border)",
        boxShadow: active
          ? "0 12px 30px rgba(10, 132, 255, 0.35), inset 0 1px 1px rgba(255,255,255,0.4)"
          : "var(--glass-shadow-sm)",
        transform: active ? "scale(1.03)" : "none",
        transition: "all var(--transition-normal)",
      }}
    >
      {/* Sound Emoji in Glass Ring */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "20px",
          background: active ? "var(--grad-primary)" : "rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          boxShadow: active
            ? "0 8px 20px rgba(10, 132, 255, 0.4), inset 0 1px 1px rgba(255,255,255,0.6)"
            : "inset 0 1px 1px rgba(255,255,255,0.2)",
          transition: "all var(--transition-fast)",
        }}
      >
        {sound.emoji || "🎵"}
      </div>

      {/* Sound Title & Category */}
      <div>
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: active ? "#ffffff" : "var(--text-primary)",
            marginBottom: "4px",
          }}
        >
          {sound.title}
        </h3>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {active ? "Currently Playing" : "Tap to Play"}
        </span>
      </div>

      {/* Equalizer Wave / Action Button */}
      <div style={{ width: "100%", marginTop: "4px" }}>
        {active ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "rgba(10, 132, 255, 0.25)",
              borderRadius: "999px",
              border: "1px solid rgba(10, 132, 255, 0.4)",
            }}
          >
            <div className="eq-bars" style={{ height: "14px" }}>
              <div className="eq-bar" style={{ height: "10px" }} />
              <div className="eq-bar" style={{ height: "14px" }} />
              <div className="eq-bar" style={{ height: "8px" }} />
              <div className="eq-bar" style={{ height: "12px" }} />
            </div>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ffffff" }}>
              Playing
            </span>
          </div>
        ) : (
          <button
            className="btn-glass"
            style={{
              width: "100%",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "0.85rem",
            }}
          >
            <PlayIcon size={14} />
            <span>Play Sound</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default RelaxCard;