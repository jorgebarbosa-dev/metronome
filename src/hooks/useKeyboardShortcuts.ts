import { useEffect, useCallback } from 'react';
import { useMetronome } from '../context/MetronomeContext';
import { useFullscreen } from './useFullscreen';

export function useKeyboardShortcuts() {
  const { dispatch } = useMetronome();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Space key for play/pause, but only when not typing in an input
    if (e.key === ' ' && e.target instanceof HTMLElement) {
      const tagName = e.target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isContentEditable = e.target.isContentEditable;

      if (!isInput && !isContentEditable) {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PLAY' });
      }
    }

    // Escape key to exit fullscreen
    if (e.key === 'Escape' && isFullscreen) {
      toggleFullscreen();
    }
  }, [dispatch, isFullscreen, toggleFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
