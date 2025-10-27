// src/App.jsx
import React, { useState } from 'react'
import Welcome from './pages/Welcome'
import Rules from './pages/Rules'
import Home from './pages/Home'
import AudioPlayer from './components/AudioPlayer'

export default function App() {
  const [page, setPage] = useState('welcome')
  const [player, setPlayer] = useState(null)

  // Tentukan background berdasarkan page
  const pageBackgrounds = {
    welcome: "bg-[url('/assets/images/welcomepage_bg.png')] bg-no-repeat bg-center bg-cover",
    rules:   "bg-[url('/assets/images/rules_bg.png')] bg-no-repeat bg-center bg-cover",
    home:    "bg-[url('/assets/images/home_bg.png')] bg-no-repeat bg-center bg-cover"
  };

  return (
    // full-screen background; keep it relative so absolute children place correctly
    <div className={`relative min-h-screen bg-cover bg-center ${pageBackgrounds[page]}`}>
      {/* overlay to darken or add consistent background tint if needed (optional)
          <div className="absolute inset-0 bg-black/0 pointer-events-none" /> 
      */}

      {/* Top controls (desktop): show on sm and up so it doesn't block mobile UI */}
      <div className="hidden sm:block absolute top-4 right-4 z-50">
        <AudioPlayer src="/assets/audio/background_music.mp3" />
      </div>

      {/* Mobile floating small audio control (bottom-right) */}
      <div className="block sm:hidden fixed bottom-4 right-4 z-50">
        {/* keep it small so it doesn't block gameplay */}
        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow">
          {/* reuse AudioPlayer but you might create a smaller variant; for now render small button */}
          <AudioPlayer src="/assets/audio/background_music.mp3" compact />
        </div>
      </div>

      {/* CONTENT: center & constrain width so content looks consistent across sizes */}
      <div className="relative z-10 min-h-screen flex items-start sm:items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-4xl">
          {page === 'welcome' && (
            <Welcome onNext={() => setPage('rules')} setPlayer={setPlayer} />
          )}

          {page === 'rules' && (
            <Rules
              onNext={() => setPage('home')}
              onBack={() => setPage('welcome')}
            />
          )}

          {page === 'home' && (
            <Home
              player={player}
              setPlayer={setPlayer}
              onBack={() => setPage('rules')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
