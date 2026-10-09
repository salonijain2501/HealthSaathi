import React from "react";

function BreathingCircle({ phase }) {
  const getPhaseStyles = () => {
    switch (phase) {
      case "Inhale":
        return {
          scale: 1.35,
          color: "rgba(100, 210, 255, 0.75)",
          ringColor: "rgba(10, 132, 255, 0.4)",
          glow: "0 0 60px rgba(10, 132, 255, 0.6), 0 0 100px rgba(100, 210, 255, 0.3)",
          text: "Inhale gently...",
        };
      case "Hold":
        return {
          scale: 1.35,
          color: "rgba(191, 90, 242, 0.75)",
          ringColor: "rgba(191, 90, 242, 0.4)",
          glow: "0 0 60px rgba(191, 90, 242, 0.6), 0 0 100px rgba(255, 55, 95, 0.3)",
          text: "Hold breath...",
        };
      case "Exhale":
        return {
          scale: 0.85,
          color: "rgba(48, 209, 88, 0.75)",
          ringColor: "rgba(48, 209, 88, 0.4)",
          glow: "0 0 50px rgba(48, 209, 88, 0.5), 0 0 80px rgba(100, 210, 255, 0.2)",
          text: "Release smoothly...",
        };
      default:
        return {
          scale: 1,
          color: "rgba(255, 255, 255, 0.35)",
          ringColor: "rgba(255, 255, 255, 0.15)",
          glow: "0 0 30px rgba(255, 255, 255, 0.15)",
          text: "Get ready...",
        };
    }
  };

  const style = getPhaseStyles();

  return (
    <div
      style={{
        position: "relative",
        width: "260px",
        height: "260px",
        margin: "30px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer Pulse Ring */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `2px dashed ${style.ringColor}`,
          transform: `scale(${style.scale * 1.15})`,
          transition: "all 4s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: 0.7,
        }}
      />

      {/* Secondary Glow Orb */}
      <div
        style={{
          position: "absolute",
          width: "190px",
          height: "190px",
          borderRadius: "50%",
          background: style.color,
          filter: "blur(28px)",
          transform: `scale(${style.scale})`,
          transition: "all 4s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: 0.5,
        }}
      />

      {/* Main Glass Petal Circle */}
      <div
        style={{
          position: "relative",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, ${style.color} 70%, rgba(0, 0, 0, 0.3) 100%)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transform: `scale(${style.scale})`,
          boxShadow: `${style.glow}, inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.3)`,
          transition: "all 4s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "2px solid rgba(255, 255, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "2.2rem",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
            transition: "transform 0.5s ease",
          }}
        >
          {phase === "Inhale" ? "🌬️" : phase === "Hold" ? "✨" : phase === "Exhale" ? "🍃" : "🧘"}
        </div>
      </div>
    </div>
  );
}

export default BreathingCircle;