import { useState } from "react";
import Layout from "../components/Layout";
import { BookIcon, SearchIcon, SparklesIcon, CloseIcon, CheckIcon } from "../components/Icons";

function Books() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [savedBooks, setSavedBooks] = useState([1, 3]);

  const booksData = [
    {
      id: 1,
      title: "The Body Keeps the Score",
      author: "Bessel van der Kolk, M.D.",
      tag: "Trauma & Healing",
      readTime: "8 min read",
      rating: "4.9 ★",
      emoji: "🧠",
      summary: "A pioneering exploration of how trauma physically reshapes the brain and body, and the revolutionary somatic and mindfulness therapies that restore agency.",
      keyTakeaways: [
        "Trauma is stored physiologically in somatic tension and hyper-vigilance.",
        "Mindfulness and breathwork help reclaim the visceral safety of one's own body.",
        "Connection and community are essential biological imperatives for healing."
      ],
      quote: "Being able to feel safe with other people is probably the single most important aspect of mental health."
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      tag: "Habit Psychology",
      readTime: "6 min read",
      rating: "4.9 ★",
      emoji: "⚡",
      summary: "An ultra-practical framework for improving every day through the power of 1% compounding micro-habits and identity-based transformation.",
      keyTakeaways: [
        "Focus on systems and identity rather than distant outcome goals.",
        "Make positive habits obvious, attractive, easy, and satisfying.",
        "Small 1% daily changes accumulate into massive life shifts."
      ],
      quote: "You do not rise to the level of your goals. You fall to the level of your systems."
    },
    {
      id: 3,
      title: "Wherever You Go, There You Are",
      author: "Jon Kabat-Zinn",
      tag: "Mindfulness Meditation",
      readTime: "5 min read",
      rating: "4.8 ★",
      emoji: "🍃",
      summary: "The definitive guide to cultivating non-judgmental presence, stillness, and everyday mindfulness in modern high-stress life.",
      keyTakeaways: [
        "Mindfulness is awareness that arises through paying attention on purpose, in the present moment.",
        "You don't have to stop your thoughts; simply witness them like clouds.",
        "The present moment is the only time we have to live, grow, and heal."
      ],
      quote: "You can't stop the waves, but you can learn to surf."
    },
    {
      id: 4,
      title: "Feeling Good: The New Mood Therapy",
      author: "David D. Burns, M.D.",
      tag: "Cognitive Behavioral Therapy",
      readTime: "7 min read",
      rating: "4.7 ★",
      emoji: "☀️",
      summary: "The clinically proven cognitive behavioral techniques to identify and dismantle cognitive distortions, negative self-talk, and anxiety loops.",
      keyTakeaways: [
        "Our thoughts create our emotional states, not external events.",
        "Cognitive distortions like 'all-or-nothing thinking' can be systematically disputed.",
        "Daily thought journaling generates rapid relief from rumination."
      ],
      quote: "Change the way you think, and you change the way you feel."
    },
    {
      id: 5,
      title: "Why We Sleep",
      author: "Matthew Walker, Ph.D.",
      tag: "Sleep & Brain Health",
      readTime: "6 min read",
      rating: "4.8 ★",
      emoji: "🌙",
      summary: "A fascinating deep dive into how REM and deep slow-wave sleep govern our emotional regulation, immune defense, and psychological resilience.",
      keyTakeaways: [
        "Sleep is the single most effective thing we can do to reset our brain and body health.",
        "Consistent sleep-wake times anchor circadian rhythms and mood stability.",
        "Cool room temperatures and evening dim lighting trigger natural melatonin."
      ],
      quote: "Sleep is the Swiss Army knife of health. When sleep is abundant, minds flourish."
    },
    {
      id: 6,
      title: "Self-Compassion",
      author: "Kristin Neff, Ph.D.",
      tag: "Emotional Well-being",
      readTime: "5 min read",
      rating: "4.8 ★",
      emoji: "💖",
      summary: "The proven power of treating ourselves with the same unconditional kindness and understanding we offer to a cherished friend in difficult times.",
      keyTakeaways: [
        "Self-compassion consists of self-kindness, common humanity, and mindfulness.",
        "Self-criticism activates fight-or-flight; self-compassion activates safety and oxytocin.",
        "Suffering is part of the shared human condition, not a personal failure."
      ],
      quote: "Unlike self-criticism, which asks if you're good enough, self-compassion asks: what's good for you?"
    }
  ];

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (savedBooks.includes(id)) {
      setSavedBooks(savedBooks.filter((b) => b !== id));
    } else {
      setSavedBooks([...savedBooks, id]);
    }
  };

  const filteredBooks = booksData.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-content">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="glass-pill" style={{ marginBottom: "10px" }}>
            <BookIcon size={14} color="var(--apple-coral)" />
            <span>Mindful Wisdom & Reading</span>
          </div>
          <h1>Mental Health Library</h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
            Curated summaries and transformative frameworks from the world’s leading psychologists and mindfulness pioneers.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "460px" }}>
            <input
              type="text"
              placeholder="Search by book title, author, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "44px",
                borderRadius: "999px",
              }}
            />
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
              <SearchIcon size={18} />
            </div>
          </div>
        </div>

        {/* Book Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredBooks.map((book) => {
            const isBookmarked = savedBooks.includes(book.id);
            return (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="glass-card glass-card interactive"
                style={{
                  padding: "26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "24px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "18px",
                        background: "var(--glass-surface-elevated)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.8rem",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.4)",
                      }}
                    >
                      {book.emoji}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="glass-pill" style={{ fontSize: "0.75rem", color: "var(--apple-teal)" }}>
                        {book.readTime}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(book.id, e)}
                        style={{
                          background: isBookmarked ? "rgba(255, 214, 10, 0.2)" : "rgba(255, 255, 255, 0.06)",
                          border: "none",
                          padding: "6px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          color: isBookmarked ? "var(--apple-gold)" : "var(--text-muted)",
                        }}
                      >
                        {isBookmarked ? "★" : "☆"}
                      </button>
                    </div>
                  </div>

                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--apple-coral)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {book.tag}
                  </span>
                  <h3 style={{ fontSize: "1.2rem", margin: "4px 0 6px", color: "var(--text-primary)" }}>
                    {book.title}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    By {book.author}
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {book.summary}
                  </p>
                </div>

                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--apple-gold)", fontWeight: 600 }}>
                    {book.rating}
                  </span>
                  <button className="btn-glass" style={{ fontSize: "0.85rem", padding: "8px 16px" }}>
                    Read Insights →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Book Detail Modal */}
        {selectedBook && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            onClick={() => setSelectedBook(null)}
          >
            <div
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "600px",
                maxHeight: "88vh",
                overflowY: "auto",
                padding: "32px",
                borderRadius: "28px",
                background: "rgba(18, 24, 40, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBook(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <CloseIcon size={16} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <span style={{ fontSize: "2.4rem" }}>{selectedBook.emoji}</span>
                <div>
                  <span className="glass-pill" style={{ fontSize: "0.75rem", color: "var(--apple-coral)" }}>
                    {selectedBook.tag}
                  </span>
                  <h2 style={{ fontSize: "1.4rem", margin: "4px 0 2px" }}>{selectedBook.title}</h2>
                  <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{selectedBook.author}</div>
                </div>
              </div>

              {/* Quote Banner */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderLeft: "3px solid var(--apple-blue)",
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  margin: "18px 0",
                }}
              >
                “{selectedBook.quote}”
              </div>

              <h3 style={{ fontSize: "1.05rem", margin: "20px 0 10px", color: "var(--apple-teal)" }}>
                🌟 Key Takeaways for Mindfulness
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {selectedBook.keyTakeaways.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div style={{ color: "var(--apple-green)", marginTop: "2px" }}>
                      <CheckIcon size={16} />
                    </div>
                    <span style={{ fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedBook(null)}
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "24px",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Done Reading
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Books;