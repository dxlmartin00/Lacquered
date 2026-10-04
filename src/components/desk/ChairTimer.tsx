import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
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
  } = useSessionStore();

  const { triggerChairTimerAlert } = useVibration();
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();
  const completedAlertSentRef = useRef<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer.isRunning) {
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
    return `${remaining < 10 ? '0' : ''}${remaining}s`;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-stone-900 border border-stone-800 p-1.5 rounded-xl">
        <span className="font-mono text-xs font-bold text-stone-100 px-2 py-0.5 bg-stone-950 rounded">
          {formatTime(timer.remainingSeconds)}
        </span>
        <button
          onClick={() => handleSelectPreset(30, '30s')}
          className="px-2 py-1 text-xs font-mono rounded bg-stone-800 text-stone-200"
        >
          30s
        </button>
        <button
          onClick={() => handleSelectPreset(60, '60s')}
          className="px-2 py-1 text-xs font-mono rounded bg-stone-800 text-stone-200"
        >
          60s
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-900/60 border border-stone-800/80 rounded-2xl p-5 select-none space-y-4">
      {/* Digits + Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline space-x-3">
          <div
            className={`font-mono text-5xl md:text-6xl font-light tracking-tight ${
              timer.isCompleted
                ? 'text-rose-400 font-bold'
                : timer.isRunning
                ? 'text-amber-300'
                : 'text-stone-100'
            }`}
          >
            {formatTime(timer.remainingSeconds)}
          </div>
          {timer.isCompleted && (
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Done
            </span>
          )}
        </div>

        {/* Play/Pause & Reset */}
        <div className="flex items-center space-x-2">
          {timer.totalSeconds > 0 && (
            <button
              onClick={timer.isRunning ? pauseTimer : resumeTimer}
              type="button"
              className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 flex items-center justify-center transition-colors active:scale-95"
              aria-label={timer.isRunning ? 'Pause' : 'Resume'}
            >
              {timer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-stone-100" />}
            </button>
          )}

          <button
            onClick={resetTimer}
            type="button"
            className="touch-target w-11 h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Pill Steppers (Glove friendly 48px min height) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleSelectPreset(30, '30s Flash')}
          type="button"
          className={`min-h-touch rounded-xl font-mono text-sm font-semibold transition-colors border active:scale-95 ${
            timer.preset === 30 && timer.isRunning
              ? 'bg-amber-400/20 border-amber-400/80 text-amber-200'
              : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
          }`}
        >
          30s Flash
        </button>

        <button
          onClick={() => handleSelectPreset(60, '60s Cure')}
          type="button"
          className={`min-h-touch rounded-xl font-mono text-sm font-semibold transition-colors border active:scale-95 ${
            timer.preset === 60 && timer.isRunning
              ? 'bg-amber-400/20 border-amber-400/80 text-amber-200'
              : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
          }`}
        >
          60s Cure
        </button>

        <button
          onClick={() => handleSelectPreset(600, '10m Soak')}
          type="button"
          className={`min-h-touch rounded-xl font-mono text-sm font-semibold transition-colors border active:scale-95 ${
            timer.preset === 600 && timer.isRunning
              ? 'bg-rose-500/20 border-rose-500/80 text-rose-200'
              : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
          }`}
        >
          10m Soak
        </button>
      </div>
    </div>
  );
};
