const DIFFICULTY_COLORS = {
  Easy: 'text-green-400 bg-green-400/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30',
  Hard: 'text-orange-400 bg-orange-400/10 border-orange-500/30',
  Legendary: 'text-red-400 bg-red-400/10 border-red-500/30',
  Unknown: 'text-purple-400 bg-purple-400/10 border-purple-500/30',
}

const TYPE_ICONS = {
  boss: '☠',
  enemy: '⚔',
  item: '✦',
  location: '◎',
}

const FALLBACK_MESSAGES = [
  "The ancient tomes are overwhelmed with seekers. Try again in a moment.",
  "The spirits are busy — the grimoire pages blur. Try again shortly.",
  "Too many seekers consult the grimoire at once. Wait a moment and try again.",
]

export default function BossCard({ data }) {
  const diffColor = DIFFICULTY_COLORS[data.difficulty] || DIFFICULTY_COLORS.Unknown
  const typeIcon = TYPE_ICONS[data.type]
  const isFailed = data.error || (data.tips?.length === 1 && data.tips[0].includes('could not retrieve'))

  const randomFallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)]

  if (isFailed) {
    return (
      <div className="bg-[#1a1625] border border-purple-900/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]">
        <div className="text-4xl opacity-40">📖</div>
        <p className="text-purple-400/70 text-sm text-center leading-relaxed max-w-xs">
          {randomFallback}
        </p>
        <p className="text-purple-600/40 text-xs text-center">
          The chat is still available — ask Grimoire directly.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1625] border border-purple-900/40 rounded-2xl p-6 flex flex-col gap-5">

      {/* Name + meta */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-2xl font-bold text-purple-100 leading-tight">{data.name}</h2>
          {data.difficulty && data.difficulty !== 'Unknown' && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${diffColor}`}>
              {data.difficulty}
            </span>
          )}
        </div>
        {typeIcon && (
          <span className="text-xs text-purple-500 uppercase tracking-widest">
            {typeIcon} {data.type}
          </span>
        )}
      </div>

      {/* Lore */}
      {data.lore && data.lore !== 'Unknown' && (
        <div>
          <h3 className="text-xs text-purple-500 uppercase tracking-widest mb-2">Lore</h3>
          <p className="text-purple-200/80 text-sm leading-relaxed italic">{data.lore}</p>
        </div>
      )}

      {/* Weaknesses */}
      {data.weaknesses?.length > 0 && (
        <div>
          <h3 className="text-xs text-purple-500 uppercase tracking-widest mb-2">Weaknesses</h3>
          <div className="flex flex-wrap gap-2">
            {data.weaknesses.map(w => (
              <span key={w} className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300">
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Resistances */}
      {data.resistances?.length > 0 && (
        <div>
          <h3 className="text-xs text-purple-500 uppercase tracking-widest mb-2">Resistances</h3>
          <div className="flex flex-wrap gap-2">
            {data.resistances.map(r => (
              <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Loot */}
      {data.loot?.length > 0 && (
        <div>
          <h3 className="text-xs text-purple-500 uppercase tracking-widest mb-2">Loot</h3>
          <div className="flex flex-col gap-1.5">
            {data.loot.map((l, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-purple-200/80">✦ {l.item}</span>
                <span className="text-purple-500 text-xs">{l.chance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {data.tips?.length > 0 && (
        <div>
          <h3 className="text-xs text-purple-500 uppercase tracking-widest mb-2">Tips</h3>
          <ul className="flex flex-col gap-2">
            {data.tips.map((tip, i) => (
              <li key={i} className="text-sm text-purple-200/70 flex gap-2">
                <span className="text-purple-600 shrink-0 mt-0.5">›</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
