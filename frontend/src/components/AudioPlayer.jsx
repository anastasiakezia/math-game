// src/components/AudioPlayer.jsx
import React, { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ src, compact = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.loop = true;
    }
  }, []);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      const p = audioRef.current.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() => {
          setPlaying(false);
        });
      } else {
        setPlaying(true);
      }
    }
  }

  const ariaLabel = playing ? "Pause background music" : "Play background music";

  if (compact) {
    // compact button (mobile)
    return (
      <div className="audio-compact" role="region" aria-label="Pemutar musik kecil">
        <audio ref={audioRef} src={src} preload="auto" />
        <button
          type="button"
          aria-pressed={playing}
          aria-label={ariaLabel}
          onClick={toggle}
          className="audio-compact-btn hover:scale-105 transition-transform duration-200"
        >
          <span aria-hidden="true">{playing ? "⏸️" : "🎵"}</span>
        </button>
      </div>
    );
  }

  // full player (desktop / tablet)
  return (
    <div
      className="flex items-center gap-3 audio-full bg-white/80 px-3 py-2 rounded-2xl shadow-md"
      role="region"
      aria-label="Pemutar musik"
    >
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        className="btn-jw flex items-center gap-2"
        onClick={toggle}
        aria-label={ariaLabel}
      >
        <span>{playing ? "⏸️" : "▶️"}</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg" aria-hidden="true">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 sm:w-28 accent-green-600"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
