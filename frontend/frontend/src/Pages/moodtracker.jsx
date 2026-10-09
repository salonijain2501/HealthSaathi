import { useEffect, useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import {
  SparklesIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  HeartIcon,
} from "../components/Icons";

function MoodTracker() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [intensity, setIntensity] = useState(7);
  const [selectedTags, setSelectedTags] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMood, setFilterMood] = useState("All");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const moodOptions = [
    { label: "Happy", emoji: "😊", color: "var(--apple-green)", gradient: "linear-gradient(135deg, rgba(48, 209, 88, 0.25), rgba(48, 209, 88, 0.08))" },
    { label: "Calm", emoji: "😌", color: "var(--apple-teal)", gradient: "linear-gradient(135deg, rgba(100, 210, 255, 0.25), rgba(100, 210, 255, 0.08))" },
    { label: "Anxious", emoji: "😰", color: "var(--apple-gold)", gradient: "linear-gradient(135deg, rgba(255, 214, 10, 0.25), rgba(255, 214, 10, 0.08))" },
    { label: "Sad", emoji: "😔", color: "var(--apple-purple)", gradient: "linear-gradient(135deg, rgba(191, 90, 242, 0.25), rgba(191, 90, 242, 0.08))" },
    { label: "Angry", emoji: "😡", color: "var(--apple-pink)", gradient: "linear-gradient(135deg, rgba(255, 69, 58, 0.25), rgba(255, 69, 58, 0.08))" },
  ];

  const tagOptions = [
    "#Work",
    "#Family",
    "#Relationships",
    "#Sleep",
    "#Exercise",
    "#Grateful",
    "#Overwhelmed",
    "#Mindfulness",
    "#Nutrition",
    "#Travel",
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const fetchMoods = async () => {
    try {
      setLoading(true);
      const res = await API.get("/mood/my");
      setMoods(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const addMood = async () => {
    if (!mood) {
      alert("Please select how you are feeling 😊");
      return;
    }

    try {
      const fullNote = selectedTags.length > 0 
        ? `${note} ${selectedTags.join(" ")}`.trim()
        : note;

      await API.post("/mood/add", {
        mood,
        note: fullNote,
      });

      setMood("");
      setNote("");
      setSelectedTags([]);
      setIntensity(7);
      fetchMoods();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mood log?")) return;
    try {
      await API.delete(`/mood/${id}`);
      fetchMoods();
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setMood(item.mood);
    setNote(item.note || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setMood("");
    setNote("");
    setSelectedTags([]);
  };

  const updateMood = async () => {
    try {
      await API.put(`/mood/${editId}`, {
        mood,
        note,
      });

      cancelEdit();
      fetchMoods();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredMoods = filterMood === "All"
    ? moods
    : moods.filter((m) => m.mood.toLowerCase() === filterMood.toLowerCase());

  return (
    <Layout>
      <div className="page-content" style={{ maxWidth: "1000px" }}>
        {/* Page Title & Intro */}
        <div style={{ marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <HeartIcon size={14} color="var(--apple-pink)" />
            <span>Emotional Sanctuary</span>
          </div>
          <h1>Daily Mood Logger</h1>
          <p style={{ fontSize: "1rem", marginTop: "4px" }}>
            Check in with yourself, honor your emotions, and receive AI mindfulness reflections.
          </p>
        </div>

        {/* Mood Logger Glass Card */}
        <div
          className="glass-card glass-card glass-glow"
          style={{
            padding: "32px",
            marginBottom: "36px",
            background: "linear-gradient(135deg, rgba(28, 36, 62, 0.8) 0%, rgba(18, 24, 42, 0.9) 100%)",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "16px" }}>
            {isEditing ? "✏️ Edit Mood Entry" : "How are you feeling right now?"}
          </h2>

          {/* Emoji Picker Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {moodOptions.map((item) => {
              const isSelected = mood === item.label;
              return (
                <div
                  key={item.label}
                  onClick={() => setMood(item.label)}
                  className="glass-card interactive"
                  style={{
                    padding: "16px 12px",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                    cursor: "pointer",
                    background: isSelected ? item.gradient : "var(--glass-surface-subtle)",
                    border: isSelected
                      ? `2px solid ${item.color}`
                      : "1px solid var(--glass-border-subtle)",
                    boxShadow: isSelected
                      ? `0 8px 24px ${item.color}40, inset 0 1px 1px rgba(255,255,255,0.4)`
                      : "none",
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ fontSize: "2.4rem", marginBottom: "6px" }}>
                    {item.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Intensity Slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                Intensity Level: <strong style={{ color: "var(--apple-teal)" }}>{intensity}/10</strong>
              </label>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {intensity <= 3 ? "Mild" : intensity <= 7 ? "Moderate" : "Strong"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{
                width: "100%",
                height: "6px",
                padding: 0,
                accentColor: "var(--apple-blue)",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Tag Pills */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
              What influenced this feeling?
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {tagOptions.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.82rem",
                      background: active ? "var(--apple-blue)" : "rgba(255, 255, 255, 0.06)",
                      color: active ? "#ffffff" : "var(--text-secondary)",
                      border: active ? "1px solid rgba(255,255,255,0.4)" : "1px solid var(--glass-border-subtle)",
                      boxShadow: active ? "0 4px 12px rgba(10,132,255,0.3)" : "none",
                      cursor: "pointer",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note Input */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
              Personal Reflection Note (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="What thoughts are passing through your mind? Express freely..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "var(--radius-md)",
                resize: "vertical",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={isEditing ? updateMood : addMood}
              className="btn-primary"
              style={{
                padding: "13px 28px",
                borderRadius: "var(--radius-md)",
                fontSize: "1rem",
              }}
            >
              {isEditing ? (
                <>
                  <CheckIcon size={18} />
                  <span>Update Entry</span>
                </>
              ) : (
                <>
                  <PlusIcon size={18} />
                  <span>Log Entry & Reflect</span>
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={cancelEdit}
                className="btn-glass"
                style={{
                  padding: "13px 20px",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <CloseIcon size={16} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Mood History Timeline */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2>🗓️ Mood Journal Timeline</h2>
              <p style={{ fontSize: "0.88rem", marginTop: "2px" }}>
                {moods.length} total entries recorded
              </p>
            </div>

            {/* Filter Pills */}
            <div className="seg-control">
              {["All", "Happy", "Calm", "Anxious", "Sad", "Angry"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterMood(f)}
                  className={`seg-item ${filterMood === f ? "active" : ""}`}
                  style={{ fontSize: "0.82rem", padding: "6px 12px" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredMoods.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌿</div>
              <h3>No moods found in this filter</h3>
              <p style={{ marginTop: "4px", color: "var(--text-muted)" }}>
                Start by logging your mood above to begin your mindful diary.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredMoods.map((item) => {
                const dateObj = new Date(item.createdAt);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const moodConfig = moodOptions.find((m) => m.label === item.mood) || {
                  emoji: "🌿",
                  color: "var(--apple-blue)",
                };

                return (
                  <div
                    key={item._id}
                    className="glass-card"
                    style={{
                      padding: "22px 26px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      borderLeft: `4px solid ${moodConfig.color}`,
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "1.8rem" }}>{moodConfig.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                            {item.mood}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {formattedDate} • {formattedTime}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => startEdit(item)}
                          className="btn-glass"
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          title="Edit entry"
                        >
                          <EditIcon size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteMood(item._id)}
                          className="btn-danger"
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          title="Delete entry"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Note Content */}
                    {item.note && (
                      <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.5, background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "var(--radius-sm)" }}>
                        {item.note}
                      </p>
                    )}

                    {/* AI Suggestion Callout */}
                    {item.aiSuggestion && (
                      <div
                        style={{
                          padding: "14px 18px",
                          borderRadius: "var(--radius-sm)",
                          background: "linear-gradient(135deg, rgba(191, 90, 242, 0.12) 0%, rgba(10, 132, 255, 0.08) 100%)",
                          border: "1px solid rgba(191, 90, 242, 0.25)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: "var(--apple-teal)", fontSize: "0.82rem", fontWeight: 700 }}>
                          <SparklesIcon size={14} />
                          <span>HealthSaathi AI Reflection</span>
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                          {item.aiSuggestion}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MoodTracker;