import { useState } from "react";
import sounds from "../data/sounds";
import RelaxCard from "../components/RelaxCard";
import Layout from "../components/Layout";
import { useAudio } from "../context/AudioContext";
import { SearchIcon, MusicIcon, SparklesIcon } from "../components/Icons";

function RelaxSounds() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { currentSound, isPlaying, playSound } = useAudio();

  const categories = [
    { id: "All", label: "All Sounds", icon: "✨" },
    { id: "Nature", label: "Nature & Rain", icon: "🌿" },
    { id: "Zen", label: "Zen & Meditation", icon: "🧘" },
    { id: "Peace", label: "Calm & Sleep", icon: "🌙" },
  ];

  const filteredSounds = sounds.filter((sound) => {
    const matchesSearch = sound.title.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === "All") return matchesSearch;
    if (selectedCategory === "Nature") {
      return matchesSearch && (sound.title.includes("Breeze") || sound.title.includes("Vibes") || sound.title.includes("Peaceful") || sound.id <= 3);
    }
    if (selectedCategory === "Zen") {
      return matchesSearch && (sound.title.includes("Mind") || sound.title.includes("Inner") || sound.title.includes("Harmony") || sound.id >= 7);
    }
    if (selectedCategory === "Peace") {
      return matchesSearch && (sound.title.includes("Dream") || sound.title.includes("Quiet") || sound.title.includes("Deep") || sound.title.includes("Serenity"));
    }
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="page-content">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <MusicIcon size={14} color="var(--apple-purple)" />
            <span>Sound Sanctuary</span>
          </div>
          <h1>Ambient Relax Sounds</h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
            Immerse yourself in therapeutic soundscapes designed to dissolve anxiety, enhance deep focus, and promote restful sleep.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
            <input
              type="text"
              placeholder="Search relaxing soundscapes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "42px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.08)",
              }}
            />
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
              <SearchIcon size={18} />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="seg-control">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`seg-item ${selectedCategory === cat.id ? "active" : ""}`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Soundboard Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredSounds.map((sound) => (
            <RelaxCard
              key={sound.id}
              sound={sound}
              onPlay={playSound}
              currentSound={currentSound}
              isPlaying={isPlaying}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default RelaxSounds;