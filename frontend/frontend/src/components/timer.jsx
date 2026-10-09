import React from "react";

function Timer({ sessionTime }) {
  const mins = Math.floor(sessionTime / 60);
  const secs = (sessionTime % 60).toString().padStart(2, "0");

  return (
    <div
      style={{
        textAlign: "center",
        margin: "12px 0 20px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "var(--text-secondary)",
          background: "rgba(255, 255, 255, 0.06)",
          padding: "6px 18px",
          borderRadius: "999px",
          border: "1px solid var(--glass-border-subtle)",
          letterSpacing: "0.05em",
        }}
      >
        ⏳ Remaining: {mins}:{secs}
      </span>
    </div>
  );
}

export default Timer;