const GAMES = [
  'Elden Ring',
  'Dark Souls',
  'Dark Souls 2',
  'Dark Souls 3',
  'Bloodborne',
  'Sekiro',
  'Baldur\'s Gate 3',
  'Final Fantasy XVI',
  'Monster Hunter World',
  'God of War',
  'Hollow Knight',
  'Zelda: Tears of the Kingdom',
]

export default function SearchBar({ query, setQuery, game, setGame, onSearch, loading }) {
  function handleKey(e) {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={game}
        onChange={e => setGame(e.target.value)}
        className="bg-[#1a1625] border border-purple-800/40 text-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 sm:w-48 shrink-0"
      >
        {GAMES.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <div className="flex flex-1 gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search boss, enemy, or creature..."
          className="flex-1 bg-[#1a1625] border border-purple-800/40 text-white rounded-xl px-4 py-3 text-sm placeholder-purple-700/50 focus:outline-none focus:border-purple-500/60"
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors shrink-0"
        >
          {loading ? '...' : 'Consult'}
        </button>
      </div>
    </div>
  )
}