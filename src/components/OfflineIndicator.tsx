import { WifiOff } from 'lucide-react'
import { useOfflineStatus } from '../hooks/useOfflineStatus'

export function OfflineIndicator() {
  const isOffline = useOfflineStatus()

  if (!isOffline) return null

  return (
    <div
      role="status"
      aria-label="Offline mode"
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/30 rounded-full"
    >
      <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
      <span>Offline</span>
    </div>
  )
}
