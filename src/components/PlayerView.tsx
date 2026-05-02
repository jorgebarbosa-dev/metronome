import { useState, useEffect } from 'react';
import { Dumbbell, ListMusic, Volume2 } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { useTapTempo } from '../hooks/useTapTempo';
import { BpmDisplay } from './BpmDisplay';
import { BeatIndicator } from './BeatIndicator';
import { PlayButton } from './PlayButton';
import { ControlButton } from './ui/ControlButton';
import { BottomSheet } from './ui/BottomSheet';
import { Header } from './Header';
import { SettingsScreen } from './SettingsScreen';
import { TrainingScreen } from './TrainingScreen';
import { TrainingStatus } from './TrainingStatus';
import { PresetsSheet } from './PresetsSheet';
import { SoundSheet } from './SoundSheet';

export type SheetScreen = 'settings' | 'training' | 'presets' | 'sound' | null;

function MobileTapTempo() {
  const { tap, isListening, bpm } = useTapTempo();
  const { dispatch } = useMetronome();

  // Apply calculated BPM when tap tempo detects a rhythm
  useEffect(() => {
    if (bpm !== null) {
      dispatch({ type: 'SET_BPM', payload: bpm });
    }
  }, [bpm, dispatch]);

  return (
    <ControlButton
      ariaLabel={isListening ? 'Tap tempo (listening)' : 'Tap tempo'}
      variant="primary"
      onClick={tap}
      className="flex-1"
    >
      {isListening ? 'Tapping...' : 'Tap Tempo'}
    </ControlButton>
  );
}

export function PlayerView() {
  const { state, dispatch } = useMetronome();
  const [activeSheet, setActiveSheet] = useState<SheetScreen>(null);

  const adjustBpm = (delta: number) => {
    dispatch({ type: 'SET_BPM', payload: state.bpm + delta });
  };

  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col bg-neutral-950 text-white overflow-hidden select-none">
      {/* Header zone */}
      <div className="shrink-0 pt-[calc(12px+env(safe-area-inset-top))] px-5">
        <Header onOpenSettings={() => setActiveSheet('settings')} />
      </div>

      {/* Training status */}
      <div className="shrink-0 px-5">
        <TrainingStatus />
      </div>

      {/* Center zone */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 min-h-0">
        <BpmDisplay />
        <BeatIndicator />
      </div>

      {/* Bottom controls zone */}
      <div className="shrink-0 px-5 pb-[calc(20px+env(safe-area-inset-bottom))] flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Row 1: BPM +/- and Tap Tempo */}
        <div className="flex items-center gap-3">
          <ControlButton ariaLabel="Decrease BPM" onClick={() => adjustBpm(-1)}>
            −
          </ControlButton>

          <MobileTapTempo />

          <ControlButton ariaLabel="Increase BPM" onClick={() => adjustBpm(1)}>
            +
          </ControlButton>
        </div>

        {/* Row 2: Play button */}
        <div className="flex justify-center">
          <PlayButton />
        </div>

        {/* Row 3: Secondary actions */}
        <div className="flex items-center justify-center gap-3">
          <ControlButton
            ariaLabel="Sound settings"
            onClick={() => setActiveSheet('sound')}
          >
            <Volume2 className="w-5 h-5" />
          </ControlButton>

          <ControlButton
            ariaLabel="Presets"
            variant="primary"
            onClick={() => setActiveSheet('presets')}
          >
            <ListMusic className="w-5 h-5" />
          </ControlButton>

          <ControlButton
            ariaLabel="Training modes"
            onClick={() => setActiveSheet('training')}
          >
            <Dumbbell className="w-5 h-5" />
          </ControlButton>
        </div>
      </div>

      {/* Bottom sheets */}
      <BottomSheet
        isOpen={activeSheet === 'settings'}
        onClose={() => setActiveSheet(null)}
        title="Settings"
      >
        <SettingsScreen />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'training'}
        onClose={() => setActiveSheet(null)}
        title="Training"
      >
        <TrainingScreen />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'presets'}
        onClose={() => setActiveSheet(null)}
        title="Presets"
      >
        <PresetsSheet />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'sound'}
        onClose={() => setActiveSheet(null)}
        title="Sound"
      >
        <SoundSheet />
      </BottomSheet>
    </div>
  );
}
