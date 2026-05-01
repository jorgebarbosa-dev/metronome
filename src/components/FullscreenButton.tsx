import { Maximize, Minimize } from 'lucide-react'
import { useFullscreen } from '../hooks/useFullscreen'

export function FullscreenButton() {
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <button
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-4 h-4" aria-hidden="true" />
          <span>Exit Fullscreen</span>
        </>
      ) : (
        <>
          <Maximize className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Fullscreen</span>
        </>
      )}
    </button>
  )
}
