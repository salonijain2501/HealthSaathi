import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";
import "./styles/responsive.css";
import { resumeAudio } from "./utils/haptics";

// Resume Web Audio on first user interaction (required by iOS/Safari)
document.addEventListener("pointerdown", resumeAudio, { once: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
