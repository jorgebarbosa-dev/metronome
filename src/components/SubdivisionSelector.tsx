import { useRef } from 'react';
import { useMetronome } from '../context/MetronomeContext';
import { Subdivision } from '../types/metronome';

export function SubdivisionSelector() {
  const { state, dispatch } = useMetronome();
  const { subdivision } = state;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const subdivisions: { value: Subdivision; label: string; symbol: string; description: string }[] = [
    { value: 'quarter', label: 'Quarter', symbol: '1', description: '1 click per beat' },
    { value: 'eighth', label: 'Eighth', symbol: '2', description: '2 clicks per beat' },
    { value: 'triplet', label: 'Triplet', symbol: '3', description: '3 clicks per beat' },
    { value: 'sixteenth', label: 'Sixteenth', symbol: '4', description: '4 clicks per beat' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % subdivisions.length;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + subdivisions.length) % subdivisions.length;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttonRefs.current[subdivisions.length - 1]?.focus();
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="group"
      aria-label="Subdivision selection"
    >
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Subdivision
      </span>
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {subdivisions.map((sub, index) => {
          const isSelected = subdivision === sub.value;
          return (
            <button
              key={sub.value}
              ref={(el) => { buttonRefs.current[index] = el; }}
              onClick={() => dispatch({ type: 'SET_SUBDIVISION', payload: sub.value })}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={isSelected ? 0 : -1}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                min-h-[44px] flex items-center gap-1
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${isSelected
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
              aria-label={`${sub.label} note subdivision — ${sub.description}`}
              aria-pressed={isSelected}
            >
              <span className="font-bold">{sub.symbol}</span>
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
