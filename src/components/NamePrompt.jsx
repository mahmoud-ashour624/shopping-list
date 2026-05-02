import { useState } from 'react'

const MAX_NAME = 30

export default function NamePrompt({ onSave }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter your name')
      return
    }
    if (trimmed.length > MAX_NAME) {
      setError(`Name must be ${MAX_NAME} characters or less`)
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-5xl">🏖️</span>
          <h1 className="text-xl font-bold text-gray-900 mt-3">Vacation List</h1>
          <p className="text-sm text-gray-500 mt-1">
            What should we call you?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null) }}
            placeholder="Your name…"
            maxLength={MAX_NAME + 1}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
              error ? 'border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
            }`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all"
          >
            Let's go →
          </button>
        </form>
      </div>
    </div>
  )
}
