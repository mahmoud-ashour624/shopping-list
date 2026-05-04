import ApprovedItemCard from './ApprovedItemCard'

export default function ApprovedList({ items, userId }) {
  const boughtCount = items.filter((i) => i.bought).length

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-bold text-gray-700">Approved</h2>
        <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
        {items.length > 0 && (
          <span className="ml-auto text-xs text-gray-400">
            {boughtCount}/{items.length} bought
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No approved items yet.<br />
          <span className="text-xs">Items move here when they reach 3 votes.</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <ApprovedItemCard item={item} userId={userId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
