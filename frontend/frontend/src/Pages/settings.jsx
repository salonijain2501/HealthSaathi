import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { SettingsIcon, SunIcon, MoonIcon, BellIcon, SparklesIcon, CheckIcon } from "../components/Icons";

function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [ambientAurora, setAmbientAurora] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [defaultDuration, setDefaultDuration] = useState("5");
  const [savedMessage, setSavedMessage] = useState("");

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSave = () => {
    setSavedMessage("Settings saved successfully! ✨");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear local cache and settings? Your account will remain safe.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="page-content" style={{ maxWidth: "860px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <SettingsIcon size={14} color="var(--text-secondary)" />
            <span>Preferences & Customization</span>
          </div>
          <h1>App Settings</h1>
          <p style={{ fontSize: "1rem", marginTop: "4px" }}>
            Tailor your HealthSaathi sensory experience, appearance, soundscapes, and data preferences.
          </p>
        </div>

        {savedMessage && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(48, 209, 88, 0.2)",
              border: "1px solid rgba(48, 209, 88, 0.4)",
              color: "var(--apple-green)",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckIcon size={16} />
            <span>{savedMessage}</span>
          </div>
        )}

        {/* Group 1: Appearance */}
        <div className="glass-card" style={{ padding: "26px", marginBottom: "24px", borderRadius: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "18px" }}>🎨 Visuals & Appearance</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Theme Selector */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Glass Theme Mode</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Choose between Liquid Obsidian Dark or Light Crystal</div>
              </div>

              <div className="seg-control">
                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`seg-item ${theme === "dark" ? "active" : ""}`}
                >
                  <MoonIcon size={14} /> Dark Obsidian
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`seg-item ${theme === "light" ? "active" : ""}`}
                >
                  <SunIcon size={14} /> Light Crystal
                </button>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--glass-border-subtle)" }} />

            {/* Ambient Aurora Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Ambient Aurora Mesh Glow</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Floating fluid mesh background gradients</div>
              </div>

              <input
                type="checkbox"
                checked={ambientAurora}
                onChange={(e) => setAmbientAurora(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--apple-blue)", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Group 2: Mindfulness & Breathing */}
        <div className="glass-card" style={{ padding: "26px", marginBottom: "24px", borderRadius: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "18px" }}>🧘 Mindfulness & Audio</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Default Session Length */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Default Box Breathing Duration</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Standard session timer when beginning practice</div>
              </div>

              <select
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(e.target.value)}
                style={{ borderRadius: "var(--radius-sm)", padding: "8px 14px" }}
              >
                <option value="3">3 Minutes</option>
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
              </select>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--glass-border-subtle)" }} />

            {/* Daily Reminder Notifications */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Mindful Daily Check-In Prompt</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Gentle notification to log mood and reflect</div>
              </div>

              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--apple-blue)", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Group 3: Privacy & Data */}
        <div className="glass-card" style={{ padding: "26px", marginBottom: "32px", borderRadius: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "18px" }}>🔒 Privacy & Security</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Local Cache & Data Management</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Clear cached settings and temporary files</div>
              </div>

              <button
                onClick={handleClearData}
                className="btn-danger"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: "12px 28px", borderRadius: "var(--radius-sm)" }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;