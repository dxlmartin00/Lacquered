import { create } from 'zustand';

export type TimerPresetSeconds = 30 | 60 | 600; // 30s flash, 60s full, 10m soak

export interface ActiveTimerState {
  preset: TimerPresetSeconds | null;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
}

interface SessionStore {
  // Timer State
  timer: ActiveTimerState;
  startTimer: (seconds: TimerPresetSeconds, label: string) => void;
  tickTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;

  // Active appointment / seat tracking
  activeAppointmentId: string | null;
  setActiveAppointmentId: (id: string | null) => void;

  // Active UI modal views
  activeModal: 'none' | 'checkout' | 'formula' | 'quote' | 'new-client' | 'new-apt';
  setActiveModal: (modal: 'none' | 'checkout' | 'formula' | 'quote' | 'new-client' | 'new-apt') => void;

  // Chair settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  timer: {
    preset: null,
    label: 'Ready',
    totalSeconds: 0,
    remainingSeconds: 0,
    isRunning: false,
    isCompleted: false,
  },

  startTimer: (seconds: TimerPresetSeconds, label: string) => {
    set({
      timer: {
        preset: seconds,
        label,
        totalSeconds: seconds,
        remainingSeconds: seconds,
        isRunning: true,
        isCompleted: false,
      },
    });
  },

  tickTimer: () => {
    const { timer } = get();
    if (!timer.isRunning || timer.remainingSeconds <= 0) return;

    const nextRemaining = timer.remainingSeconds - 1;
    if (nextRemaining <= 0) {
      set({
        timer: {
          ...timer,
          remainingSeconds: 0,
          isRunning: false,
          isCompleted: true,
        },
      });
    } else {
      set({
        timer: {
          ...timer,
          remainingSeconds: nextRemaining,
        },
      });
    }
  },

  pauseTimer: () => {
    const { timer } = get();
    set({
      timer: {
        ...timer,
        isRunning: false,
      },
    });
  },

  resumeTimer: () => {
    const { timer } = get();
    if (timer.remainingSeconds > 0) {
      set({
        timer: {
          ...timer,
          isRunning: true,
          isCompleted: false,
        },
      });
    }
  },

  resetTimer: () => {
    set({
      timer: {
        preset: null,
        label: 'Ready',
        totalSeconds: 0,
        remainingSeconds: 0,
        isRunning: false,
        isCompleted: false,
      },
    });
  },

  activeAppointmentId: null,
  setActiveAppointmentId: (id) => set({ activeAppointmentId: id }),

  activeModal: 'none',
  setActiveModal: (modal) => set({ activeModal: modal }),

  soundEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  hapticsEnabled: true,
  setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
}));
