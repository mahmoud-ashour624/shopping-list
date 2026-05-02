import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../firebase'

const ITEMS_COLLECTION = 'items'
const VOTE_THRESHOLD = 3

export async function addItem(name) {
  if (!name.trim()) throw new Error('Item name is required')

  await addDoc(collection(db, ITEMS_COLLECTION), {
    name: name.trim(),
    status: 'voting',
    votes: 0,
    voters: [],
    bought: false,
    assignedTo: '',
    createdAt: serverTimestamp(),
  })
}

export async function voteForItem(itemId, userId) {
  const itemRef = doc(db, ITEMS_COLLECTION, itemId)

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(itemRef)
    if (!snap.exists()) throw new Error('Item not found')

    const data = snap.data()

    if (data.voters.includes(userId)) return

    const newVoters = [...data.voters, userId]
    const newVotes = data.votes + 1
    const updates = {
      voters: newVoters,
      votes: newVotes,
      ...(newVotes >= VOTE_THRESHOLD ? { status: 'approved' } : {}),
    }

    transaction.update(itemRef, updates)
  })
}

export async function removeVote(itemId, userId) {
  const itemRef = doc(db, ITEMS_COLLECTION, itemId)

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(itemRef)
    if (!snap.exists()) throw new Error('Item not found')

    const data = snap.data()
    if (!data.voters.includes(userId)) return

    transaction.update(itemRef, {
      voters: data.voters.filter((v) => v !== userId),
      votes: data.votes - 1,
    })
  })
}

export async function deleteItem(itemId) {
  await deleteDoc(doc(db, ITEMS_COLLECTION, itemId))
}

export async function toggleBought(itemId, current) {
  await updateDoc(doc(db, ITEMS_COLLECTION, itemId), { bought: !current })
}

export async function updateAssignedTo(itemId, assignedTo) {
  await updateDoc(doc(db, ITEMS_COLLECTION, itemId), {
    assignedTo: assignedTo.trim(),
  })
}
