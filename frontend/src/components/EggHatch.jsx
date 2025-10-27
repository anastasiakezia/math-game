// src/components/EggHatch.jsx
import React, { useEffect, useRef, useState } from "react";

export default function EggHatch({ images = [], onHatched = () => {}, imgClassName }) {
  const defaultImgs = [
    "/assets/images/egg_1.png",
    "/assets/images/egg_2.png",
    "/assets/images/egg_3.png",
    "/assets/images/egg_4.png",
  ];
  const frames = Array.isArray(images) && images.length > 0 ? images : defaultImgs;

  const [stage, setStage] = useState(0);
  const [hatching, setHatching] = useState(false);
  const intervalRef = useRef(null);
  const finishedRef = useRef(false);

  // default responsive style (menyesuaikan layar)
  const defaultImgClass =
    "w-full h-auto object-contain max-h-40 sm:max-h-56 md:max-h-72 lg:max-h-80 transition-transform duration-300";
  const finalImgClass = imgClassName || defaultImgClass;

  // cleanup interval saat unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!hatching) return;
    if (intervalRef.current) return;

    let s = 0;
    setStage(0);
    finishedRef.current = false;

    intervalRef.current = setInterval(() => {
      s++;
      setStage(s);

      if (s >= frames.length - 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        setTimeout(() => {
          if (!finishedRef.current) {
            finishedRef.current = true;
            try {
              onHatched();
            } catch (e) {
              console.warn("onHatched callback error", e);
            }
          }
        }, 600);
      }
    }, 400);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hatching]);

  function startHatch() {
    if (hatching) return;
    setHatching(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startHatch();
    }
  }

  return (
    <div className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] mx-auto">
      <button
        type="button"
        aria-label={hatching ? "Sedang menetas" : "Klik untuk menetas"}
        onClick={startHatch}
        onKeyDown={handleKeyDown}
        disabled={hatching}
        className="w-full bg-transparent border-none p-0 m-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg"
      >
        <img
          src={frames[Math.min(stage, frames.length - 1)]}
          alt="Telur dinosaurus"
          className={finalImgClass}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImgs[0] || "";
          }}
          onTouchStart={() => {
            if (!hatching) startHatch();
          }}
        />
      </button>
    </div>
  );
}
