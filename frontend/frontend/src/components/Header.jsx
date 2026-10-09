import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon, SunIcon, MoonIcon } from "./Icons";

export default function Header({ onOpenAiChat }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [greeting, setGreeting] = useState("Welcome");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
      setDateStr(
        new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      );
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials from name
  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "HS";

  return (
    <header className="app-header">
      {/* Left: Greeting */}
      <div>
        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>{greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</span>
          <span>{user?.avatar || "🌿"}</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "1px" }}>
          {dateStr} · HealthSaathi Mindful Space
        </div>
      </div>

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* AI Button */}
        <button
          onClick={onOpenAiChat}
          style={{
            background: "linear-gradient(135deg, rgba(255,55,95,0.15), rgba(191,90,242,0.18), rgba(10,132,255,0.18))",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex", alignItems: "center", gap: "7px",
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(191,90,242,0.22)",
            transition: "all var(--t-fast)",
          }}
        >
          <SparklesIcon size={15} color="var(--teal)" />
          <span>Ask AI</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          style={{
            width: "36px", height: "36px", borderRadius: "50%", padding: 0,
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-inner)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {theme === "dark"
            ? <SunIcon size={16} color="var(--yellow)" />
            : <MoonIcon size={16} color="var(--indigo)" />}
        </button>

        {/* Profile Pill */}
        <Link
          to="/profile"
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "5px 14px 5px 6px", borderRadius: "999px",
            background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
            color: "var(--text-primary)", textDecoration: "none",
            boxShadow: "var(--shadow-inner)",
            fontSize: "0.85rem", fontWeight: 600,
            transition: "all var(--t-fast)",
          }}
        >
          {/* Avatar */}
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "var(--grad-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: user?.avatar && user.avatar !== "🌿" ? "1rem" : "0.72rem",
            fontWeight: 800, color: "#fff",
          }}>
            {user?.avatar !== "🌿" ? user?.avatar : initials}
          </div>
          <span>{user?.name?.split(" ")[0] || "Account"}</span>
        </Link>
      </div>
    </header>
  );
}
