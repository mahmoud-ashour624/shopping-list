import { useState } from 'react'
import { toggleBought, updateAssignedTo } from '../services/itemService'

export default function ApprovedItemCard({ item }) {
  const [assignInput, setAssignInput] = useState(item.assignedTo || '')
  const [editing, setEditing] = useState(false)
  const [savingAssign, setSavingAssign] = useState(false)
  const [togglingBought, setTogglingBought] = useState(false)

  async function handleToggle() {
    if (togglingBought) return
    setTogglingBought(true)
    try {
      await toggleBought(item.id, item.bought)
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingBought(false)
    }
  }

  async function handleAssignSave() {
    setSavingAssign(true)
    try {
      await updateAssignedTo(item.id, assignInput)
      setEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingAssign(false)
    }
  }

  function handleAssignKeyDown(e) {
    if (e.key === 'Enter') handleAssignSave()
    if (e.key === 'Escape') {
      setAssignInput(item.assignedTo || '')
      setEditing(false)
    }
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${
        item.bought ? 'border-green-100 bg-green-50/40' : 'border-gray-100'
      }`}
    >
      <button
        onClick={handleToggle}
        disabled={togglingBought}
        className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
          item.bought
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-400'
        } disabled:opacity-60`}
        title={item.bought ? 'Mark as not bought' : 'Mark as bought'}
      >
        {item.bought && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium break-words transition-colors ${item.bought ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {item.name}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5">
          {editing ? (
            <div className="flex items-center gap-1.5 w-full">
              <input
                autoFocus
                type="text"
                value={assignInput}
                onChange={(e) => setAssignInput(e.target.value)}
                onKeyDown={handleAssignKeyDown}
                placeholder="Assign to…"
                className="flex-1 text-xs px-2 py-1 rounded-lg border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={handleAssignSave}
                disabled={savingAssign}
                className="text-xs px-2 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {savingAssign ? '…' : 'Save'}
              </button>
              <button
                onClick={() => { setAssignInput(item.assignedTo || ''); setEditing(false) }}
                className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors group"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {item.assignedTo ? (
                <span className="text-blue-500 font-medium group-hover:underline">{item.assignedTo}</span>
              ) : (
                <span className="group-hover:text-blue-400">Assign to…</span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1 text-xs text-gray-400">
        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>{item.votes}</span>
      </div>
    </div>
  )
}
