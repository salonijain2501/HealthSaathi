import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { googleLogin } from "../Services/auth.api";

export default function GoogleAuthButton({ text = "continue_with" }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfigNotice, setShowConfigNotice] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    let isMounted = true;

    const handleCredentialResponse = async (response) => {
      if (!response.credential) return;
      setError("");
      setLoading(true);

      try {
        const res = await googleLogin(response.credential);
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      } catch (err) {
        console.error("Google login failed:", err);
        setError(err.response?.data?.message || "Google authentication failed. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const initializeGSI = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Clear existing children before rendering
        buttonRef.current.innerHTML = "";

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          type: "standard",
          text: text,
          logo_alignment: "left",
          width: 340,
        });
      } catch (e) {
        console.error("Error initializing Google Identity Services:", e);
      }
    };

    // Load Google Identity Services script if not present
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) initializeGSI();
      };
      document.body.appendChild(script);
    } else {
      initializeGSI();
    }

    return () => {
      isMounted = false;
    };
  }, [clientId, login, navigate, text]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {error && (
        <div
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: "var(--r-sm, 10px)",
            background: "rgba(255, 55, 95, 0.14)",
            border: "1px solid rgba(255, 55, 95, 0.3)",
            color: "var(--pink, #ff375f)",
            fontSize: "0.82rem",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div style={{ fontSize: "0.85rem", color: "var(--teal, #64d2ff)", marginBottom: "8px", fontWeight: 500 }}>
          Verifying Google account…
        </div>
      )}

      {clientId ? (
        <div
          ref={buttonRef}
          style={{
            minHeight: "44px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        />
      ) : (
        <div style={{ width: "100%" }}>
          <button
            type="button"
            onClick={() => setShowConfigNotice(!showConfigNotice)}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              color: "var(--text-primary, #fff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "0.92rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {showConfigNotice && (
            <div
              style={{
                marginTop: "10px",
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(10, 132, 255, 0.12)",
                border: "1px solid rgba(10, 132, 255, 0.28)",
                fontSize: "0.8rem",
                lineHeight: "1.5",
                color: "var(--text-secondary, #ddd)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--blue, #0a84ff)", marginBottom: "4px" }}>
                ⚙️ Google OAuth Setup Required
              </div>
              Backend is ready for Google OAuth! To activate the button:
              <ol style={{ paddingLeft: "18px", margin: "6px 0" }}>
                <li>Create OAuth Credentials in Google Cloud Console</li>
                <li>Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/frontend/.env</code></li>
                <li>Set <code>GOOGLE_CLIENT_ID</code> in <code>backend/.env</code></li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
