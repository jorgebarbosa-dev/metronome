export interface AudioEngine {
  context: AudioContext;
  resume: () => Promise<void>;
  suspend: () => Promise<void>;
  isReady: boolean;
}

export function createAudioEngine(): AudioEngine {
  let audioContext: AudioContext | null = null;

  function getContext(): AudioContext {
    if (!audioContext) {
      audioContext = new AudioContext();
      console.log('[AudioEngine] AudioContext created, state:', audioContext.state);
    }
    return audioContext;
  }

  return {
    get context() {
      return getContext();
    },

    async resume() {
      const ctx = getContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
        console.log('[AudioEngine] AudioContext resumed, state:', ctx.state);
      }
    },

    async suspend() {
      if (audioContext && audioContext.state === 'running') {
        await audioContext.suspend();
        console.log('[AudioEngine] AudioContext suspended, state:', audioContext.state);
      }
    },

    get isReady() {
      return audioContext !== null && audioContext.state === 'running';
    },
  };
}
