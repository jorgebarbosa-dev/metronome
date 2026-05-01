import { useMetronome } from '../context/MetronomeContext';
import { Subdivision } from '../types/metronome';

function getSubBeatCount(subdivision: Subdivision): number {
  switch (subdivision) {
    case 'quarter': return 1;
    case 'eighth': return 2;
    case 'triplet': return 3;
    case 'sixteenth': return 4;
  }
}

export function BeatIndicators() {
  const { currentBeat, currentSubBeat, state } = useMetronome();
  const { timeSignature, subdivision } = state;
  const subBeatCount = getSubBeatCount(subdivision);

  return (
    <div
      className="flex items-center justify-center gap-2"
      role="status"
      aria-label={`Beat ${currentBeat} of ${timeSignature.beats}${subdivision !== 'quarter' ? ` with ${subdivision} subdivision` : ''}`}
    >
      {Array.from({ length: timeSignature.beats }, (_, beatIndex) => {
        const beatNumber = beatIndex + 1;
        const isBeatActive = beatNumber === currentBeat;
        const isBeatOne = beatNumber === 1;

        return (
          <div key={beatNumber} className="flex items-center gap-1">
            {Array.from({ length: subBeatCount }, (_, subIndex) => {
              const isActive = isBeatActive && subIndex === currentSubBeat;
              const isMainBeat = subIndex === 0;

              return (
                <div
                  key={subIndex}
                  className={`
                    rounded-full transition-all duration-100
                    ${isMainBeat ? 'w-4 h-4' : 'w-2 h-2'}
                    ${isActive ? 'scale-125' : 'scale-100'}
                    transform transition-transform
                    ${isActive
                      ? isBeatOne ? 'bg-red-500' : 'bg-blue-600'
                      : isBeatOne ? 'bg-red-300 dark:bg-red-800' : 'bg-gray-300 dark:bg-gray-600'
                    }
                  `}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
