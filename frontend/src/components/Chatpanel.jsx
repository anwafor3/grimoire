import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

export default function ChatPanel({ query, game, bossName, arcaneMode, api }) {
  const [messages, setMessages] = useState([
    {
      role: 'grimoire',
      text: arcaneMode
        ? `The ancient pages stir... I sense thee seeks knowledge of ${bossName}. What wouldst thou know?`
        : `I've pulled everything I know about ${bossName}. What do you want to know?`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await axios.post(`${api}/chat`, {
        query,
        game,
        boss_context: bossName,
        message: userMsg,
        arcane_mode: arcaneMode,
      })
      setMessages(prev => [...prev, { role: 'grimoire', text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'grimoire', text: 'The pages blur... try again.' }])
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-[#1a1625] border border-purple-900/40 rounded-2xl flex flex-col h-[520px]">

      {/* Header */}
      <div className="px-5 py-4 border-b border-purple-900/30 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-sm text-purple-300 font-medium">Grimoire</span>
        <span className="text-xs text-purple-600 ml-1">
          {arcaneMode ? '— arcane mode' : '— companion mode'}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'grimoire' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm shrink-0 mt-0.5">
                📖
              </div>
            )}
            <div className={`max-w-[80%] text-sm leading-relaxed px-4 py-2.5 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-purple-600/25 text-purple-100 rounded-tr-sm'
                : 'bg-[#241d35] text-purple-200/90 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm shrink-0">
              📖
            </div>
            <div className="bg-[#241d35] px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-purple-900/30 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about this boss..."
          className="flex-1 bg-[#0e0c15] border border-purple-800/30 text-white text-sm rounded-xl px-4 py-2.5 placeholder-purple-700/40 focus:outline-none focus:border-purple-500/50"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          ↑
        </button>
      </div>
    </div>
  )
}