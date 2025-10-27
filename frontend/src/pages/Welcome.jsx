// src/pages/Welcome.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Welcome({ onNext }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-center px-4 py-10 md:py-14">
      {/* Judul */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 md:mb-12 leading-tight"
        style={{
          fontFamily: "'Bungee', cursive",
          transform: "rotate(-3deg)",
          color: "#fff",
          textShadow: `
            7px 3px 0 #302f2f,
            -3px -3px 0 #302f2f,
            3px -3px 0 #302f2f,
            -3px 3px 0 #302f2f
          `,
        }}
      >
        Selamat Datang <br /> Petualang Cilik!
      </motion.h1>

      {/* Kontainer papan kayu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="
          relative inline-block 
          px-6 py-6 sm:px-8 sm:py-8 
          rounded-lg
        "
        style={{
          backgroundImage: "url('/assets/images/wooden-board.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          maxWidth: "90%",
        }}
      >
        {/* Overlay teks & tombol */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-5 drop-shadow-md">
            Siap berpetualang <br /> berburu telur dino? <br /> Yuk baca peraturan dulu!
          </p>

          <button
            onClick={onNext}
            className="btn-jw flex items-center gap-2 text-xs sm:text-sm md:text-base px-4 py-2 md:px-5 md:py-2 animate-pulse-slow"
          >
            🗺️ Game Rules 🗺️
          </button>
        </div>
      </motion.div>
    </div>
  );
}
