import { useState } from 'react'

const GAMES = [
  'Elden Ring',
  'Dark Souls',
  'Dark Souls 2',
  'Dark Souls 3',
  'Bloodborne',
  'Sekiro',
  "Baldur's Gate 3",
  'Final Fantasy XVI',
  'Monster Hunter World',
  'God of War 2018',
  'God of War Ragnarök',
  'Hollow Knight',
  'Zelda: Tears of the Kingdom',
  'Black Myth: Wukong',
  'Lies of P',
  'The First Beserker: Khazan',
  'Nioh 2',
  'Wo Long: Fallen Dynasty',
  'Remnant 2',
  'Star Wars Jedi: Survivor',
]

const GACHA_GAMES = [
  'Genshin Impact',
  'Twisted Wonderland',
  'Fate/Grand Order',
  'Infinity Nikki',
  'Honkai: Star Rail',
  'Zenless Zone Zero',
  'Wuthering Waves'
]

export default function SearchBar({ query, setQuery, game, setGame, onSearch, loading }) {
  const [isListening, setIsListening] = useState(false)

  function handleKey(e) {
    if (e.key === 'Enter') onSearch()
  }

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript.replace(/\.$/g, ''));
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={game}
        onChange={e => setGame(e.target.value)}
        className="bg-[#1a1625] border border-purple-800/40 text-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 sm:w-48 shrink-0"
      >
        <optgroup label="Souls-Like">
          {GAMES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </optgroup>

        <optgroup label="Gacha Games">
          {GACHA_GAMES.map(g=>(
            <option key={g} value={g}>{g}</option>
          ))}
        </optgroup>
      </select>

      <div className="flex flex-1 gap-3 relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search boss, enemy, or creature..."
          className="flex-1 bg-[#1a1625] border border-purple-800/40 text-white rounded-xl px-4 py-3 pr-12 text-sm placeholder-purple-700/50 focus:outline-none focus:border-purple-500/60 focus:shadow-lg focus:shadow-purple-900/30"
        />
        
        <button
          type="button"
          onClick={startVoiceSearch}
          className={`absolute right-[115px] top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
            isListening ? 'listening-active text-red-500 bg-red-500/10' : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          onClick={onSearch}
          disabled={loading}
          className="shimmer-btn bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors shrink-0"
        >
          {loading ? '...' : 'Consult'}
        </button>
      </div>
    </div>
  )
}
