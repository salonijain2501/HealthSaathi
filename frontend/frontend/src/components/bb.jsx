import { useState, useEffect, useRef } from "react";
import Timer from "./timer";
import BreathingCircle from "./breathingcircle";
import bell from "../assets/bell.mp3";
import {
  PlayIcon,
  PauseIcon,
  RefreshIcon,
  BellIcon,
  PlusIcon,
  MinusIcon,
  SparklesIcon,
} from "./Icons";

function Bb() {
  const [level, setLevel] = useState("Normal");
  const [duration, setDuration] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const breathingLevels = {
    Beginner: 4,
    Normal: 5,
    Advanced: 6,
  };

  const durationValue = breathingLevels[level];

  const phases = [
    { name: "Inhale", duration: durationValue, text: "Breathe in deeply through your nose 🌬️" },
    { name: "Hold", duration: durationValue, text: "Hold your breath calmly ✨" },
    { name: "Exhale", duration: durationValue, text: "Release slowly through your mouth 🍃" },
    { name: "Hold", duration: durationValue, text: "Rest before the next breath 🧘" },
  ];

  const bellAudio = useRef(new Audio(bell));

  const playBell = () => {
    if (soundEnabled) {
      try {
        bellAudio.current.currentTime = 0;
        bellAudio.current.play().catch(() => {});
      } catch (e) {
        console.log(e);
      }
    }
  };

  const increaseDuration = () => {
    if (duration < 30) setDuration((prev) => prev + 1);
  };

  const decreaseDuration = () => {
    if (duration > 1) setDuration((prev) => prev - 1);
  };

  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phase, setPhase] = useState("Ready");
  const [count, setCount] = useState(durationValue);
  const [sessionTime, setSessionTime] = useState(duration * 60);

  const startSession = () => {
    setIsRunning(true);
    setPhaseIndex(0);
    setPhase(phases[0].name);
    setCount(phases[0].duration);
    setSessionTime(duration * 60);
    playBell();
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setPhase("Ready");
    setCount(durationValue);
    setSessionTime(duration * 60);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setPhase("Completed 🎉");
          playBell();
          return 0;
        }
        return prev - 1;
      });

      setCount((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        const nextIndex = (phaseIndex + 1) % phases.length;
        setPhaseIndex(nextIndex);
        setPhase(phases[nextIndex].name);
        playBell();
        return phases[nextIndex].duration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phaseIndex, durationValue]);

  return (
    <div
      className="glass-card glass-card glass-glow"
      style={{
        padding: "36px 32px",
        borderRadius: "28px",
        background: "linear-gradient(135deg, rgba(22, 28, 48, 0.8) 0%, rgba(13, 17, 30, 0.92) 100%)",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 35px rgba(100, 210, 255, 0.15)",
        marginTop: "20px",
      }}
    >
      {/* Level Selector */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "14px", color: "var(--text-secondary)" }}>
          Select Breathing Pace
        </h3>

        <div
          style={{
            display: "inline-flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "Beginner", icon: "🌱", label: "Beginner", time: "4 sec pace" },
            { id: "Normal", icon: "😌", label: "Normal", time: "5 sec pace" },
            { id: "Advanced", icon: "🔥", label: "Advanced", time: "6 sec pace" },
          ].map((item) => {
            const active = level === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isRunning) {
                    setLevel(item.id);
                    setCount(breathingLevels[item.id]);
                  }
                }}
                className="glass-card interactive"
                style={{
                  padding: "12px 20px",
                  borderRadius: "var(--radius-md)",
                  minWidth: "120px",
                  cursor: isRunning ? "not-allowed" : "pointer",
                  background: active ? "rgba(10, 132, 255, 0.22)" : "rgba(255, 255, 255, 0.04)",
                  border: active ? "2px solid var(--apple-blue)" : "1px solid var(--glass-border-subtle)",
                  boxShadow: active ? "0 8px 20px rgba(10,132,255,0.3)" : "none",
                  opacity: isRunning && !active ? 0.4 : 1,
                  transition: "all var(--transition-fast)",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "2px" }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: active ? "#ffffff" : "var(--text-primary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Duration Stepper & Chime Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        {/* Minutes Stepper */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 255, 255, 0.06)",
            padding: "6px 14px",
            borderRadius: "999px",
            border: "1px solid var(--glass-border-subtle)",
          }}
        >
          <button
            onClick={decreaseDuration}
            disabled={isRunning}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              padding: 0,
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
            }}
          >
            <MinusIcon size={16} />
          </button>

          <span style={{ fontWeight: 700, fontSize: "1rem", minWidth: "90px", textAlign: "center" }}>
            {duration} Minutes
          </span>

          <button
            onClick={increaseDuration}
            disabled={isRunning}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              padding: 0,
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
            }}
          >
            <PlusIcon size={16} />
          </button>
        </div>

        {/* Chime Bell Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            background: soundEnabled ? "rgba(48, 209, 88, 0.18)" : "rgba(255, 255, 255, 0.06)",
            border: soundEnabled ? "1px solid rgba(48, 209, 88, 0.4)" : "1px solid var(--glass-border-subtle)",
            color: soundEnabled ? "var(--apple-green)" : "var(--text-muted)",
            borderRadius: "999px",
            padding: "8px 16px",
            fontSize: "0.85rem",
          }}
        >
          <BellIcon size={16} />
          <span>Bell Chime: {soundEnabled ? "On" : "Off"}</span>
        </button>
      </div>

      {/* Main Breathing Phase Indicator */}
      <div style={{ textAlign: "center" }}>
        <div
          className="glass-pill"
          style={{
            fontSize: "1.1rem",
            padding: "8px 24px",
            fontWeight: 700,
            color: phase === "Inhale" ? "var(--apple-teal)" : phase === "Exhale" ? "var(--apple-green)" : "var(--apple-purple)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          {phase === "Ready" ? "Ready to Breathe" : phase}
        </div>

        {/* Apple Expanding Circle */}
        <BreathingCircle phase={phase} />

        {/* Large Seconds Count */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "4.5rem",
            fontWeight: 800,
            lineHeight: 1,
            color: "var(--text-primary)",
            margin: "4px 0",
            textShadow: "0 0 30px rgba(10, 132, 255, 0.35)",
          }}
        >
          {count}
        </div>

        {/* Phase subtitle instruction */}
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", minHeight: "26px" }}>
          {phases[phaseIndex]?.text || "Sit comfortably and relax your shoulders."}
        </p>

        {/* Remaining Session Chronometer */}
        <Timer sessionTime={sessionTime} />
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          marginTop: "16px",
          flexWrap: "wrap",
        }}
      >
        {!isRunning ? (
          <button
            onClick={startSession}
            className="btn-primary"
            style={{
              padding: "14px 32px",
              borderRadius: "var(--radius-md)",
              fontSize: "1.05rem",
            }}
          >
            <PlayIcon size={18} />
            <span>Begin Session</span>
          </button>
        ) : (
          <button
            onClick={pauseSession}
            className="btn-glass"
            style={{
              padding: "14px 32px",
              borderRadius: "var(--radius-md)",
              fontSize: "1.05rem",
            }}
          >
            <PauseIcon size={18} />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={resetSession}
          className="btn-glass"
          style={{
            padding: "14px 24px",
            borderRadius: "var(--radius-md)",
            fontSize: "1.05rem",
          }}
        >
          <RefreshIcon size={18} />
          <span>Reset</span>
        </button>
      </div>

      {/* Completed Celebration Card */}
      {phase === "Completed 🎉" && (
        <div
          className="glass-card"
          style={{
            marginTop: "32px",
            padding: "24px",
            background: "linear-gradient(135deg, rgba(48, 209, 88, 0.2) 0%, rgba(100, 210, 255, 0.15) 100%)",
            border: "1px solid rgba(48, 209, 88, 0.4)",
            textAlign: "center",
            animation: "slideUpFade 0.4s var(--ease-apple) forwards",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎉</div>
          <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "6px" }}>
            Session Completed!
          </h2>
          <p style={{ color: "var(--text-primary)", fontSize: "1rem" }}>
            Wonderful work! You dedicated {duration} mindful minutes to your inner peace today.
          </p>
        </div>
      )}
    </div>
  );
}

export default Bb;