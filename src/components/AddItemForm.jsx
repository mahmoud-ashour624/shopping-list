import { useState } from 'react'
import { addItem } from '../services/itemService'

const MAX_CHARS = 100

export default function AddItemForm({ userId, userName }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const remaining = MAX_CHARS - name.length
  const isOverLimit = name.length > MAX_CHARS

  function handleChange(e) {
    setName(e.target.value)
    if (error) setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    if (isOverLimit) {
      setError(`Item name must be ${MAX_CHARS} characters or less`)
      return
    }

    setLoading(true)
    setError(null)
    try {
      await addItem(name, userId, userName)
      setName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="Add a new item to vote on..."
            disabled={loading}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400 disabled:opacity-50 transition ${
              isOverLimit
                ? 'border-red-300 focus:ring-red-300'
                : 'border-gray-200 focus:ring-blue-400'
            }`}
          />
          {name.length > 0 && (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums ${
                isOverLimit ? 'text-red-400' : remaining <= 20 ? 'text-amber-400' : 'text-gray-300'
              }`}
            >
              {remaining}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim() || isOverLimit}
          className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold shadow-sm hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Adding…' : '+ Add Item'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  )
}
