export function SyncingStatus({ syncing }: { syncing: boolean }) {
  if (!syncing) return null

  return (
    <div className="fixed bottom-2 right-2 py-2 px-4 flex justify-center items-center gap-2 bg-white rounded-full">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-semibold">Syncing...</span>
    </div>
  )
}
