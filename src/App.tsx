import { MetronomeProvider } from './context/MetronomeContext';
import { PlayerView } from './components/PlayerView';
import { FullscreenView } from './components/FullscreenView';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function MetronomeApp() {
  const { isFullscreen } = useFullscreen();
  useKeyboardShortcuts();

  // When in fullscreen, render the clean fullscreen view
  if (isFullscreen) {
    return <FullscreenView />;
  }

  return <PlayerView />;
}

function App() {
  return (
    <MetronomeProvider>
      <MetronomeApp />
    </MetronomeProvider>
  );
}

export default App;
