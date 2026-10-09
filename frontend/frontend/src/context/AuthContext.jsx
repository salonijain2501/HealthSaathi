import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../Services/auth.api";

// ── Context ───────────────────────────────────────────────────
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // full user object
  const [loading, setLoading] = useState(true);    // resolving initial auth state

  // ── Bootstrap: on mount, verify token & fetch live profile ─
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token invalid / expired — clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── login — called after successful /login API response ─────
  const login = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  }, []);

  // ── logout — clear state and storage ─────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // ── refreshUser — re-fetch latest profile from server ────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data);
      return res.data;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  // ── updateLocalUser — optimistic local update ─────────────────
  const updateLocalUser = useCallback((partial) => {
    setUser((prev) => prev ? { ...prev, ...partial } : prev);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    updateLocalUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
