import axios from "./axios";

export const getMoodAnalysis = async () => {
  const res = await axios.get("/mood/analysis");
  return res.data;
};