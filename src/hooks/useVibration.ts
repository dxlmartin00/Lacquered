import { useCallback, useRef } from 'react';

export const CHAIR_TIMER_VIBRATION_PATTERN = [200, 100, 200, 100, 300];

export function useVibration() {
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play crisp studio chime via Web Audio API as audio accompaniment / fallback
  const playStudioChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // High-end dual frequency harmonic chime (880Hz A5 + 1320Hz E6)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.3);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }, []);

  const triggerChairTimerAlert = useCallback(() => {
    // Non-auditory haptic feedback
    if (isSupported) {
      try {
        navigator.vibrate(CHAIR_TIMER_VIBRATION_PATTERN);
      } catch (err) {
        console.warn('Vibration failed:', err);
      }
    }
    // Studio auditory cue
    playStudioChime();
  }, [isSupported, playStudioChime]);

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (isSupported) {
        try {
          return navigator.vibrate(pattern);
        } catch {
          return false;
        }
      }
      return false;
    },
    [isSupported]
  );

  return {
    isSupported,
    triggerChairTimerAlert,
    vibrate,
    playStudioChime,
  };
}
