import { useAuth } from './hooks/useAuth'
import { useUserName } from './hooks/useUserName'
import Home from './pages/Home'
import NamePrompt from './components/NamePrompt'

export default function App() {
  const { user, loading, error } = useAuth()
  const { userName, saveName, clearName, hasName } = useUserName()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Connecting…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <p className="text-sm text-red-500">Authentication failed: {error}</p>
          <p className="text-xs text-gray-400 mt-2">Check your Firebase configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {!hasName && <NamePrompt onSave={saveName} />}

      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏖️</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Vacation List</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Vote on what to bring · Check off what's bought</p>
            </div>
          </div>

          {hasName && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-medium">{userName}</span>
              </div>
              <button
                onClick={clearName}
                title="Change name"
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-full hover:bg-gray-100 transition"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Home userId={user?.uid} userName={userName} />
      </main>

      <footer className="text-center py-6 text-xs text-gray-300">
        Realtime sync powered by Firebase · Anonymous auth
      </footer>
    </div>
  )
}
