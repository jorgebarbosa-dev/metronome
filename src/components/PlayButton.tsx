import { Play, Pause } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';

export function PlayButton() {
  const { state, dispatch } = useMetronome();
  const isPlaying = state.isPlaying;

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_PLAY' });
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
        transition-all duration-150 active:scale-95
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
        ${isPlaying 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
      `}
      aria-label={isPlaying ? 'Pause metronome' : 'Start metronome'}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <Pause className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
      ) : (
        <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" aria-hidden="true" />
      )}
    </button>
  );
}
