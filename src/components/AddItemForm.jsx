import { useState } from 'react'
import { addItem } from '../services/itemService'

export default function AddItemForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)
    try {
      await addItem(name)
      setName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new item to vote on..."
        disabled={loading}
        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-400 disabled:opacity-50 transition"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold shadow-sm hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Adding…' : '+ Add Item'}
      </button>
      {error && (
        <p className="w-full text-xs text-red-500 mt-1">{error}</p>
      )}
    </form>
  )
}
