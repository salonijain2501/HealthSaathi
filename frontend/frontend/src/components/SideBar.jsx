import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon, MoodIcon, AnalyticsIcon, LotusIcon, MusicIcon,
  BookIcon, VideoIcon, TrophyIcon, UserIcon, SettingsIcon,
} from "./Icons";

const navItems = [
  { to: "/dashboard",   label: "Dashboard",     icon: HomeIcon,      color: "var(--blue)" },
  { to: "/moodtracker", label: "Mood Tracker",   icon: MoodIcon,      color: "var(--orange)" },
  { to: "/analytics",   label: "Analytics",     icon: AnalyticsIcon, color: "var(--teal)" },
  { to: "/meditation",  label: "Meditation",    icon: LotusIcon,     color: "var(--green)" },
  { to: "/relaxsounds", label: "Relax Sounds",  icon: MusicIcon,     color: "var(--purple)" },
  { to: "/challenges",  label: "Challenges",    icon: TrophyIcon,    color: "var(--yellow)" },
  { to: "/books",       label: "Books & Wisdom", icon: BookIcon,     color: "var(--orange)" },
  { to: "/videos",      label: "Videos",        icon: VideoIcon,     color: "var(--pink)" },
  { to: "/profile",     label: "My Profile",    icon: UserIcon,      color: "var(--blue)" },
  { to: "/settings",    label: "Settings",      icon: SettingsIcon,  color: "var(--text-muted)" },
];

export default function SideBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar-rail">
      {/* Brand + User Mini-Card */}
      <div style={{
        padding: "4px 8px 18px",
        borderBottom: "1px solid var(--glass-border-subtle)",
        marginBottom: "12px",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "16px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "13px",
            background: "var(--grad-primary)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "1.25rem", flexShrink: 0,
            boxShadow: "0 6px 18px rgba(10,132,255,0.45)",
          }}>
            🌿
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              HealthSaathi
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Mind & Soul Sanctuary
            </div>
          </div>
        </div>

        {/* User pill */}
        {user && (
          <NavLink
            to="/profile"
            style={{ textDecoration: "none" }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 11px", borderRadius: "var(--r-sm)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border-subtle)",
              cursor: "pointer", transition: "all var(--t-fast)",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
                background: "var(--grad-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
              }}>
                {user.avatar || "🌿"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </div>
              </div>
            </div>
          </NavLink>
        )}
      </div>

      {/* Nav label */}
      <div style={{
        fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em",
        fontWeight: 700, color: "var(--text-muted)", padding: "4px 12px 6px",
      }}>
        Navigation
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ to, label, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <span className="nav-icon-wrap">
              <Icon size={17} color={color} />
            </span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div style={{ paddingTop: "14px", borderTop: "1px solid var(--glass-border-subtle)" }}>
        <button
          onClick={handleLogout}
          className="btn-danger"
          style={{ width: "100%", padding: "9px 14px", fontSize: "0.87rem" }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}