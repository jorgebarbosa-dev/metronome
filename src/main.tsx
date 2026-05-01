import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register service worker for PWA offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New version available. Refresh to update.')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  }
})

// Force dark mode on mobile for native feel
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
