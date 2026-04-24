import { useState } from 'react'
import axios from 'axios'
import BossCard from './components/BossCard'
import ChatPanel from './components/ChatPanel'
import SearchBar from './components/SearchBar'

const API = 'https://grimoire-production-5719.up.railway.app'

export default function App() {
  const [query, setQuery] = useState('')
  const [game, setGame] = useState('Elden Ring')
  const [bossData, setBossData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [arcaneMode, setArcaneMode] = useState(false)
  const [arcaneTransition, setArcaneTransition] = useState(false)
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

  function toggleArcane() {
    if (!arcaneMode) {
      setArcaneTransition(true)
      setTimeout(() => setArcaneTransition(false), 1600)
    }
    setArcaneMode(!arcaneMode)
  }

  return (
    <div className="min-h-screen bg-[#0a0812] text-white relative overflow-x-hidden">

      {/* Arcane transition overlay */}
      {arcaneTransition && (
        <div className="fixed inset-0 z-50 pointer-events-none" style={{background:'rgba(10,8,18,0.95)'}}>
          {['10% 10%','80% 15%','15% 75%','75% 70%','45% 20%','20% 45%','70% 40%'].map((pos,i) => (
            <div key={i} style={{
              position:'absolute',
              left:pos.split(' ')[0],
              top:pos.split(' ')[1],
              fontSize:'28px',
              color:'#6d28d9',
              animation:`runefade 1.4s ${i*0.08}s ease-in-out forwards`,
              opacity:0
            }}>✦</div>
          ))}
          {[200,140,80].map((size,i) => (
            <div key={i} style={{
              position:'absolute',
              left:'50%',
              top:'50%',
              width:size,
              height:size,
              marginLeft:-size/2,
              marginTop:-size/2,
              borderRadius:'50%',
              border:'2px solid #7c3aed',
              boxShadow:'0 0 20px #7c3aed',
              animation:`ritualRing 1.2s ${i*0.15}s ease-out forwards`,
              opacity:0
            }}/>
          ))}
        </div>
      )}

      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-900/15 blur-[100px] animate-pulse" style={{animationDelay:'1.5s'}} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-purple-800/10 blur-[80px] animate-pulse" style={{animationDelay:'3s'}} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-900/30 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-[#0a0812]/60">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setBossData(null); setError(''); setQuery(''); }}>
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-lg shadow-lg shadow-purple-900/30">
            📖
          </div>
          <div>
            <span className="text-xl font-bold tracking-wide text-purple-100">Grimoire</span>
            <span className="text-xs text-purple-500/70 hidden sm:inline ml-2">— your RPG familiar spirit</span>
          </div>
        </div>
        <button
          onClick={toggleArcane}
          className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
            arcaneMode
              ? 'bg-purple-600/25 border-purple-500/50 text-purple-200 shadow-md shadow-purple-900/30'
              : 'bg-transparent border-purple-800/30 text-purple-500 hover:border-purple-600/50 hover:text-purple-300'
          }`}
        >
          {arcaneMode ? '✦ Arcane mode' : '✦ Plain mode'}
        </button>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        {!bossData && !loading && (
          <div className="text-center mb-12 pt-8">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-2xl scale-150" />
              <div className="float-icon relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-800/40 to-violet-900/40 border border-purple-600/30 flex items-center justify-center text-5xl shadow-xl shadow-purple-900/40">
                📖
              </div>
            </div>

            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-purple-100 to-purple-400 mb-4 leading-tight">
              What haunts your path?
            </h1>
            <p className="text-purple-400/60 text-lg max-w-md mx-auto leading-relaxed">
              Speak the name of any boss, character, or enemy — from soulslike dungeons to gacha realms. Grimoire will consult the ancient tomes.
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-8">
              {[
                {label: 'Malenia', game: 'Elden Ring'},
  {label: 'Lady Butterfly', game: 'Sekiro'},
  {label: 'Baldur', game: 'God of War 2018'},
  {label: 'Haytor', game: 'Zenless Zone Zero'},
  {label: 'Raiden Shogun', game: 'Genshin Impact'},
].map(s => (
              ].map(s => (
                <button
                  key={s.label}
                  onClick={() => { setQuery(s.label); setGame(s.game); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-purple-800/40 text-purple-400/70 hover:border-purple-500/60 hover:text-purple-200 hover:bg-purple-500/10 hover:shadow-md hover:shadow-purple-900/40 transition-all duration-200"
                >
                  {s.label}
                </button>
              ))}
            </div>
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
          <div className="mt-4 text-center">
            <p className="text-red-400/80 text-sm">{error}</p>
            <p className="text-purple-600/50 text-xs mt-1">Make sure the backend is running: <code className="bg-purple-900/30 px-1.5 py-0.5 rounded">uvicorn main:app --reload</code></p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center mt-20">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-800/20 border border-purple-700/30 flex items-center justify-center text-3xl mx-auto">
                📖
              </div>
              <div className="absolute inset-0 rounded-2xl border border-purple-500/40 animate-ping" />
            </div>
            <p className="text-purple-400/60 text-sm">Consulting the ancient tomes...</p>
            <p className="text-purple-600/40 text-xs mt-2">Scraping wikis + summoning Gemini...</p>
          </div>
        )}

        {/* Results */}
        {bossData && !loading && (
          <div className="mt-8">
            <button
              onClick={() => { setBossData(null); setError(''); }}
              className="text-xs text-purple-500 hover:text-purple-300 mb-6 flex items-center gap-1.5 transition-colors"
            >
              ← Search again
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BossCard data={bossData} />
              <ChatPanel
                query={query}
                game={game}
                bossName={bossData.name}
                arcaneMode={arcaneMode}
                api={API}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 text-center py-8 text-purple-800/40 text-xs">
        Grimoire — built with Gemini AI · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
