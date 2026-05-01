import { useEffect, useCallback } from 'react';
import { useMetronome } from '../context/MetronomeContext';
import { useFullscreen } from './useFullscreen';

export function useKeyboardShortcuts() {
  const { state, dispatch } = useMetronome();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const isTyping = useCallback((target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    const tagName = target.tagName.toLowerCase();
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
    const isContentEditable = target.isContentEditable;
    return isInput || isContentEditable;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Space or Enter for play/pause, but only when not typing in an input
    if ((e.key === ' ' || e.key === 'Enter') && !isTyping(e.target)) {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_PLAY' });
    }

    // Arrow up/down for BPM adjustment, but only when not typing in an input
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !isTyping(e.target)) {
      e.preventDefault();
      const delta = e.key === 'ArrowUp' ? 1 : -1;
      dispatch({ type: 'SET_BPM', payload: state.bpm + delta });
    }

    // Escape key to exit fullscreen
    if (e.key === 'Escape' && isFullscreen) {
      toggleFullscreen();
    }
  }, [dispatch, isFullscreen, toggleFullscreen, state.bpm, isTyping]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
