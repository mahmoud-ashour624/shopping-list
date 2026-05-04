import AddItemForm from '../components/AddItemForm'
import VotingList from '../components/VotingList'
import ApprovedList from '../components/ApprovedList'
import { useItems } from '../hooks/useItems'

export default function Home({ userId, userName }) {
  const { votingItems, approvedItems, loading, error } = useItems()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 px-6">
        Failed to load items: {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AddItemForm
        userId={userId}
        userName={userName}
        existingItems={[...votingItems, ...approvedItems]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VotingList items={votingItems} userId={userId} userName={userName} />
        <ApprovedList items={approvedItems} userId={userId} />
      </div>
    </div>
  )
}
