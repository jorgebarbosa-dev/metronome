export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function supportsHover(): boolean {
  return window.matchMedia('(hover: hover)').matches;
}
