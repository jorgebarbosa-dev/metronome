import { useMetronome } from '../context/MetronomeContext';

export function BpmControls() {
  const { state, dispatch } = useMetronome();
  const bpm = state.bpm;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      dispatch({ type: 'SET_BPM', payload: value });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_BPM', payload: parseInt(e.target.value, 10) });
  };

  const decrement = () => {
    dispatch({ type: 'SET_BPM', payload: bpm - 1 });
  };

  const increment = () => {
    dispatch({ type: 'SET_BPM', payload: bpm + 1 });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Decrease BPM"
        >
          -
        </button>

        <input
          type="number"
          min={40}
          max={240}
          value={bpm}
          onChange={handleInputChange}
          className="w-16 h-10 text-center text-lg font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="BPM value"
        />

        <button
          onClick={increment}
          className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Increase BPM"
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={40}
        max={240}
        value={bpm}
        onChange={handleSliderChange}
        className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
        aria-label="BPM slider"
      />
    </div>
  );
}
