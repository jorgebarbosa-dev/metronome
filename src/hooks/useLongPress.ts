import { useRef, useCallback, useEffect } from 'react';

interface LongPressHandlers {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function useLongPress(
  onPress: () => void,
  delay = 500,
  repeatInterval = 100
): LongPressHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  const start = useCallback(() => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onPress();
      intervalRef.current = setInterval(() => {
        onPress();
      }, repeatInterval);
    }, delay);
  }, [onPress, delay, repeatInterval]);

  const stop = useCallback(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: (_e: React.TouchEvent) => {
      // Prevent default to avoid context menu on long press
      start();
    },
    onTouchEnd: stop,
  };
}
