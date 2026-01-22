import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import MoodGraph from "../components/MoodGraph";

const Dashboard = () => {
  const navigate = useNavigate();

  // 🔹 States
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);
  const [graphMoods, setGraphMoods] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 Mood options
  const moodOptions = [
    { label: "Happy", emoji: "😊" },
    { label: "Sad", emoji: "😔" },
    { label: "Angry", emoji: "😡" },
    { label: "Anxious", emoji: "😰" },
    { label: "Calm", emoji: "😌" },
  ];

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Fetch moods list
  const fetchMoods = async () => {
    try {
      const res = await API.get("/mood/my");
      setMoods(res.data);
    } catch (err) {
      console.error("Fetch moods error:", err);
    }
  };

  // 🔹 Fetch graph moods
  const fetchMoodGraph = async () => {
    try {
      const res = await API.get("/mood/graph");
      setGraphMoods(res.data);
    } catch (err) {
      console.error("Graph fetch error:", err);
    }
  };

  // 🔹 Add mood
  const addMood = async () => {
    if (!mood) {
      alert("Please select a mood");
      return;
    }

    try {
      await API.post("/mood/add", { mood, note });
      setMood("");
      setNote("");
      fetchMoods();
      fetchMoodGraph();
    } catch (err) {
      console.error("Add mood error:", err);
    }
  };

  // 🔹 Delete mood
  const deleteMood = async (id) => {
    try {
      await API.delete(`/mood/${id}`);
      fetchMoods();
      fetchMoodGraph();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 🔹 Start edit
  const startEdit = (m) => {
    setIsEditing(true);
    setEditId(m._id);
    setMood(m.mood);
    setNote(m.note);
  };

  // 🔹 Update mood
  const updateMood = async () => {
    if (!mood) {
      alert("Select a mood");
      return;
    }

    try {
      await API.put(`/mood/${editId}`, { mood, note });
      setIsEditing(false);
      setEditId(null);
      setMood("");
      setNote("");
      fetchMoods();
      fetchMoodGraph();
    } catch (err) {
      alert("Update failed");
    }
  };

  // 🔹 ONE useEffect ONLY
  useEffect(() => {
    fetchMoods();
    fetchMoodGraph();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* 🔹 SELECT MOOD */}
      <h3>Select Your Mood</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {moodOptions.map((m) => (
          <button
            key={m.label}
            onClick={() => setMood(m.label)}
            style={{
              padding: "8px 12px",
              border:
                mood === m.label ? "2px solid blue" : "1px solid gray",
              borderRadius: "6px",
              background: "white",
            }}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <input
        placeholder="Write a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br /><br />

      {/* 🔹 ADD / UPDATE */}
      <button onClick={isEditing ? updateMood : addMood}>
        {isEditing ? "Update Mood ✏️" : "Add Mood"}
      </button>

      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setMood("");
            setNote("");
          }}
          style={{ marginLeft: "10px" }}
        >
          Cancel ❌
        </button>
      )}

      <hr />

      {/* 🔹 MOOD GRAPH (FIXED SIZE) */}
      <h3>Mood Graph 📊</h3>

      {graphMoods.length > 0 ? (
        <div
          style={{
            height: "300px",      // 🔥 FIXED HEIGHT
            width: "100%",
            background: "#fff",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <MoodGraph moods={graphMoods} />
        </div>
      ) : (
        <p>No data for graph</p>
      )}

      <hr />

      {/* 🔹 MOOD LIST */}
      <h3>My Moods</h3>

      {moods.length === 0 && <p>No moods added yet.</p>}

      {moods.map((m) => {
        const emoji =
          moodOptions.find((mo) => mo.label === m.mood)?.emoji || "🙂";

        return (
          <div key={m._id} style={{ marginBottom: "8px" }}>
            <span>
              {emoji} <strong>{m.mood}</strong> — {m.note}
            </span>

            <button
              onClick={() => startEdit(m)}
              style={{ marginLeft: "10px" }}
            >
              Edit ✏️
            </button>

            <button
              onClick={() => deleteMood(m._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete ❌
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
