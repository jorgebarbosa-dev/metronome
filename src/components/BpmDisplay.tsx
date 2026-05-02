import { useRef, useEffect } from 'react';
import { useMetronome } from '../context/MetronomeContext';
import { useSwipeBpm } from '../hooks/useSwipeBpm';

export function BpmDisplay() {
  const { state, dispatch, trainingSession, trainingConfig } = useMetronome();
  const isAutoBpmActive = trainingSession.isActive && trainingConfig.autoBpm.enabled;
  const bpm = isAutoBpmActive ? trainingSession.autoBpmCurrentValue : state.bpm;
  const prevBpmRef = useRef(bpm);
  const isAnimatingRef = useRef(false);

  // Trigger scale-pop animation on BPM change
  useEffect(() => {
    if (bpm !== prevBpmRef.current) {
      isAnimatingRef.current = true;
      const timer = setTimeout(() => {
        isAnimatingRef.current = false;
      }, 150);
      prevBpmRef.current = bpm;
      return () => clearTimeout(timer);
    }
  }, [bpm]);

  const swipeHandlers = useSwipeBpm((delta) => {
    dispatch({ type: 'SET_BPM', payload: bpm + delta });
  });

  return (
    <div
      className="text-center select-none cursor-ew-resize touch-pan-y"
      role="status"
      aria-label={`BPM: ${bpm}${isAutoBpmActive ? ' (training)' : ''}`}
      aria-live="polite"
      aria-atomic="true"
      {...swipeHandlers}
    >
      <div
        className={`
          text-[clamp(80px,22vw,140px)] font-bold tabular-nums leading-none tracking-tight
          bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent
          transition-transform duration-150 spring-bounce
          ${isAnimatingRef.current ? 'scale-105' : 'scale-100'}
        `}
      >
        {bpm}
      </div>
      <div className="text-sm font-medium text-white/30 uppercase tracking-[0.2em] mt-2">
        BPM
      </div>
    </div>
  );
}
