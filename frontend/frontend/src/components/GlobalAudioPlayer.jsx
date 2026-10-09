import React from "react";
import { useAudio } from "../context/AudioContext";
import { PlayIcon, PauseIcon, CloseIcon, VolumeIcon, VolumeMuteIcon } from "./Icons";

export default function GlobalAudioPlayer() {
  const { currentSound, isPlaying, volume, resumeSound, pauseSound, stopSound, setVolume } = useAudio();

  if (!currentSound) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        animation: "slideUpFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "10px 20px",
          borderRadius: "9999px",
          background: "rgba(18, 24, 38, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.55), 0 0 30px rgba(10, 132, 255, 0.25)",
          backdropFilter: "blur(30px) saturate(200%)",
          WebkitBackdropFilter: "blur(30px) saturate(200%)",
          minWidth: "320px",
          maxWidth: "92vw",
        }}
      >
        {/* Sound Emoji & Equalizer */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
            }}
          >
            {currentSound.emoji || "🎵"}
          </div>

          {isPlaying && (
            <div className="eq-bars" style={{ height: "18px" }}>
              <div className="eq-bar" style={{ height: "14px" }} />
              <div className="eq-bar" style={{ height: "18px" }} />
              <div className="eq-bar" style={{ height: "10px" }} />
              <div className="eq-bar" style={{ height: "16px" }} />
            </div>
          )}
        </div>

        {/* Track details */}
        <div style={{ flex: 1, minWidth: "100px", overflow: "hidden" }}>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentSound.title}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {isPlaying ? "Playing Ambiance" : "Paused"}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Play/Pause Button */}
          <button
            onClick={isPlaying ? pauseSound : resumeSound}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              padding: 0,
              background: "var(--grad-primary)",
              color: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(10, 132, 255, 0.4)",
            }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </button>

          {/* Volume slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }} className="volume-slider-box">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.75)}
              style={{
                background: "transparent",
                border: "none",
                padding: "4px",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {volume === 0 ? <VolumeMuteIcon size={16} /> : <VolumeIcon size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: "60px",
                height: "4px",
                padding: 0,
                cursor: "pointer",
                accentColor: "var(--apple-blue)",
              }}
            />
          </div>

          {/* Close / Stop */}
          <button
            onClick={stopSound}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "var(--text-muted)",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Stop & Close"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
