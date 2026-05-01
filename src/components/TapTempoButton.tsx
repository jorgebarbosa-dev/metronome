import { useEffect } from 'react';
import { useMetronome } from '../context/MetronomeContext';
import { useTapTempo } from '../hooks/useTapTempo';

export function TapTempoButton() {
  const { dispatch } = useMetronome();
  const { bpm, tap, isListening } = useTapTempo();

  useEffect(() => {
    if (bpm !== null) {
      dispatch({ type: 'SET_BPM', payload: bpm });
    }
  }, [bpm, dispatch]);

  return (
    <button
      onClick={tap}
      className={`
        min-h-12 min-w-24 px-4 py-2 rounded-lg font-semibold transition-all duration-150 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${isListening
          ? 'bg-blue-600 text-white animate-pulse'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
      `}
      aria-label={isListening ? 'Tap tempo (listening)' : 'Tap tempo'}
    >
      {isListening ? 'Tapping...' : 'Tap Tempo'}
    </button>
  );
}
