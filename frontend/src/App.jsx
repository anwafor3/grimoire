import { useState } from 'react'
import axios from 'axios'
import BossCard from './components/BossCard'
import ChatPanel from './components/ChatPanel'
import SearchBar from './components/SearchBar'

const API = 'http://127.0.0.1:8000'

export default function App() {
  const [query, setQuery] = useState('')
  const [game, setGame] = useState('Elden Ring')
  const [bossData, setBossData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [arcaneMode, setArcaneMode] = useState(false)
  const [error, setError] = useState('')

  async function handleLookup() {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setBossData(null)
    try {
      const res = await axios.post(`${API}/lookup`, { query, game })
      setBossData(res.data)
    } catch (e) {
      setError('The grimoire could not be reached. Is the backend running?')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0e0c15] text-white">

      {/* Header */}
      <header className="border-b border-purple-900/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-lg">
            📖
          </div>
          <span className="text-xl font-semibold tracking-wide text-purple-100">Grimoire</span>
          <span className="text-xs text-purple-400/60 hidden sm:block">— your RPG familiar spirit</span>
        </div>
        <button
          onClick={() => setArcaneMode(!arcaneMode)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            arcaneMode
              ? 'bg-purple-600/30 border-purple-500/60 text-purple-200'
              : 'bg-transparent border-purple-800/40 text-purple-400 hover:border-purple-600/60'
          }`}
        >
          {arcaneMode ? '✦ Arcane mode' : '✦ Plain mode'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Hero */}
        {!bossData && !loading && (
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-purple-100 mb-3">
              What haunts your path?
            </h1>
            <p className="text-purple-400/70 text-lg">
              Speak the name of any boss, enemy, or creature.
            </p>
          </div>
        )}

        {/* Search */}
        <SearchBar
          query={query}
          setQuery={setQuery}
          game={game}
          setGame={setGame}
          onSearch={handleLookup}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center mt-16">
            <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-purple-400/70 text-sm">Consulting the ancient tomes...</p>
          </div>
        )}

        {/* Results */}
        {bossData && !loading && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BossCard data={bossData} />
            <ChatPanel
              query={query}
              game={game}
              bossName={bossData.name}
              arcaneMode={arcaneMode}
              api={API}
            />
          </div>
        )}
      </main>
    </div>
  )
}