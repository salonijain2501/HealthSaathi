import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./context/AudioContext";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Analaytics from "./Pages/analaytics";
import Books from "./Pages/books";
import Challenges from "./Pages/challenges";
import Meditation from "./Pages/meditation";
import MoodTracker from "./Pages/moodtracker";
import Profile from "./Pages/profile";
import RelaxSounds from "./Pages/relaxsounds";
import Settings from "./Pages/settings";
import Videos from "./Pages/videos";

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics"   element={<ProtectedRoute><Analaytics /></ProtectedRoute>} />
          <Route path="/moodtracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
          <Route path="/meditation"  element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
          <Route path="/books"       element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/videos"      element={<ProtectedRoute><Videos /></ProtectedRoute>} />
          <Route path="/relaxsounds" element={<ProtectedRoute><RelaxSounds /></ProtectedRoute>} />
          <Route path="/challenges"  element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
