import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import axios from "axios";
import Level from "./Level";
import Dinoku from "./Dinoku";

export default function Home({ player, setPlayer, onBack }) {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState([]);
  const [view, setView] = useState("main");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [clueLevel, setClueLevel] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // status/toast
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");
  const statusTimerRef = useRef(null);

    // Judul clue berbeda tiap level
  const clueTitles = {
    1: "Tahukah kamu? 🤔",
    2: "Pernah berpikir bagaimana cara berbagi adil? 🍰",
    3: "Siap memecahkan cerita matematika? 📖",
    4: "Waktunya jadi detektif matematika! 🔍"
  };
  
  // Clue tiap level
  const clues = {
    1: "Perkalian adalah cara cepat untuk menjumlah bilangan yang sama berulang kali!",
    2: "Pembagian membantu kita membagi benda menjadi kelompok yang sama besar.",
    3: "Soal cerita melatihmu memahami situasi nyata dengan operasi hitung yang tepat!",
    4: "Terdapat 4 penjelajah cilik yang masing-masing memiliki persediaan apel sebanyak 2 buah. Berapakah total apel yang mereka miliki untuk bertahan selama 1 hari di hutan?"
  };

    // Judul penutup tiap level
  const closingTitles = {
    1: "Sudah paham? Siap jadi ahli kali cepat? 🚀",
    2: "Mudah, kan? Yuk asah kemampuan kamu membagi angka!💪",
    3: "Siap memecahkan teka teki soal cerita? 🧠✨",
    4: "Mantap! Yuk buktikan kemampuanmu menemukan operasi dan hasilnya! 🚀"
  };

  // Petunjuk / instruksi level (clue level)
  const levelInstructions = {
    1: "pada level 1 ini, Kamu akan mengerjakan 5 soal perkalian acak yang masing-masing diberi waktu 30 detik. kerjakan dengan teliti ya!",
    2: "di level 2 Kamu akan mengerjakan 5 soal pembagian acak yang masing-masing diberi waktu pengerjaan selama 30 detik. jangan sampai salah hitung ya!",
    3: "pada level 3 akan ada 5 soal cerita beserta gambar ilustrasinya, waktu kamu hanya 1 menit untuk setiap soal dan tulis hasil akhirnya saja. baca dan pahami betul soal dan gambarnya ya!",
    4: "di level 4 Kamu akan menyelesaikan 5 soal cerita (1 menit per soal) dan menuliskan dua angka, operasi, serta hasil akhirnya. jadi baca dengan teliti ya! jangan sampai ada yang salah☺️"
  };

  // Materi tambahan panjang + placeholder gambar per level
  const materials = {
    1: `Kita bisa melihat bahwa ada 5 kelompok, dan tiap kelompok berisi 3 semangka.
        Kalau kita jumlahkan: 3 + 3 + 3 + 3 + 3 = 15 🍉
        Nah, itu sama artinya dengan 5 × 3 = 15.
        
        Jadi… perkalian dapat diartikan sebagai penjumlahan berulang dari bilangan yang sama.
        Operasi ini membantu kita menghitung lebih cepat tanpa harus menulis penjumlahan panjang.`,
    2: `Kita tahu bahwa 9 kue dibagi ke 3 kelompok, dan setiap piring berisi 3 kue.
        Jadi operasinya adalah 9 : 3 = 3 🍰

        Kalau kamu lihat dari sisi lain, pembagian juga bisa dianggap sebagai pengurangan berulang loh! misal:
        9 - 3 - 3 - 3 = 0  →  karena ada 3 kali pengurangan → maka  9 : 3 = 3 
        
        Kesimpulannya, pembagian adalah proses membagi sesuatu menjadi bagian yang sama besar, atau mengulang pengurangan bilangan yang sama.`,
    3: `Dari gambar, kamu bisa menulis kalimat matematikanya:
        “2 × 6 = 12” — karena setiap keranjang berisi 2 telur, dengan jumlah keranjang sebanyak 6 buah. 

        Nah kalo kamu dapet teka teki berupa soal cerita, nih aku kasih tahu rahasia cara ngerjainnya🤫
        1️⃣ Baca soal dengan teliti dan temukan kata kunci.
        2️⃣ Temukan angka-angka penting.
        3️⃣ Dari kata kunci, tentukan operasinya.
        4️⃣ Hitung dan tulis hasil akhirnya.`,
    4: `Dari gambar dan soal cerita yang ada, ditemukan kata kunci yaitu "total" yang berarti kita perlu menjumlahkan apel secara keseluruhan. ditemukan juga angka "4" dan "2" yang kemungkinan besar akan digunakan dalam operasi hitung.
        maka operasinya adalah : 2 + 2 + 2 + 2 = 2 × 4 = 8  🍎

        mudah bukan? kamu hanya perlu teliti dalam menemukan kata kunci dan angka yang ada pada soal cerita saat membacanya.`,
  };

  useEffect(() => {
    fetchLeaderboard();
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await axios.get("/api/leaderboard");
      setPlayers(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  function showStatus(msg, type = "info", duration = 3000) {
    setStatusMsg(msg);
    setStatusType(type);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setStatusMsg("");
      setStatusType("info");
    }, duration);
  }

  async function enterGame() {
    if (!name) {
      showStatus("Masukkan nama unik", "error");
      return;
    }
    try {
      const res = await axios.post("/api/player", { name });
      setPlayer(res.data.player);
      setPlayer((prev) => ({ ...res.data.player, levels: res.data.levels || [] }));
      showStatus("Selamat datang, " + res.data.player.name, "success");
      setName("");
      fetchLeaderboard();
    } catch (e) {
      console.error(e);
      showStatus("Gagal membuat pemain", "error");
    }
  }

  function handleFinish(data) {
    showStatus("Level selesai! Skor total: " + (data?.totalScore ?? ''), "success");
    setView("main");
    fetchLeaderboard();

    // Upayakan update player levels di UI bila server mengembalikan info terkait
    try {
      if (data?.player) {
        setPlayer(data.player)
      } else if (data?.updatedPlayer) {
        setPlayer((prev) => ({ ...prev, ...data.updatedPlayer }))
      } else if (data?.levels) {
        setPlayer((prev) => ({ ...(prev || {}), levels: data.levels }))
      }
    } catch (e) {
      console.warn('handleFinish update player failed', e)
    }
  }

  function resetName() {
    setPlayer(null);
    setName("");
  }

  // ---------------------- ADD / MOVE THIS (inside Home component, before return) ----------------------
  function canAccessLevel(num) {
    if (!player) return false
    if (num === 1) return true
    const levels = player.levels || []
    for (let i = 1; i < num; i++) {
      const found = levels.find((l) => Number(l.level_number) === i && l.status === "completed")
      if (!found) return false
    }
    return true
  }
  // ---------------------------------------------------------------------------------------------

  // jika view level / dinoku
  if (view === "level" && selectedLevel)
    return (
      <Level
        player={player}
        levelNumber={selectedLevel}
        onFinish={handleFinish}
        onBack={() => setView("main")}
      />
    );
  if (view === "dinoku")
    return <Dinoku player={player} onBack={() => setView("main")} />;

  return (
    <div className="relative w-full min-h-screen">
      {/* Status/Toast */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base ${
            statusType === "success"
              ? "bg-green-600 text-white"
              : statusType === "error"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {statusMsg}
        </motion.div>
      )}

      <div className="p-6 sm:p-8">
        {/* Judul (kalau belum ada nama) */}
        {!player?.name && (
          <div className="flex justify-center mb-6">
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold"
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#fff",
                textShadow: `
                  7px 3px 0 #302f2f,
                  -3px -3px 0 #302f2f,
                  3px -3px 0 #302f2f,
                  -3px 3px 0 #302f2f
                `
              }}
            >
              MASUKKAN NAMAMU DIBAWAH INI
            </motion.h1>
          </div>
        )}

        {/* Input nama / ucapan */}
        <div className="flex flex-col items-center gap-4">
          {!player?.name ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <motion.input
                whileFocus={{ scale: 1.05 }}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                placeholder="Nama Petualang"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-jw text-sm sm:text-base"
                onClick={enterGame}
              >
                Enter
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-2 text-center"
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#fff",
                textShadow: `
                  5px 2px 0 #302f2f,
                  -2px -2px 0 #302f2f,
                  2px -2px 0 #302f2f,
                  -2px 2px 0 #302f2f
                `
              }}
            >
              <motion.p
                className="font-black text-lg sm:text-xl text-white tracking-wide leading-relaxed"
                style={{
                  WebkitTextStroke: "0.8px black", // outline tipis
                  textShadow: "0 0 2px rgba(0,0,0,0.25)", // sedikit lembut di tepi
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Halo, {player.name}! 🎉
              </motion.p>

              <motion.p
                className="font-extrabold text-sm sm:text-base text-white max-w-xl tracking-wide leading-loose mt-3"
                style={{
                  WebkitTextStroke: "0.6px black",
                  textShadow: "0 0 1.5px rgba(0,0,0,0.25)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Mainkan setiap level untuk mengumpulkan telur dino🚀
              </motion.p>
              <motion.button
                onClick={resetName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 px-3 py-1 text-xs sm:text-sm rounded-xl border-2 border-gray-500 shadow bg-white text-gray-700"
              >
                Ganti Nama
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Pulau Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
          {/* Pulau Petualangan */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <p
              className="font-black text-base sm:text-lg text-white leading-relaxed"
              style={{
                WebkitTextStroke: "0.8px black", // outline halus tapi tetap jelas
                textShadow: "0 0 2px rgba(0,0,0,0.25)", // bayangan lembut
                letterSpacing: "0.08em", // jarak antar huruf sedikit lebih rapat
              }}
            >
              Baca instruksi 🔍
            </p>
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((num, i) => (
                <motion.div
                  key={num}
                  className="flex gap-2 items-center"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <motion.button
                    className="btn-jw text-xs sm:text-sm"
                    onClick={() => {
                      // jika player belum login, tetap navigasi ke Level (Level.jsx akan menampilkan instruksi)
                      if (!player) {
                        setSelectedLevel(num)
                        setView("level")
                        return
                      }

                      // kalau player ada, cek akses level normal
                      if (!canAccessLevel(num)) {
                        showStatus(`Selesaikan level sebelumnya untuk membuka Level ${num}`, "error")
                        return
                      }

                      setSelectedLevel(num)
                      setView("level")
                    }}
                    // hanya disable ketika player sudah ada dan level terkunci
                    disabled={!canAccessLevel(num) && !!player}
                    title={!canAccessLevel(num) && !!player ? `Locked: selesaikan level sebelumnya` : `Buka Level ${num}`}
                  >
                    Level {num}
                  </motion.button>
                  <motion.button
                    className="btn-jw px-3 py-2 text-xs sm:text-sm"
                    onClick={() => setClueLevel(num)}
                  >
                    🔍
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Koleksi Dinoku */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center sm:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-jw text-sm sm:text-base"
              onClick={() => setView("dinoku")}
            >
              Koleksi Dinoku
            </motion.button>
          </motion.div>
        </div>

        {/* Popup Clue (diperbesar & scrollable seperti leaderboard) */}
        {clueLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          >
            <div className="bg-[#fff] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80%] flex flex-col overflow-hidden border-4 border-[#394b23]">
              {/* Header */}
              <div className="bg-[#394b23] text-white py-4 px-6 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold">
                  🔍 Clue & Materi — Level {clueLevel}
                </h2>
              </div>

              {/* Content wrapper: scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Short clue */}
                <div className="mb-4">
                  <h3 className="font-bold text-center text-sm mb-2">
                    {clueTitles[clueLevel] || "Apa yang akan kita lakukan pada level ini?🤔"}
                  </h3>
                  <p className="text-center text-sm text-gray-700">{clues[clueLevel]}</p>
                </div>

                {/* Ilustrasi */}
                <div className="mb-6 flex justify-center">
                  <img
                    src={`/assets/images/gambar_ilustrasi_materi_${clueLevel}.png`}
                    alt={`Ilustrasi materi level ${clueLevel}`}
                    className="max-h-48 object-contain rounded-lg border shadow-sm"
                    onError={(e) => {
                      // fallback bila gambar tidak ditemukan
                      e.currentTarget.src = `/assets/images/placeholder_materi.png`;
                    }}
                  />
                </div>

                {/* Materi panjang (placeholder) */}
                <div className="mb-6">
                  <h4 className="font-bold text-base mb-2">Apa arti gambar di atas?</h4>
                    <p className="text-justify text-sm leading-relaxed whitespace-pre-line font-poppins text-gray-800">
                      {materials[clueLevel]}
                    </p>
                </div>

                {/* Penutup dan instruksi level */}
                <div className="mb-6 text-center">
                  <h4 className="font-bold text-base mb-2 text-[#394b23]">
                    {closingTitles[clueLevel]}
                  </h4>
                    <p className="text-center text-sm leading-relaxed whitespace-pre-line font-poppins text-gray-800">
                    {levelInstructions[clueLevel]}
                  </p>
                </div>
              </div>

              {/* Footer (tombol tutup) */}
              <div className="bg-[#658245] py-3 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#394b23] hover:bg-[#5a7041] transition"
                  onClick={() => setClueLevel(null)}
                >
                  ✖ Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="btn-jw fixed bottom-6 right-6 z-[999] text-sm sm:text-base"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLeaderboard(true)}
        >
          🏆 Leaderboard
        </motion.button>

        {/* Popup Leaderboard */}
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          >
            <div className="bg-[#cde5fd] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80%] flex flex-col overflow-hidden border-4 border-[#394b23]">
              {/* Header */}
              <div className="bg-[#394b23] text-white py-4 px-6 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                  🏆 Leaderboard
                </h2>
              </div>
              {/* Table wrapper */}
              <div className="flex-1 overflow-y-auto overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead className="bg-[#7ea356] text-white sticky top-0">
                    <tr>
                      <th className="p-3 text-left">Nama</th>
                      <th className="p-3 text-left">Skor</th>
                      <th className="p-3 text-left">Waktu</th>
                      <th className="p-3 text-left">Dino</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={`${
                          idx % 2 === 0 ? "bg-[#fff3d9]" : "bg-[#cde5fd]"
                        } hover:bg-[#7ea356]/20 transition`}
                      >
                        <td className="p-3 font-semibold text-[#394b23]">
                          {p.name}
                        </td>
                        <td className="p-3 text-[#566569]">{p.score}</td>
                        <td className="p-3 text-[#566569]">{p.total_time}</td>
                        <td className="p-3 text-[#566569]">{p.dinos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="bg-[#658245] py-3 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#394b23] hover:bg-[#5a7041] transition"
                  onClick={() => setShowLeaderboard(false)}
                >
                  ✖ Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tombol Kembali */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="fixed bottom-4 left-4"
        >
          <button onClick={onBack} className="btn-jw text-xs sm:text-sm">
            ↩
          </button>
        </motion.div>
      </div>
    </div>
  );
}
