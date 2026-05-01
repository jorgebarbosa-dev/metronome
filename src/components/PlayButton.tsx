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
        w-[88px] h-[88px] rounded-full
        flex items-center justify-center
        transition-transform duration-150
        active:scale-[0.88] spring-bounce
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50
        ${isPlaying
          ? 'bg-red-500 shadow-[0_8px_32px_rgba(239,68,68,0.35)]'
          : 'bg-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.35)]'
        }
        [@media(hover:hover)]:hover:brightness-110
      `}
      aria-label={isPlaying ? 'Pause metronome' : 'Start metronome'}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <Pause className="w-8 h-8 text-white" aria-hidden="true" />
      ) : (
        <Play className="w-8 h-8 text-white ml-0.5" aria-hidden="true" />
      )}
    </button>
  );
}
