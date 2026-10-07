/**
 * Optional interface sounds, synthesised with Web Audio (no audio files). The AudioContext is created
 * lazily on the first sound after the visitor turns sound on, so nothing plays or allocates by default.
 */

export type SoundKind = 'open' | 'close' | 'minimize';

/** Pitch of each cue in Hz; open rises, close falls. */
const TONES: Record<SoundKind, readonly [from: number, to: number]> = {
  open: [520, 780],
  close: [620, 360],
  minimize: [480, 420],
};
/** Cue length in seconds, and its peak volume (kept quiet on purpose). */
const DURATION = 0.09;
const PEAK_GAIN = 0.05;

export interface Sounds {
  play: (kind: SoundKind) => void;
  dispose: () => void;
}

/**
 * Creates a sound player.
 *
 * @returns A player whose `play` is a no-op where Web Audio is unavailable, and `dispose` releases audio resources.
 */
export function createSounds(): Sounds {
  let ctx: AudioContext | null = null;
  return {
    play(kind) {
      if (typeof window === 'undefined' || !('AudioContext' in window)) return;
      ctx ??= new AudioContext();
      const [from, to] = TONES[kind];
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(to, now + DURATION);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + DURATION);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + DURATION);
    },
    dispose() {
      ctx?.close().catch((error: unknown) => console.warn('Workspace sound: could not close the audio context', error));
      ctx = null;
    },
  };
}
