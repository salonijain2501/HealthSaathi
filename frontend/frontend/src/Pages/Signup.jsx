import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../Services/auth.api";
import AmbientBackground from "../components/AmbientBackground";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signupUser(form);
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
    }}>
      <AmbientBackground />

      <div
        className="glass-card glass-glow"
        style={{
          width: "100%",
          maxWidth: "410px",
          padding: "40px 36px 36px",
          borderRadius: "28px",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 40px rgba(10,132,255,0.15)",
          animation: "fadeSlideUp 0.4s var(--ease-spring) forwards",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "58px", height: "58px",
            margin: "0 auto 14px",
            borderRadius: "18px",
            background: "var(--grad-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem",
            boxShadow: "0 8px 28px rgba(10,132,255,0.45)",
          }}>
            🌿
          </div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "6px" }}>HealthSaathi</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Begin your mindfulness journey
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="seg-control" style={{ width: "100%", marginBottom: "24px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <Link to="/login" className="seg-item" style={{ textAlign: "center", textDecoration: "none" }}>
            Sign In
          </Link>
          <button type="button" className="seg-item active" style={{ textAlign: "center" }}>
            Sign Up
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: "var(--r-sm)",
            background: "rgba(255,55,95,0.14)", border: "1px solid rgba(255,55,95,0.3)",
            color: "var(--pink)", fontSize: "0.85rem", marginBottom: "18px", textAlign: "center",
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            padding: "10px 14px", borderRadius: "var(--r-sm)",
            background: "rgba(48,209,88,0.14)", border: "1px solid rgba(48,209,88,0.3)",
            color: "var(--green)", fontSize: "0.85rem", marginBottom: "18px", textAlign: "center",
          }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "6px", color: "var(--text-secondary)" }}>
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "6px", color: "var(--text-secondary)" }}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "6px", color: "var(--text-secondary)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: "52px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "10px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent", border: "none", padding: "4px 6px",
                  color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "13px", fontSize: "0.97rem", marginTop: "4px" }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* OAuth Separator */}
        <div style={{ display: "flex", alignItems: "center", margin: "18px 0 16px", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
          <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
        </div>

        {/* Google Authentication */}
        <GoogleAuthButton text="signup_with" />

        <p style={{ marginTop: "18px", textAlign: "center", fontSize: "0.84rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
