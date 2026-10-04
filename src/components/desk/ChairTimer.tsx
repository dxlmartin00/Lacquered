import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Clock, Flame, Volume2, VolumeX } from 'lucide-react';
import { useSessionStore, type TimerPresetSeconds } from '../../stores/useSessionStore';
import { useVibration } from '../../hooks/useVibration';
import { useWakeLock } from '../../hooks/useWakeLock';

interface ChairTimerProps {
  compact?: boolean;
}

export const ChairTimer: React.FC<ChairTimerProps> = ({ compact = false }) => {
  const {
    timer,
    startTimer,
    tickTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    soundEnabled,
    setSoundEnabled,
  } = useSessionStore();

  const { triggerChairTimerAlert } = useVibration();
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();
  const completedAlertSentRef = useRef<boolean>(false);

  // Interval timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer.isRunning) {
      // Auto wake lock when timer is running
      requestWakeLock();
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      if (!timer.isRunning && timer.remainingSeconds === 0) {
        releaseWakeLock();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, tickTimer, requestWakeLock, releaseWakeLock, timer.remainingSeconds]);

  // Handle completion vibration and alert
  useEffect(() => {
    if (timer.isCompleted && !completedAlertSentRef.current) {
      completedAlertSentRef.current = true;
      triggerChairTimerAlert();
    } else if (!timer.isCompleted) {
      completedAlertSentRef.current = false;
    }
  }, [timer.isCompleted, triggerChairTimerAlert]);

  const handleSelectPreset = (seconds: TimerPresetSeconds, label: string) => {
    startTimer(seconds, label);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    if (mins > 0) {
      return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
    }
    return `${remaining}s`;
  };

  const progressPercentage =
    timer.totalSeconds > 0
      ? Math.max(0, Math.min(100, ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100))
      : 0;

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-stone-900 border border-stone-800 p-1.5 rounded-xl">
        <div className="flex items-center space-x-1.5 px-3 py-1 font-mono text-sm font-bold text-stone-100 bg-stone-950 rounded-lg">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{formatTime(timer.remainingSeconds)}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleSelectPreset(30, 'Flash Cure')}
            className="touch-target px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            30s
          </button>
          <button
            onClick={() => handleSelectPreset(60, 'Full Cure')}
            className="touch-target px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            60s
          </button>
          <button
            onClick={timer.isRunning ? pauseTimer : resumeTimer}
            className="touch-target px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-100"
          >
            {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-studio-surface border border-studio-elevated rounded-2xl p-4 md:p-5 select-none shadow-lg relative overflow-hidden">
      {/* Background Subtle Progress Bar */}
      <div
        className="absolute top-0 left-0 bottom-0 bg-stone-800/40 pointer-events-none transition-all duration-300 ease-linear"
        style={{ width: `${progressPercentage}%` }}
      />

      <div className="relative z-10 flex flex-col space-y-4">
        {/* Top Header of Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-stone-400">
              Station Cure & Soak Timers
            </span>
            <span className="text-xs font-mono text-stone-300 px-2 py-0.5 rounded bg-stone-800">
              {timer.label}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              title={soundEnabled ? 'Chime sound enabled' : 'Muted (Vibration only)'}
              type="button"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-600" />}
            </button>
          </div>
        </div>

        {/* Big Digit Countdown Display */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-baseline space-x-3">
            <div
              className={`font-mono text-4xl md:text-5xl font-extrabold tracking-tight ${
                timer.isCompleted
                  ? 'text-rose-400 animate-bounce'
                  : timer.isRunning
                  ? 'text-amber-300'
                  : 'text-stone-100'
              }`}
            >
              {formatTime(timer.remainingSeconds)}
            </div>
            {timer.isCompleted && (
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300">
                COMPLETE
              </span>
            )}
          </div>

          {/* Primary Controls (Pause/Resume/Reset) */}
          <div className="flex items-center space-x-2">
            {timer.totalSeconds > 0 && (
              <button
                onClick={timer.isRunning ? pauseTimer : resumeTimer}
                type="button"
                className="touch-target px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-mono text-sm font-semibold flex items-center space-x-2 transition-all active:scale-95 border border-stone-700"
                aria-label={timer.isRunning ? 'Pause Timer' : 'Resume Timer'}
              >
                {timer.isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <span>RESUME</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={resetTimer}
              type="button"
              className="touch-target p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-all active:scale-95"
              aria-label="Reset Timer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Glove-Friendly Quick Preset Buttons (Min 48px touch targets) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* 30s Flash Cure */}
          <button
            onClick={() => handleSelectPreset(30, 'Flash Cure (30s)')}
            type="button"
            className={`min-h-touch px-3 py-2.5 rounded-xl font-mono text-sm font-semibold flex flex-col items-center justify-center transition-all border active:scale-95 ${
              timer.preset === 30 && timer.isRunning
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/40'
                : 'bg-stone-900 hover:bg-stone-800/80 border-stone-800 text-stone-200 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-base font-bold">30s</span>
            </div>
            <span className="text-[10px] text-stone-400 uppercase tracking-tight mt-0.5">Flash Cure</span>
          </button>

          {/* 60s Full Cure */}
          <button
            onClick={() => handleSelectPreset(60, 'Full Cure (60s)')}
            type="button"
            className={`min-h-touch px-3 py-2.5 rounded-xl font-mono text-sm font-semibold flex flex-col items-center justify-center transition-all border active:scale-95 ${
              timer.preset === 60 && timer.isRunning
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/40'
                : 'bg-stone-900 hover:bg-stone-800/80 border-stone-800 text-stone-200 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-base font-bold">60s</span>
            </div>
            <span className="text-[10px] text-stone-400 uppercase tracking-tight mt-0.5">Full Cure</span>
          </button>

          {/* 10m Acetone Soak-Off */}
          <button
            onClick={() => handleSelectPreset(600, 'Acetone Soak-Off (10m)')}
            type="button"
            className={`min-h-touch px-3 py-2.5 rounded-xl font-mono text-sm font-semibold flex flex-col items-center justify-center transition-all border active:scale-95 ${
              timer.preset === 600 && timer.isRunning
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-200 shadow-md shadow-rose-950/40'
                : 'bg-stone-900 hover:bg-stone-800/80 border-stone-800 text-stone-200 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-rose-400" />
              <span className="text-base font-bold">10m</span>
            </div>
            <span className="text-[10px] text-stone-400 uppercase tracking-tight mt-0.5">Acetone Soak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
