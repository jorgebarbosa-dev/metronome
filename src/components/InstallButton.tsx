import { Download } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallButton() {
  const { isInstallable, isInstalled, install } = useInstallPrompt()

  if (!isInstallable || isInstalled) return null

  return (
    <button
      onClick={install}
      aria-label="Install Metrônomo app"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      <span>Install</span>
    </button>
  )
}
