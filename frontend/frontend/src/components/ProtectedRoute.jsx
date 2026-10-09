import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show full-screen spinner while auth state resolves from token
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "var(--text-muted)",
      }}>
        <div style={{
          width: "44px", height: "44px",
          borderRadius: "50%",
          border: "3px solid var(--glass-border)",
          borderTop: "3px solid var(--blue)",
          animation: "spin 0.75s linear infinite",
        }} />
        <span style={{ fontSize: "0.88rem" }}>Loading your sanctuary…</span>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
