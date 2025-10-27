import React from "react";
import { motion } from "framer-motion";

export default function Rules({ onNext, onBack }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Judul */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-8 sm:mb-12 text-center"
        style={{
          fontFamily: "'Bungee', cursive",
          transform: "rotate(-2deg)",
          color: "#fff",
          textShadow: `
            7px 3px 0 #302f2f,
            -3px -3px 0 #302f2f,
            3px -3px 0 #302f2f,
            -3px 3px 0 #302f2f
          `,
        }}
      >
        GAME RULES
      </motion.h1>

      {/* Daftar peraturan */}
      <motion.ol
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="list-decimal text-left pl-6 text-base sm:text-lg md:text-xl font-bold space-y-4 sm:space-y-6 mb-10 sm:mb-12 max-w-prose"
        style={{
          color: "#302f2f",
          textShadow: "1px 1px 0 #fff",
        }}
      >
        <li>Kerjakan soal di tiap level.</li>
        <li>Setiap jawaban benar akan mendapatkan 5 poin dan 1 telur dino.</li>
        <li>
          Dino yang menetas akan disimpan di "Koleksi Dinoku" sebagai koleksi pemain.
        </li>
        <li>
          Ingat! level yang sudah dibuka tidak bisa dimainkan ulang, jadi kerjakan soal dengan teliti ya!
        </li>
      </motion.ol>

      {/* Tombol mulai */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mb-14 sm:mb-16"
      >
        <button onClick={onNext} className="btn-jw text-sm sm:text-base">
          Mulai!
        </button>
      </motion.div>

      {/* Tombol kembali (selalu terlihat) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <button onClick={onBack} className="btn-jw text-xs sm:text-sm">
          ↩
        </button>
      </motion.div>
    </div>
  );
}
