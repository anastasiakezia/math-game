// src/pages/Dinoku.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const LOCAL_NAME_KEY = "dinoname_map_v1";

/**
 * readLocalNameMapForPlayer
 * returns an object mapping dinoId -> dinoName for the given playerId
 */
function readLocalNameMapForPlayer(playerId) {
  try {
    const raw = localStorage.getItem(LOCAL_NAME_KEY);
    if (!raw) return {};
    const all = JSON.parse(raw);

    // migrate legacy flat map into per-player map if necessary
    const isFlat =
      Object.keys(all || {}).length > 0 &&
      Object.values(all).every((v) => typeof v === "string");
    if (playerId && isFlat && !all[playerId]) {
      const migrated = { [playerId]: all };
      localStorage.setItem(LOCAL_NAME_KEY, JSON.stringify(migrated));
      return migrated[playerId] || {};
    }

    return all?.[playerId] || {};
  } catch (e) {
    console.error("readLocalNameMapForPlayer error", e);
    return {};
  }
}

/**
 * writeLocalNameMapForPlayer
 * writes the map (dinoId -> dinoName) for the player
 */
function writeLocalNameMapForPlayer(playerId, mapForPlayer) {
  try {
    const raw = localStorage.getItem(LOCAL_NAME_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[playerId] = mapForPlayer || {};
    localStorage.setItem(LOCAL_NAME_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("writeLocalNameMapForPlayer error", e);
  }
}

export default function Dinoku({ player, onBack }) {
  const [dinos, setDinos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (player) fetchDinos();
    else {
      setDinos([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    function onDinoAdded(e) {
      const detail = e?.detail;
      if (!detail) {
        // if no detail, re-fetch (some other part signaled change)
        fetchDinos();
        return;
      }

      // ignore events for different player
      if (detail.player_id && String(detail.player_id) !== String(player?.id)) {
        return;
      }

      // if server item (has id not starting with temp-), prefer refetch to get canonical list
      if (detail.id && !String(detail.id).startsWith("temp-")) {
        setDinos((prev) => {
          const idx = prev.findIndex((d) => String(d.id) === String(detail.id));
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...detail };
            return copy;
          }
          // otherwise re-fetch so server-canonical data is shown
          fetchDinos();
          return prev;
        });
        return;
      }

      // otherwise it's a local/temp item — prepend unless duplicate
      setDinos((prev) => {
        const exists = prev.some(
          (d) =>
            (d.id && detail.id && d.id === detail.id) ||
            (d.dino_type === detail.dino_type &&
              d.dino_name === detail.dino_name &&
              d.localOnly)
        );
        if (exists) return prev;
        return [detail, ...prev];
      });
    }

    window.addEventListener("dinoAdded", onDinoAdded);
    return () => window.removeEventListener("dinoAdded", onDinoAdded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  async function fetchDinos() {
    if (!player) {
      setDinos([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Try several common endpoints (backends may vary)
    const endpoints = [
      `/api/dinos/${player.id}`,
      `/api/dinos?player_id=${player.id}`,
      `/api/players/${player.id}/dinos`,
    ];

    for (const url of endpoints) {
      try {
        const res = await axios.get(url);
        if (res?.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          // dedupe by id or composite key
          const idMap = new Map();
          list.forEach((d) => {
            if (d.id) idMap.set(String(d.id), d);
            else {
              const key = `${(d.dino_type || "")
                .toString()
                .trim()
                .toLowerCase()}::${(d.image || "").toString().trim()}::${d.dino_name || ""}`;
              if (!idMap.has(key)) idMap.set(key, d);
            }
          });
          const serverItems = Array.from(idMap.values());

          // overlay local name map (player-specific)
          const localMap = readLocalNameMapForPlayer(player.id);
          const appliedServer = serverItems.map((s) => {
            if (s.id && localMap[s.id]) {
              return { ...s, dino_name: localMap[s.id], localOnly: true };
            }
            return s;
          });

          // also include local-only temp entries previously added
          const prev = dinos || [];
          const serverKeys = new Set(
            appliedServer.map(
              (s) =>
                `${(s.dino_type || "").toString().trim().toLowerCase()}::${(s.image || "")
                  .toString()
                  .trim()}`
            )
          );
          const localTemps = prev
            .filter((p) => String(p.id).startsWith("temp-"))
            .filter((t) => {
              const key = `${(t.dino_type || "").toString().trim().toLowerCase()}::${(t.image || "")
                .toString()
                .trim()}`;
              return !serverKeys.has(key);
            });

          setDinos([...appliedServer, ...localTemps]);
          setLoading(false);
          return;
        }
      } catch (err) {
        // try next endpoint
        console.warn("fetchDinos failed for", url, err?.response?.status);
      }
    }

    // All endpoints failed — fallback to localStorage map for this player
    try {
      const localMap = readLocalNameMapForPlayer(player.id);
      const localItems = Object.entries(localMap).map(([id, name]) => ({
        id,
        dino_name: name,
        dino_type: "Unknown",
        image: "/assets/images/dino_default.png",
        localOnly: true,
      }));
      setDinos(localItems);
    } catch (e) {
      console.error("fallback readLocalNameMapForPlayer failed", e);
      setDinos([]);
    } finally {
      setLoading(false);
    }
  }

  // UI
  if (!player)
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white/90 rounded-2xl shadow-xl px-6 py-4 text-center">
          Yuk isi nama kamu dulu di halaman utama!
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-jw mt-6"
          onClick={onBack}
        >
          ⬅ Kembali
        </motion.button>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div
        className="max-w-6xl mx-auto bg-[#cde5fd] border-4 border-[#394b23] rounded-2xl shadow-2xl p-4 sm:p-6"
      >
        {/* Header / back */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-jw"
            onClick={onBack}
            aria-label="Kembali"
          >
            ⬅
          </motion.button>

          <motion.h3
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-extrabold text-[#394b23]"
          >
            🦖 Koleksi Dinoku
          </motion.h3>

          <div style={{ width: 48 }} /> {/* spacer to keep center title */}
        </div>

{loading ? (
  <div className="text-center py-8">Memuat koleksi...</div>
) : dinos.length > 0 ? (
  // Panel mirip popup Leaderboard: header + konten scrollable
  <div className="w-full">
    <div className="bg-[#cde5fd] rounded-2xl shadow-2xl w-full border-4 border-[#394b23] overflow-hidden flex flex-col"
         style={{ maxHeight: '80vh' /* atau 'calc(100vh - 180px)' jika mau lebih presisi */ }}>
      {/* optional internal header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#394b23] bg-[#e6f2ff]">
        <div className="font-extrabold text-[#394b23]">Koleksi Dinoku</div>
        <div className="text-sm text-[#566569]">{dinos.length} dinos</div>
      </div>

      {/* content area (scrollable) */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {dinos.map((d, i) => (
            <motion.div
              key={d.id || `slot-${i}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-[#fff3d9] border-2 border-[#7ea356] rounded-2xl shadow-md p-3 sm:p-4 text-center hover:scale-105 hover:shadow-xl transition flex flex-col items-center"
              role="group"
              aria-label={d.dino_name || "Dino"}
              style={{ minHeight: 220, maxWidth: 320, margin: '0 auto' }}
            >
              <img
                src={d.image || "/assets/images/dino_default.png"}
                alt={d.dino_name || d.dino_type || "Dino"}
                className="h-20 sm:h-28 w-auto mx-auto object-contain drop-shadow-md flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/dino_default.png";
                }}
              />

              <div className="mt-2 sm:mt-3 w-full px-1 flex-grow flex flex-col justify-start">
                <div
                  className="font-bold text-[#394b23] text-sm sm:text-base"
                  title={d.dino_name || d.dino_type || "Nameless Dino"}
                  style={{
                    whiteSpace: "normal",
                    textOverflow: "clip",
                    overflow: "visible",
                    wordBreak: "break-word",
                    lineHeight: '1.15rem',
                  }}
                >
                  {d.dino_name || d.dino_type || "Nameless Dino"}
                </div>

                <div
                  className="text-xs sm:text-sm text-[#566569] mt-1"
                  title={d.dino_type || "Unknown"}
                  style={{
                    whiteSpace: "normal",
                    overflow: "visible",
                    wordBreak: "break-word",
                  }}
                >
                  {d.dino_type || "Unknown"}
                </div>

                {d.localOnly && (
                  <div className="text-xs text-orange-600 mt-2">🦖 Lokal</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* optional footer */}
      <div className="bg-[#e6f2ff] py-3 px-4 text-right text-sm text-[#394b23]">
        <button onClick={onBack} className="btn-jw">Kembali</button>
      </div>
    </div>
  </div>
) : (
  <div className="text-center text-[#566569] mt-8 text-sm sm:text-base">
    Belum ada dino 🥺 <br />
    Mainkan level untuk mendapatkan dinosaurus!
  </div>
)}
      </div>
    </div>
  );
}
