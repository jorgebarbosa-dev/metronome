import { useState, useEffect, useCallback } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
      ))
    }

    document.addEventListener('fullscreenchange', handleChange)
    document.addEventListener('webkitfullscreenchange', handleChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
      document.removeEventListener('webkitfullscreenchange', handleChange)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const element = document.documentElement

    if (isFullscreen) {
      document.exitFullscreen?.() ||
      (document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen?.()
    } else {
      element.requestFullscreen?.() ||
      (element as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.()
    }
  }, [isFullscreen])

  return { isFullscreen, toggleFullscreen }
}
