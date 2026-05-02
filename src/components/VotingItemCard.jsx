import { useState } from 'react'
import { voteForItem, removeVote, deleteItem } from '../services/itemService'

const VOTE_THRESHOLD = 3

export default function VotingItemCard({ item, userId }) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const hasVoted = item.voters?.includes(userId)
  const remaining = VOTE_THRESHOLD - item.votes

  async function handleVoteToggle() {
    if (loading) return
    setLoading(true)
    try {
      if (hasVoted) {
        await removeVote(item.id, userId)
      } else {
        await voteForItem(item.id, userId)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      await deleteItem(item.id)
    } catch (err) {
      console.error(err)
      setDeleting(false)
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
        {/* vote progress dots */}
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

        {/* vote / unvote */}
        <button
          onClick={handleVoteToggle}
          disabled={loading}
          title={hasVoted ? 'Remove your vote' : 'Upvote'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-60 ${
            hasVoted
              ? 'bg-blue-100 text-blue-500 hover:bg-red-50 hover:text-red-400'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <span className={`w-3 h-3 border-2 rounded-full animate-spin ${hasVoted ? 'border-blue-300 border-t-blue-500' : 'border-white/50 border-t-white'}`} />
          ) : hasVoted ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Voted
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Vote
            </>
          )}
        </button>

        {/* delete — only visible when votes === 0 */}
        {item.votes === 0 && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Remove item"
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {deleting ? (
              <span className="w-3 h-3 border-2 border-red-200 border-t-red-400 rounded-full animate-spin block" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
