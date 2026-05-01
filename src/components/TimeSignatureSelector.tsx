import { useMetronome } from '../context/MetronomeContext';

const TIME_SIGNATURES = [
  { label: '1/4', beats: 1, beatValue: 4 },
  { label: '2/4', beats: 2, beatValue: 4 },
  { label: '3/4', beats: 3, beatValue: 4 },
  { label: '4/4', beats: 4, beatValue: 4 },
  { label: '5/4', beats: 5, beatValue: 4 },
  { label: '6/8', beats: 6, beatValue: 8 },
  { label: '7/8', beats: 7, beatValue: 8 },
  { label: '8/8', beats: 8, beatValue: 8 },
];

export function TimeSignatureSelector() {
  const { state, dispatch } = useMetronome();
  const { timeSignature } = state;

  const currentValue = `${timeSignature.beats}/${timeSignature.beatValue}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = TIME_SIGNATURES.find((ts) => ts.label === e.target.value);
    if (selected) {
      dispatch({
        type: 'SET_TIME_SIGNATURE',
        payload: { beats: selected.beats, beatValue: selected.beatValue },
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="time-signature" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Time:
      </label>
      <select
        id="time-signature"
        value={currentValue}
        onChange={handleChange}
        className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Time signature"
      >
        {TIME_SIGNATURES.map((ts) => (
          <option key={ts.label} value={ts.label}>
            {ts.label}
          </option>
        ))}
      </select>
    </div>
  );
}
