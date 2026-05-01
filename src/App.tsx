import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { MetronomeProvider } from './context/MetronomeContext';
import { BpmDisplay } from './components/BpmDisplay';
import { PlayButton } from './components/PlayButton';
import { BeatIndicators } from './components/BeatIndicators';
import { BeatNumberDisplay } from './components/BeatNumberDisplay';
import { BpmControls } from './components/BpmControls';
import { TapTempoButton } from './components/TapTempoButton';
import { TimeSignatureSelector } from './components/TimeSignatureSelector';
import { VolumeControl } from './components/VolumeControl';
import { AccentToggle } from './components/AccentToggle';
import { SoundSelector } from './components/SoundSelector';
import { SubdivisionSelector } from './components/SubdivisionSelector';
import { PresetManager } from './components/PresetManager';
import { PresetList } from './components/PresetList';
import { TrainingPanel } from './components/TrainingPanel';
import { TrainingStatus } from './components/TrainingStatus';
import { useMetronome } from './context/MetronomeContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFullscreen } from './hooks/useFullscreen';
import { InstallButton } from './components/InstallButton'
import { OfflineIndicator } from './components/OfflineIndicator'
import { FullscreenButton } from './components/FullscreenButton'
import { FullscreenView } from './components/FullscreenView'

function MetronomeApp() {
  const { state } = useMetronome();
  const { isFullscreen } = useFullscreen();
  const [isTrainingPanelOpen, setIsTrainingPanelOpen] = useState(false);
  useKeyboardShortcuts();

  // When in fullscreen, render the clean fullscreen view
  if (isFullscreen) {
    return <FullscreenView />;
  }

  return (
    <main
      role="main"
      aria-label="Metronome controls"
      className="min-h-screen flex flex-col items-center gap-6 p-4 md:p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900"
    >
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metrônomo</h1>
          <OfflineIndicator />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTrainingPanelOpen(!isTrainingPanelOpen)}
            aria-label="Toggle training modes panel"
            aria-expanded={isTrainingPanelOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Dumbbell className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Training</span>
          </button>
          <InstallButton />
          <FullscreenButton />
        </div>
      </div>

      {/* ARIA live regions for screen readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {state.isPlaying ? 'Metronome playing' : 'Metronome stopped'}
      </div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Time signature: {state.timeSignature.beats}/{state.timeSignature.beatValue}
      </div>

      <BpmDisplay />

      <BeatNumberDisplay />

      <BeatIndicators />

      <PlayButton />

      {/* Training status */}
      <div className="w-full">
        <TrainingStatus />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        <BpmControls />
        <TapTempoButton />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        <TimeSignatureSelector />
        <AccentToggle />
        <VolumeControl />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        <SoundSelector />
        <SubdivisionSelector />
      </div>

      {/* Preset section */}
      <div className="flex flex-col items-center gap-4 w-full pt-4 border-t border-gray-200 dark:border-gray-700">
        <PresetManager />
        <PresetList />
      </div>

      {/* Training modes section */}
      <div className="flex flex-col items-center gap-4 w-full pt-4 border-t border-gray-200 dark:border-gray-700">
        <TrainingPanel
          isOpen={isTrainingPanelOpen}
          onToggle={() => setIsTrainingPanelOpen(!isTrainingPanelOpen)}
        />
      </div>
    </main>
  );
}

function App() {
  return (
    <MetronomeProvider>
      <MetronomeApp />
    </MetronomeProvider>
  );
}

export default App;
