import { useState, useRef, useCallback } from 'react';

interface TapTempoResult {
  bpm: number | null;
  tap: () => void;
  reset: () => void;
  isListening: boolean;
}

export function useTapTempo(): TapTempoResult {
  const [bpm, setBpm] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const tapsRef = useRef<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    tapsRef.current = [];
    setBpm(null);
    setIsListening(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const tap = useCallback(() => {
    const now = performance.now();

    // Remove taps older than 2 seconds
    tapsRef.current = tapsRef.current.filter((t) => now - t < 2000);
    tapsRef.current.push(now);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for 2s inactivity
    timeoutRef.current = setTimeout(() => {
      tapsRef.current = [];
      setBpm(null);
      setIsListening(false);
    }, 2000);

    if (tapsRef.current.length < 2) {
      setIsListening(true);
      setBpm(null);
      return;
    }

    // Use last 5 taps (or all if fewer)
    const recentTaps = tapsRef.current.slice(-5);
    const intervals: number[] = [];

    for (let i = 1; i < recentTaps.length; i++) {
      intervals.push(recentTaps[i] - recentTaps[i - 1]);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const calculatedBpm = Math.round(60000 / avgInterval);

    setBpm(calculatedBpm);
    setIsListening(true);
  }, []);

  return { bpm, tap, reset, isListening };
}
