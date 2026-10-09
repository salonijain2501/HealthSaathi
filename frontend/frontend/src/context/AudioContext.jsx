import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    audio.loop = true;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  const playSound = (sound) => {
    const audio = audioRef.current;

    // Toggle if same sound
    if (currentSound?.id === sound.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
      return;
    }

    // Change sound
    audio.pause();
    audio.src = sound.audio;
    audio.volume = volume;
    audio.play().then(() => {
      setCurrentSound(sound);
      setIsPlaying(true);
    }).catch(console.error);
  };

  const pauseSound = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resumeSound = () => {
    if (currentSound) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const stopSound = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentSound(null);
    setIsPlaying(false);
  };

  const setVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    audioRef.current.volume = clamped;
  };

  return (
    <AudioContext.Provider
      value={{
        currentSound,
        isPlaying,
        volume,
        progress,
        duration,
        playSound,
        pauseSound,
        resumeSound,
        stopSound,
        setVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
