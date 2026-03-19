import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import MoodGraph from "../components/MoodGraph";

const Dashboard = () => {
  const navigate = useNavigate();

  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);
  const [graphMoods, setGraphMoods] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [streak, setStreak] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const moodOptions = [
    { label: "Happy", emoji: "😊" },
    { label: "Sad", emoji: "😔" },
    { label: "Angry", emoji: "😡" },
    { label: "Anxious", emoji: "😰" },
    { label: "Calm", emoji: "😌" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 FETCH FUNCTIONS
  const fetchMoods = async () => {
    const res = await API.get("/mood/my");
    setMoods(res.data);
  };

  const fetchMoodGraph = async () => {
    const res = await API.get("/mood/graph");
    setGraphMoods(res.data);
  };

  const fetchAnalysis = async () => {
    const res = await API.get("/mood/analysis");
    setAnalysis(res.data.suggestion);
  };

  const fetchStreak = async () => {
    const res = await API.get("/mood/streak");
    setStreak(res.data.streak);
  };

  // 🔹 ADD
  const addMood = async () => {
    if (!mood) return alert("Select mood");

    await API.post("/mood/add", { mood, note });

    setMood("");
    setNote("");

    fetchMoods();
    fetchMoodGraph();
    fetchAnalysis();
    fetchStreak();
  };

  // 🔹 DELETE
  const deleteMood = async (id) => {
    await API.delete(`/mood/${id}`);

    fetchMoods();
    fetchMoodGraph();
    fetchStreak();
  };

  // 🔹 EDIT
  const startEdit = (m) => {
    setIsEditing(true);
    setEditId(m._id);
    setMood(m.mood);
    setNote(m.note);
  };

  const updateMood = async () => {
    await API.put(`/mood/${editId}`, { mood, note });

    setIsEditing(false);
    setEditId(null);
    setMood("");
    setNote("");

    fetchMoods();
    fetchMoodGraph();
    fetchStreak();
  };

  // 🔥 useEffect FIXED
  useEffect(() => {
    fetchMoods();
    fetchMoodGraph();
    fetchAnalysis();
    fetchStreak();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* MOOD SELECT */}
      <h3>Select Your Mood</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {moodOptions.map((m) => (
          <button
            key={m.label}
            onClick={() => setMood(m.label)}
            style={{
              padding: "6px 10px",
              border: mood === m.label ? "2px solid blue" : "1px solid gray",
              borderRadius: "6px",
              background: "white",
            }}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <input
        placeholder="Write note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br /><br />

      <button onClick={isEditing ? updateMood : addMood}>
        {isEditing ? "Update Mood ✏️" : "Add Mood"}
      </button>

      <hr />

      {/* GRAPH */}
      <h3>Mood Graph 📊</h3>

      <div
        style={{
          height: "300px",   // 🔥 FIXED HEIGHT
          width: "100%",
          padding: "10px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <MoodGraph moods={graphMoods} />
      </div>

      {/* 🔥 STREAK */}
      <h3>🔥 Your Streak</h3>

      <div
        style={{
          background: "#fff3e0",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>🔥 {streak} Day Streak</h2>

        <p>
          {streak >= 5
            ? "You're on fire 🔥🔥"
            : streak >= 3
            ? "Great consistency 💪"
            : "Start your streak today 🌱"}
        </p>
      </div>

      <hr />

      {/* AI */}
      <h3>AI Mood Insight 🤖</h3>

      <div
        style={{
          background: "#f0f4ff",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        {analysis || "No insights yet"}
      </div>

      {/* LIST */}
      <h3>My Moods</h3>

      {moods.length === 0 && <p>No moods yet</p>}

      {moods.map((m) => (
        <div key={m._id} style={{ marginBottom: "8px" }}>
          {m.mood} - {m.note}

          <button onClick={() => startEdit(m)} style={{ marginLeft: "10px" }}>
            Edit
          </button>

          <button
            onClick={() => deleteMood(m._id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;