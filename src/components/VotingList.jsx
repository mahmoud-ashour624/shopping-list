import VotingItemCard from './VotingItemCard'

export default function VotingList({ items, userId, userName }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-bold text-gray-700">Voting</h2>
        <span className="text-xs font-semibold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No items up for voting yet.<br />
          <span className="text-xs">Add one above to get started!</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <VotingItemCard item={item} userId={userId} userName={userName} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
