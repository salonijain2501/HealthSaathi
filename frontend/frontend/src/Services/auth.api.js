import API from "../api/axios";

export const loginUser     = (data) => API.post("/auth/login", data);
export const signupUser    = (data) => API.post("/auth/signup", data);
export const googleLogin   = (credential) => API.post("/auth/google", { credential });
export const getMe         = ()     => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const changePassword= (data) => API.put("/auth/change-password", data);
export const deleteAccount = (data) => API.delete("/auth/account", { data });
