import axios from "axios";

export const loginUser = (data) => {
  return axios.post("http://localhost:5000/api/auth/login", data);
};

export const signupUser = (data) => {
  return axios.post("http://localhost:5000/api/auth/signup", data);
};
