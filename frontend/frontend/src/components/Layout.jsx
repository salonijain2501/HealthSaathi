import React, { useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import AmbientBackground from "./AmbientBackground";
import GlobalAudioPlayer from "./GlobalAudioPlayer";
import AiChatModal from "./AiChatModal";

export default function Layout({ children }) {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  return (
    <div className="app-shell">
      <AmbientBackground />

      {/* Desktop sidebar (hidden on mobile via CSS) */}
      <SideBar />

      <div className="main-area">
        <Header onOpenAiChat={() => setIsAiChatOpen(true)} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>

      {/* Mobile bottom nav + drawer (shown only on mobile via CSS) */}
      <MobileNav />

      <GlobalAudioPlayer />
      <AiChatModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
    </div>
  );
}