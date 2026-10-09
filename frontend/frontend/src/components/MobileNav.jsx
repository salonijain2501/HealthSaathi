import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { haptics, resumeAudio } from "../utils/haptics";
import {
  HomeIcon, MoodIcon, LotusIcon, MusicIcon, UserIcon,
  AnalyticsIcon, BookIcon, VideoIcon, TrophyIcon, SettingsIcon,
} from "./Icons";

// ── Bottom nav items (5 main) ────────────────────────────────
const mainItems = [
  { to: "/dashboard",   label: "Home",      icon: HomeIcon,   color: "var(--blue)" },
  { to: "/moodtracker", label: "Mood",      icon: MoodIcon,   color: "var(--orange)" },
  { to: "/meditation",  label: "Meditate",  icon: LotusIcon,  color: "var(--green)" },
  { to: "/relaxsounds", label: "Sounds",    icon: MusicIcon,  color: "var(--purple)" },
  { to: "/profile",     label: "Profile",   icon: UserIcon,   color: "var(--blue)" },
];

// ── Drawer items (the rest) ──────────────────────────────────
const drawerItems = [
  { to: "/analytics",  label: "Analytics",     icon: AnalyticsIcon, color: "var(--teal)" },
  { to: "/challenges", label: "Challenges",    icon: TrophyIcon,    color: "var(--yellow)" },
  { to: "/books",      label: "Books & Wisdom",icon: BookIcon,      color: "var(--orange)" },
  { to: "/videos",     label: "Videos",        icon: VideoIcon,     color: "var(--pink)" },
  { to: "/settings",   label: "Settings",      icon: SettingsIcon,  color: "var(--text-muted)" },
];

// ── Hamburger Icon ───────────────────────────────────────────
function HamburgerIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <style>{`
        .hb-line { transition: all 0.32s cubic-bezier(0.16,1,0.3,1); transform-origin: center; }
      `}</style>
      <rect className="hb-line" x="2" y={open ? "10" : "5"}  width="18" height="2" rx="1"
        fill="currentColor"
        transform={open ? "rotate(45 11 11)" : ""}
      />
      <rect className="hb-line" x="2" y="10" width="18" height="2" rx="1"
        fill="currentColor"
        opacity={open ? 0 : 1}
      />
      <rect className="hb-line" x="2" y={open ? "10" : "15"} width="18" height="2" rx="1"
        fill="currentColor"
        transform={open ? "rotate(-45 11 11)" : ""}
      />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════
export default function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer  = () => { resumeAudio(); haptics.light(); setDrawerOpen(true); };
  const closeDrawer = () => { haptics.light(); setDrawerOpen(false); };

  const handleNavTap = () => { resumeAudio(); haptics.light(); };

  const handleLogout = () => {
    haptics.medium();
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ── Bottom Navigation Bar ─────────────────────────── */}
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        <div className="bottom-nav-inner">
          {mainItems.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavTap}
              className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
            >
              {({ isActive }) => (
                <>
                  <span className="bottom-nav-icon">
                    <Icon size={22} color={isActive ? color : "currentColor"} />
                  </span>
                  <span className="bottom-nav-label">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Hamburger */}
          <button
            className={`bottom-nav-item${drawerOpen ? " active" : ""}`}
            onClick={openDrawer}
            aria-label="More options"
          >
            <span className="bottom-nav-icon">
              <HamburgerIcon open={drawerOpen} />
            </span>
            <span className="bottom-nav-label">More</span>
          </button>
        </div>
      </nav>

      {/* ── Drawer Overlay ────────────────────────────────── */}
      <div
        className={`drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Drawer Panel ─────────────────────────────────── */}
      <aside
        className={`drawer-panel${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="More navigation options"
      >
        {/* Drawer Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "1.6rem" }}>{user?.avatar || "🌿"}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                {user?.name || "HealthSaathi"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close menu"
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border-subtle)",
              color: "var(--text-muted)", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
            }}
          >
            ✕
          </button>
        </div>

        <hr className="divider" style={{ marginBottom: "16px" }} />

        {/* Drawer Nav Items */}
        <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--text-muted)", padding: "0 4px 8px" }}>
          More
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {drawerItems.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => { handleNavTap(); closeDrawer(); }}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              style={{ fontSize: "0.95rem", padding: "11px 14px" }}
            >
              <span className="nav-icon-wrap">
                <Icon size={18} color={color} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <hr className="divider" style={{ margin: "16px 0" }} />

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="btn-danger"
          style={{ width: "100%", padding: "12px", fontSize: "0.93rem" }}
        >
          🚪 Sign Out
        </button>
      </aside>
    </>
  );
}
