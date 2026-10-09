import React, { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import { SparklesIcon, CloseIcon, MessageIcon } from "./Icons";

export default function AiChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello, I am HealthSaathi AI, your mindful companion 🌿. How are you feeling right now? I'm here to listen, guide, and support your peace of mind.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "I'm feeling stressed today 🌧️",
    "Quick 2-min breathing exercise 🧘",
    "How can I sleep better tonight? 🌙",
    "Positive affirmation for right now ✨"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chat", { message: query });
      const reply = res.data?.reply || "Take a gentle deep breath. Notice the sensation of your feet on the ground. You are safe and doing the best you can in this moment. 🌿";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.log("Chat error, using calming fallback", err);
      // Smart comforting fallback
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "Take a slow, deep breath in for 4 seconds... hold for 4... and release for 6. Remember, emotions are like passing clouds in the sky. You have the strength to navigate this moment with calm and grace. 🕊️",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "slideUpFade 0.25s var(--ease-apple) forwards",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "640px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          background: "rgba(16, 22, 36, 0.88)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(191, 90, 242, 0.25)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Glowing Apple Intelligence header line */}
        <div
          style={{
            height: "3px",
            width: "100%",
            background: "var(--grad-intelligence)",
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--glass-border-subtle)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                background: "var(--grad-intelligence)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 4px 15px rgba(191, 90, 242, 0.4)",
              }}
            >
              <SparklesIcon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                HealthSaathi AI
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--apple-teal)", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--apple-green)" }} />
                Mindful Companion Active
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "var(--text-secondary)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Message Area */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "13px 18px",
                    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isUser
                      ? "var(--grad-primary)"
                      : "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                    border: isUser ? "none" : "1px solid var(--glass-border-subtle)",
                    boxShadow: isUser
                      ? "0 4px 15px rgba(10, 132, 255, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {m.text}
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "0 4px" }}>
                  {m.time}
                </span>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: "16px", width: "fit-content" }}>
              <SparklesIcon size={16} color="var(--apple-teal)" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                HealthSaathi is reflecting...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: "8px 18px",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
            borderTop: "1px solid var(--glass-border-subtle)",
          }}
        >
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                fontSize: "0.78rem",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid var(--glass-border-subtle)",
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: "16px 18px 20px",
            display: "flex",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <input
            type="text"
            placeholder="Ask anything or share your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              borderRadius: "999px",
              padding: "12px 18px",
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary"
            style={{
              borderRadius: "999px",
              padding: "10px 20px",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
