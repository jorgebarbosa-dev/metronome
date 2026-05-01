import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';

export function VolumeControl() {
  const { state, dispatch } = useMetronome();
  const { volume } = state;
  const [previousVolume, setPreviousVolume] = useState(0.8);

  const isMuted = volume === 0;

  const handleToggleMute = () => {
    if (isMuted) {
      dispatch({ type: 'SET_VOLUME', payload: previousVolume });
    } else {
      setPreviousVolume(volume);
      dispatch({ type: 'SET_VOLUME', payload: 0 });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: 'SET_VOLUME', payload: newVolume });
    if (newVolume > 0) {
      setPreviousVolume(newVolume);
    }
  };

  const percentage = Math.round(volume * 100);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggleMute}
        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Volume2 className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleSliderChange}
        className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
        aria-label="Volume"
      />

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10">
        {percentage}%
      </span>
    </div>
  );
}
