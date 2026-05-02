import { useState } from 'react'

const STORAGE_KEY = 'vacationListUserName'

export function useUserName() {
  const [userName, setUserName] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ''
  )

  function saveName(name) {
    const trimmed = name.trim()
    localStorage.setItem(STORAGE_KEY, trimmed)
    setUserName(trimmed)
  }

  function clearName() {
    localStorage.removeItem(STORAGE_KEY)
    setUserName('')
  }

  return { userName, saveName, clearName, hasName: !!userName }
}
