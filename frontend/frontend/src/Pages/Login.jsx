import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../Services/auth.api";
import AmbientBackground from "../components/AmbientBackground";
import { SparklesIcon } from "../components/Icons";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
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
          width: "100%", maxWidth: "420px",
          padding: "42px 38px 36px",
          borderRadius: "28px",
          position: "relative", zIndex: 10,
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 40px rgba(10,132,255,0.18)",
          animation: "fadeSlideUp 0.4s var(--ease-spring) forwards",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "60px", height: "60px", margin: "0 auto 14px",
            borderRadius: "20px", background: "var(--grad-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", boxShadow: "0 8px 28px rgba(10,132,255,0.45)",
          }}>
            🌿
          </div>
          <h1 style={{ fontSize: "1.85rem", marginBottom: "6px" }}>HealthSaathi</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Your mindful sanctuary awaits
          </p>
        </div>

        {/* Tab switcher */}
        <div className="seg-control" style={{ width: "100%", marginBottom: "26px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <button type="button" className="seg-item active" style={{ textAlign: "center" }}>Sign In</button>
          <Link to="/signup" className="seg-item" style={{ textAlign: "center", textDecoration: "none" }}>Sign Up</Link>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "11px 14px", borderRadius: "var(--r-sm)",
            background: "rgba(255,55,95,0.14)", border: "1px solid rgba(255,55,95,0.3)",
            color: "var(--pink)", fontSize: "0.85rem", marginBottom: "20px", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, marginBottom: "7px", color: "var(--text-secondary)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: "56px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent", border: "none", padding: "4px 6px",
                  color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600,
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
            style={{ width: "100%", padding: "13px", fontSize: "1rem", marginTop: "6px", borderRadius: "var(--r-sm)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
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
        <GoogleAuthButton text="signin_with" />

        {/* Footer */}
        <div style={{ marginTop: "22px", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            type="button"
            onClick={() => { setEmail("demo@healthsaathi.com"); setPassword("Demo1234!"); }}
            style={{
              background: "transparent", border: "none", padding: 0,
              color: "var(--teal)", fontSize: "0.82rem", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px",
            }}
          >
            <SparklesIcon size={13} color="var(--teal)" /> Fill demo credentials
          </button>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
            New to HealthSaathi?{" "}
            <Link to="/signup" style={{ color: "var(--blue)", fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
