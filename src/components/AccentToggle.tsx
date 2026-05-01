import { useMetronome } from '../context/MetronomeContext';

export function AccentToggle() {
  const { state, dispatch } = useMetronome();
  const { accentEnabled } = state;

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_ACCENT' });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        h-10 px-4 rounded-lg font-medium transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${accentEnabled
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
      `}
      aria-pressed={accentEnabled}
      aria-label={accentEnabled ? 'Disable accent' : 'Enable accent'}
    >
      Accent: {accentEnabled ? 'On' : 'Off'}
    </button>
  );
}
