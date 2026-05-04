import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { voteForItem, removeVote, deleteItem, resetVotes } from '../services/itemService'

const VOTE_THRESHOLD = 3

export default function VotingItemCard({ item, userId, userName }) {
  const [optimistic, setOptimistic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Drop optimistic override once Firestore confirms the real change
  useEffect(() => {
    setOptimistic(null)
  }, [item.votes, item.voters])

  const hasVoted  = optimistic ? optimistic.hasVoted  : (item.voters?.includes(userId) ?? false)
  const votes     = optimistic ? optimistic.votes     : item.votes
  const voterNames = optimistic ? optimistic.voterNames : (item.voterNames ?? [])
  const remaining = VOTE_THRESHOLD - votes

  async function handleVoteToggle() {
    if (loading) return

    const wasVoted = item.voters?.includes(userId)

    // Optimistic update — show result immediately
    setOptimistic({
      hasVoted: !wasVoted,
      votes: wasVoted ? item.votes - 1 : item.votes + 1,
      voterNames: wasVoted
        ? (item.voterNames || []).filter((n) => n !== userName)
        : [...(item.voterNames || []), userName],
    })

    setLoading(true)
    try {
      if (wasVoted) {
        await removeVote(item.id, userId)
        toast('Vote removed', { icon: '↩️' })
      } else {
        await voteForItem(item.id, userId, userName)
        if (item.votes + 1 >= VOTE_THRESHOLD) {
          toast.success(`"${item.name}" approved! 🎉`, { duration: 4000 })
        } else {
          toast.success('Voted!')
        }
      }
    } catch (err) {
      setOptimistic(null) // rollback
      toast.error(err.message || 'Failed to update vote')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetVotes() {
    if (resetting) return
    setResetting(true)
    try {
      await resetVotes(item.id)
      toast('All votes cleared', { icon: '🔄' })
    } catch (err) {
      toast.error(err.message || 'Failed to reset votes')
    } finally {
      setResetting(false)
    }
  }

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      await deleteItem(item.id)
      toast.success('Item removed')
    } catch (err) {
      toast.error(err.message || 'Failed to delete item')
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 break-words">{item.name}</p>

        {item.addedBy && (
          <p className="text-xs text-gray-400 mt-0.5">
            Added by <span className="font-medium text-gray-500">{item.addedBy}</span>
          </p>
        )}

        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {Array.from({ length: VOTE_THRESHOLD }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < votes ? 'bg-blue-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {remaining > 0
              ? `${remaining} more vote${remaining !== 1 ? 's' : ''} needed`
              : 'Approving…'}
          </span>
        </div>

        {voterNames.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {voterNames.map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
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
            <span className={`w-3 h-3 border-2 rounded-full animate-spin ${
              hasVoted ? 'border-blue-300 border-t-blue-500' : 'border-white/50 border-t-white'
            }`} />
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {hasVoted ? 'Voted' : 'Vote'}
            </>
          )}
        </button>

        {votes > 0 && userId === item.addedByUid && (
          <button
            onClick={handleResetVotes}
            disabled={resetting}
            title="Clear all votes"
            className="p-1.5 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-amber-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {resetting ? (
              <span className="w-3 h-3 border-2 border-amber-200 border-t-amber-400 rounded-full animate-spin block" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        )}

        {item.votes === 0 && userId === item.addedByUid && (
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
