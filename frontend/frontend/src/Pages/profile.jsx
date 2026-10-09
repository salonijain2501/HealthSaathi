import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import API from "../api/axios";
import { updateProfile, changePassword, deleteAccount } from "../Services/auth.api";

// ── Avatar options ───────────────────────────────────────────
const AVATARS = [
  "🌿", "🧘", "🌸", "🌊", "🦋", "✨", "🌙", "☀️",
  "🍃", "🌺", "🦁", "🐬", "🌈", "❄️", "🔥", "💫",
  "🪷", "🌻", "🌍", "⚡", "🎯", "💎", "🕊️", "🌵",
];

// ── Password strength ────────────────────────────────────────
function getStrength(p) {
  if (!p) return { score: 0, label: "", color: "transparent" };
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const levels = [
    { label: "Very weak", color: "#ff453a" },
    { label: "Weak",      color: "#ff9f0a" },
    { label: "Fair",      color: "#ffd60a" },
    { label: "Good",      color: "#30d158" },
    { label: "Strong",    color: "#5ac8fa" },
    { label: "Very strong", color: "#bf5af2" },
  ];
  return { score: s, ...levels[Math.min(s, 5)] };
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ emoji, label, value, color }) {
  return (
    <div className="glass-card" style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{emoji}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: color || "var(--text-primary)" }}>{value}</div>
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="glass-card" style={{ marginBottom: "24px" }}>
      <h3 style={{ marginBottom: "20px", color: "var(--text-primary)", fontSize: "1.05rem", fontWeight: 700 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Alert Banner ─────────────────────────────────────────────
function Alert({ type, msg }) {
  if (!msg) return null;
  const styles = {
    success: { bg: "rgba(48,209,88,0.14)", border: "rgba(48,209,88,0.3)", color: "var(--green)" },
    error:   { bg: "rgba(255,55,95,0.14)", border: "rgba(255,55,95,0.3)",  color: "var(--pink)" },
  };
  const s = styles[type];
  return (
    <div style={{
      padding: "10px 14px", borderRadius: "var(--r-sm)",
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, fontSize: "0.85rem", marginBottom: "16px",
    }}>
      {type === "success" ? "✅ " : "⚠️ "}{msg}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
export default function Profile() {
  const { user, logout, updateLocalUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  // Stats
  const [stats, setStats] = useState({ moods: 0, streak: 0, entries: [] });

  // Edit profile form
  const [name, setName]   = useState(user?.name  || "");
  const [bio, setBio]     = useState(user?.bio   || "");
  const [avatar, setAvatar] = useState(user?.avatar || "🌿");
  const [editLoading, setEditLoading]   = useState(false);
  const [editMsg, setEditMsg]           = useState({ type: "", msg: "" });

  // Password form
  const [curPass, setCurPass]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confPass, setConfPass] = useState("");
  const [showCur, setShowCur]   = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [passLoading, setPassLoading]   = useState(false);
  const [passMsg, setPassMsg]           = useState({ type: "", msg: "" });

  // Delete account
  const [delPass, setDelPass]   = useState("");
  const [delInput, setDelInput] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [delMsg, setDelMsg]     = useState({ type: "", msg: "" });
  const [showDelModal, setShowDelModal] = useState(false);

  // Sync form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "🌿");
    }
  }, [user]);

  // Load stats
  useEffect(() => {
    const load = async () => {
      const [s, st] = await Promise.allSettled([
        API.get("/mood/stats"),
        API.get("/mood/streak"),
      ]);
      const moodCount = s.status === "fulfilled"
        ? (s.value.data || []).reduce((acc, i) => acc + i.count, 0)
        : 0;
      const streak    = st.status === "fulfilled" ? (st.value.data.streak || 0) : 0;
      setStats({ moods: moodCount, streak });
    };
    load();
  }, []);

  // ── Handlers ───────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setEditMsg({ type: "error", msg: "Name cannot be empty." });
    setEditLoading(true);
    setEditMsg({ type: "", msg: "" });
    try {
      const res = await updateProfile({ name: name.trim(), bio: bio.trim(), avatar });
      updateLocalUser(res.data.user);
      setEditMsg({ type: "success", msg: "Profile updated successfully!" });
    } catch (err) {
      setEditMsg({ type: "error", msg: err.response?.data?.message || "Update failed." });
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confPass) return setPassMsg({ type: "error", msg: "New passwords do not match." });
    if (newPass.length < 6) return setPassMsg({ type: "error", msg: "Password must be at least 6 characters." });
    setPassLoading(true);
    setPassMsg({ type: "", msg: "" });
    try {
      await changePassword({ currentPassword: curPass, newPassword: newPass });
      setPassMsg({ type: "success", msg: "Password updated successfully!" });
      setCurPass(""); setNewPass(""); setConfPass("");
      if (refreshUser) refreshUser();
    } catch (err) {
      setPassMsg({ type: "error", msg: err.response?.data?.message || "Password update failed." });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (delInput !== "DELETE") return setDelMsg({ type: "error", msg: 'Type "DELETE" exactly to confirm.' });
    setDelLoading(true);
    setDelMsg({ type: "", msg: "" });
    try {
      await deleteAccount({ password: delPass, confirm: delInput });
      logout();
      navigate("/login");
    } catch (err) {
      setDelMsg({ type: "error", msg: err.response?.data?.message || "Delete failed. Check credentials." });
      setDelLoading(false);
    }
  };

  const strength = getStrength(newPass);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  // ── Tabs ───────────────────────────────────────────────────
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "edit",     label: "Edit Profile" },
    { id: "security", label: "Security" },
    { id: "danger",   label: "⚠️ Account" },
  ];

  return (
    <Layout>
      <div className="page-content">

        {/* ── Hero Card ────────────────────────────────────── */}
        <div className="glass-card glass-glow" style={{
          padding: "36px 40px",
          marginBottom: "28px",
          background: "linear-gradient(135deg, rgba(20,30,58,0.82) 0%, rgba(12,18,38,0.9) 100%)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "28px",
        }}>
          {/* Avatar large */}
          <div style={{
            width: "90px", height: "90px", borderRadius: "28px",
            background: "var(--grad-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.8rem", flexShrink: 0,
            boxShadow: "0 12px 36px rgba(10,132,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            border: "2px solid var(--glass-border-bright)",
          }}>
            {user?.avatar || "🌿"}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
              <h1 style={{ fontSize: "1.9rem" }}>{user?.name || "—"}</h1>
              <span className="glass-pill" style={{ color: "var(--green)", borderColor: "rgba(48,209,88,0.3)" }}>
                ✅ Verified
              </span>
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "8px" }}>
              {user?.email}
            </div>
            {user?.bio && (
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontStyle: "italic", maxWidth: "500px" }}>
                "{user.bio}"
              </p>
            )}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
              <span className="glass-pill" style={{ color: "var(--text-muted)", fontSize: "0.76rem" }}>
                📅 Member since {memberSince}
              </span>
              <span className="glass-pill" style={{ color: "var(--orange)", borderColor: "rgba(255,159,10,0.3)", fontSize: "0.76rem" }}>
                🔥 {stats.streak} day streak
              </span>
              <span className="glass-pill" style={{ color: "var(--teal)", borderColor: "rgba(90,200,250,0.3)", fontSize: "0.76rem" }}>
                📊 {stats.moods} moods logged
              </span>
            </div>
          </div>

          <button
            onClick={() => setTab("edit")}
            className="btn-glass"
            style={{ padding: "9px 20px", fontSize: "0.87rem", alignSelf: "flex-start" }}
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* ── Tab Bar ──────────────────────────────────────── */}
        <div className="seg-control" style={{ marginBottom: "24px" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`seg-item${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div>
            {/* Stats Grid */}
            <h2 style={{ marginBottom: "16px" }}>📊 Your Wellbeing Stats</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              <StatCard emoji="📓" label="Moods Logged"    value={stats.moods}   color="var(--blue)" />
              <StatCard emoji="🔥" label="Day Streak"      value={stats.streak}  color="var(--orange)" />
              <StatCard emoji="🧘" label="Member Since"    value={memberSince.split(" ")[1]} color="var(--purple)" />
              <StatCard emoji="💚" label="Wellness Level"  value="Active"        color="var(--green)" />
            </div>

            {/* Profile details card */}
            <Section title="👤 Profile Details">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                {[
                  { label: "Full Name",  value: user?.name },
                  { label: "Email Address", value: user?.email },
                  { label: "Bio / Tagline", value: user?.bio || "No bio set yet." },
                  { label: "Member Since",  value: memberSince },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>
                      {value || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Mindful values */}
            <Section title="🌱 Mindful Commitments">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {[
                  { emoji: "🧘", text: "Daily meditation practice" },
                  { emoji: "📓", text: "Honest mood journaling" },
                  { emoji: "💤", text: "Quality sleep hygiene" },
                  { emoji: "🌊", text: "Mindful breathing exercises" },
                  { emoji: "📵", text: "Digital detox moments" },
                  { emoji: "🤝", text: "Compassionate self-talk" },
                ].map(({ emoji, text }) => (
                  <div key={text} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 14px", borderRadius: "var(--r-sm)",
                    background: "var(--glass-bg-subtle)",
                    border: "1px solid var(--glass-border-subtle)",
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB: EDIT PROFILE
        ════════════════════════════════════════════════════ */}
        {tab === "edit" && (
          <Section title="✏️ Edit Your Profile">
            <Alert type={editMsg.type} msg={editMsg.msg} />

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* Avatar Picker */}
              <div>
                <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "12px", color: "var(--text-secondary)" }}>
                  Choose Your Avatar
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        fontSize: "1.3rem", cursor: "pointer",
                        background: avatar === a ? "rgba(10,132,255,0.2)" : "var(--glass-bg-subtle)",
                        border: avatar === a ? "2px solid var(--blue)" : "1px solid var(--glass-border-subtle)",
                        transition: "all var(--t-fast)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: avatar === a ? "scale(1.15)" : "scale(1)",
                        boxShadow: avatar === a ? "0 0 16px rgba(10,132,255,0.3)" : "none",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "14px",
                    background: "var(--grad-primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", boxShadow: "0 6px 18px rgba(10,132,255,0.3)",
                  }}>
                    {avatar}
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Preview — this will show in your sidebar and header
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  maxLength={60}
                />
              </div>

              {/* Bio */}
              <div>
                <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                  Bio / Tagline <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional, max 200 chars)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="A short description about yourself or your wellness journey…"
                  maxLength={200}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", textAlign: "right" }}>
                  {bio.length} / 200
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                  Email Address <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(cannot be changed)</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  style={{ opacity: 0.55, cursor: "not-allowed" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn-primary"
                  style={{ padding: "12px 28px", fontSize: "0.93rem" }}
                >
                  {editLoading ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-glass"
                  onClick={() => {
                    setName(user?.name || "");
                    setBio(user?.bio || "");
                    setAvatar(user?.avatar || "🌿");
                    setEditMsg({ type: "", msg: "" });
                  }}
                  style={{ padding: "12px 22px", fontSize: "0.93rem" }}
                >
                  Reset
                </button>
              </div>
            </form>
          </Section>
        )}

        {/* ════════════════════════════════════════════════════
            TAB: SECURITY
        ════════════════════════════════════════════════════ */}
        {tab === "security" && (
          <div>
            <Section title={user?.hasPassword !== false ? "🔒 Change Password" : "🔒 Set Account Password"}>
              <Alert type={passMsg.type} msg={passMsg.msg} />
              {user?.hasPassword === false && (
                <div style={{ fontSize: "0.85rem", color: "var(--teal)", marginBottom: "16px", padding: "10px 14px", borderRadius: "var(--r-sm)", background: "rgba(100,210,255,0.1)", border: "1px solid rgba(100,210,255,0.25)" }}>
                  💡 Your account is linked with Google. You can optionally set a password below to allow email/password login as well.
                </div>
              )}
              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "480px" }}>

                {/* Current Password (only required if user already has a password) */}
                {user?.hasPassword !== false && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                      Current Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCur ? "text" : "password"}
                        value={curPass}
                        onChange={e => setCurPass(e.target.value)}
                        placeholder="Your current password"
                        required
                        autoComplete="current-password"
                        style={{ paddingRight: "56px" }}
                      />
                      <button type="button" onClick={() => setShowCur(!showCur)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", padding: "4px" }}>
                        {showCur ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      autoComplete="new-password"
                      style={{ paddingRight: "56px" }}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", padding: "4px" }}>
                      {showNew ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  {newPass && (
                    <div style={{ marginTop: "10px" }}>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
                        {[0, 1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: "4px", borderRadius: "999px",
                            background: i < strength.score ? strength.color : "var(--glass-border-subtle)",
                            transition: "all var(--t-fast)",
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: strength.color }}>
                        {strength.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confPass}
                    onChange={e => setConfPass(e.target.value)}
                    placeholder="Repeat your new password"
                    required
                    autoComplete="new-password"
                    style={{
                      borderColor: confPass && newPass !== confPass ? "rgba(255,55,95,0.6)" : undefined,
                    }}
                  />
                  {confPass && newPass !== confPass && (
                    <div style={{ fontSize: "0.78rem", color: "var(--pink)", marginTop: "4px" }}>
                      Passwords do not match
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="btn-primary"
                  style={{ width: "fit-content", padding: "12px 28px", fontSize: "0.93rem" }}
                >
                  {passLoading ? "Updating…" : "Change Password"}
                </button>
              </form>
            </Section>

            {/* Active Session Info */}
            <Section title="🛡️ Session Info">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {[
                  { label: "Token Expiry", value: "7 days from login" },
                  { label: "Auth Method",  value: "JWT Bearer Token" },
                  { label: "Encryption",   value: "bcrypt (12 rounds)" },
                  { label: "Transport",    value: "HTTPS / TLS" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: "14px", borderRadius: "var(--r-sm)", background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border-subtle)" }}>
                    <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB: DANGER ZONE
        ════════════════════════════════════════════════════ */}
        {tab === "danger" && (
          <div>
            {/* Logout Section */}
            <Section title="🚪 Sign Out">
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Sign out of your current session. Your data is safe and you can log back in anytime.
              </p>
              <button
                className="btn-glass"
                onClick={() => { logout(); navigate("/login"); }}
                style={{ padding: "11px 24px", fontSize: "0.93rem" }}
              >
                🚪 Sign Out Now
              </button>
            </Section>

            {/* Delete Account Section */}
            <div className="glass-card" style={{
              border: "1px solid rgba(255,55,95,0.35)",
              background: "rgba(255,55,95,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "11px",
                  background: "rgba(255,55,95,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0,
                }}>
                  ⚠️
                </div>
                <h3 style={{ color: "var(--pink)", fontSize: "1.05rem" }}>Delete Account</h3>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.6 }}>
                This action is <strong style={{ color: "var(--pink)" }}>permanent and irreversible</strong>.
                Your account, all logged moods, and all personal data will be deleted forever.
              </p>

              {!showDelModal ? (
                <button
                  className="btn-danger"
                  onClick={() => setShowDelModal(true)}
                  style={{ padding: "11px 24px", fontSize: "0.93rem" }}
                >
                  🗑️ Delete My Account
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "460px" }}>
                  <Alert type={delMsg.type} msg={delMsg.msg} />

                  {user?.hasPassword !== false && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
                        Confirm with your password
                      </label>
                      <input
                        type="password"
                        value={delPass}
                        onChange={e => setDelPass(e.target.value)}
                        placeholder="Your current password"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--pink)" }}>
                      Type <strong>DELETE</strong> to confirm
                    </label>
                    <input
                      type="text"
                      value={delInput}
                      onChange={e => setDelInput(e.target.value)}
                      placeholder='Type "DELETE" exactly'
                      style={{ borderColor: "rgba(255,55,95,0.4)" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      className="btn-danger"
                      onClick={handleDeleteAccount}
                      disabled={delLoading || delInput !== "DELETE" || !delPass}
                      style={{ padding: "11px 22px", fontSize: "0.9rem" }}
                    >
                      {delLoading ? "Deleting…" : "🗑️ Permanently Delete"}
                    </button>
                    <button
                      className="btn-glass"
                      onClick={() => { setShowDelModal(false); setDelPass(""); setDelInput(""); setDelMsg({ type: "", msg: "" }); }}
                      style={{ padding: "11px 20px", fontSize: "0.9rem" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}