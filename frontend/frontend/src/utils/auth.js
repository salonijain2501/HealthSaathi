// Legacy helpers (kept for backward-compatibility)
// Prefer using AuthContext.login() / AuthContext.logout() in components

export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken  = ()      => localStorage.getItem("token");
export const logout    = ()      => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
