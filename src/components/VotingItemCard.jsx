import { useState } from 'react'
import { voteForItem } from '../services/itemService'

const VOTE_THRESHOLD = 3

export default function VotingItemCard({ item, userId }) {
  const [loading, setLoading] = useState(false)
  const hasVoted = item.voters?.includes(userId)
  const remaining = VOTE_THRESHOLD - item.votes

  async function handleVote() {
    if (hasVoted || loading) return
    setLoading(true)
    try {
      await voteForItem(item.id, userId)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {remaining > 0
            ? `${remaining} more vote${remaining !== 1 ? 's' : ''} needed`
            : 'Approving…'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          {Array.from({ length: VOTE_THRESHOLD }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < item.votes ? 'bg-blue-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-semibold text-gray-500 w-6 text-center">
          {item.votes}/{VOTE_THRESHOLD}
        </span>

        <button
          onClick={handleVote}
          disabled={hasVoted || loading}
          title={hasVoted ? 'Already voted' : 'Upvote'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
            hasVoted
              ? 'bg-blue-50 text-blue-400 cursor-default'
              : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
          } disabled:opacity-60`}
        >
          {loading ? (
            <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {hasVoted ? 'Voted' : 'Vote'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
