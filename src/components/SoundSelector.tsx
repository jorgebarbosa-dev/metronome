import { useRef } from 'react';
import { useMetronome } from '../context/MetronomeContext';
import { SoundName } from '../types/metronome';

export function SoundSelector() {
  const { state, dispatch } = useMetronome();
  const { selectedSound } = state;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const sounds: { name: SoundName; label: string; description: string }[] = [
    { name: 'classic', label: 'Classic', description: 'Square wave, sharp click' },
    { name: 'wood', label: 'Wood', description: 'Triangle wave, softer tone' },
    { name: 'click', label: 'Click', description: 'Short, crisp click' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % sounds.length;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + sounds.length) % sounds.length;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttonRefs.current[sounds.length - 1]?.focus();
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="group"
      aria-label="Sound selection"
    >
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Sound
      </span>
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {sounds.map((sound, index) => {
          const isSelected = selectedSound === sound.name;
          return (
            <button
              key={sound.name}
              ref={(el) => { buttonRefs.current[index] = el; }}
              onClick={() => dispatch({ type: 'SET_SOUND', payload: sound.name })}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={isSelected ? 0 : -1}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                min-h-[44px] flex items-center
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${isSelected
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
              aria-label={`${sound.label} sound — ${sound.description}`}
              aria-pressed={isSelected}
            >
              {sound.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
