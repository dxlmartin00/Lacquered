import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useSessionStore, type TimerPresetSeconds } from '../../stores/useSessionStore';
import { useVibration } from '../../hooks/useVibration';
import { useWakeLock } from '../../hooks/useWakeLock';
import { playChimeSuccess, playTactileTick } from '../../utils/audio';

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
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);

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
      if (soundEnabled) {
        playChimeSuccess();
      }
    } else if (!timer.isCompleted) {
      completedAlertSentRef.current = false;
    }
  }, [timer.isCompleted, triggerChairTimerAlert, soundEnabled]);

  const handleSelectPreset = (seconds: TimerPresetSeconds, label: string) => {
    playTactileTick();
    startTimer(seconds, label);
  };

  const handleToggleTimer = () => {
    playTactileTick();
    if (timer.isRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const handleReset = () => {
    playTactileTick();
    resetTimer();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    if (mins > 0) {
      return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
    }
    return `${remaining < 10 ? '0' : ''}${remaining}s`;
  };

  const progressPercent =
    timer.totalSeconds > 0
      ? Math.max(0, Math.min(100, ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100))
      : 0;

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-stone-900 border border-stone-800 p-1.5 rounded-xl">
        <span className="font-mono tabular-nums text-xs font-bold text-stone-100 px-2 py-0.5 bg-stone-950 rounded">
          {formatTime(timer.remainingSeconds)}
        </span>
        <button
          onClick={() => handleSelectPreset(30, '30s')}
          className="tactile-chip px-2 py-1 text-xs font-mono rounded bg-stone-800 text-stone-200"
        >
          30s
        </button>
        <button
          onClick={() => handleSelectPreset(60, '60s')}
          className="tactile-chip px-2 py-1 text-xs font-mono rounded bg-stone-800 text-stone-200"
        >
          60s
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full hairline-card rounded-2xl p-5 select-none space-y-4 transition-all duration-300 relative overflow-hidden ${
        timer.isRunning
          ? 'shadow-[0_0_24px_rgba(217,119,6,0.14)] border-amber-500/40 ring-1 ring-amber-500/20'
          : timer.isCompleted
          ? 'shadow-[0_0_24px_rgba(244,63,94,0.18)] border-rose-500/40 ring-1 ring-rose-500/20'
          : 'border-stone-800/80'
      }`}
    >
      {/* Subtle Progress Track at Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-stone-900 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            timer.isCompleted
              ? 'bg-rose-500'
              : timer.isRunning
              ? 'bg-amber-400'
              : 'bg-stone-700'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Digits + Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-baseline space-x-3">
          <div
            className={`font-mono tabular-nums text-5xl md:text-6xl font-light tracking-tight transition-colors duration-200 ${
              timer.isCompleted
                ? 'text-rose-400 font-semibold animate-pulse'
                : timer.isRunning
                ? 'text-amber-300'
                : 'text-stone-100'
            }`}
          >
            {formatTime(timer.remainingSeconds)}
          </div>
          {timer.isCompleted && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Cure Complete
            </span>
          )}
          {timer.isRunning && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block mr-1" />
              <span>Curing</span>
            </span>
          )}
        </div>

        {/* Play/Pause, Reset & Mute Sound */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            type="button"
            className="touch-target w-10 h-10 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-500 hover:text-stone-300 border border-stone-800 flex items-center justify-center tactile-btn"
            title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            aria-label={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-400" /> : <VolumeX className="w-4 h-4 text-stone-600" />}
          </button>

          {timer.totalSeconds > 0 && (
            <button
              onClick={handleToggleTimer}
              type="button"
              className={`touch-target w-11 h-11 rounded-xl flex items-center justify-center tactile-btn ${
                timer.isRunning
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-950/40'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-100'
              }`}
              aria-label={timer.isRunning ? 'Pause' : 'Resume'}
            >
              {timer.isRunning ? <Pause className="w-5 h-5 stroke-[2.5]" /> : <Play className="w-5 h-5 fill-stone-100" />}
            </button>
          )}

          <button
            onClick={handleReset}
            type="button"
            className="touch-target w-11 h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 flex items-center justify-center tactile-btn"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Pill Steppers (Glove friendly 48px min touch target) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleSelectPreset(30, '30s Flash')}
          type="button"
          className={`min-h-touch rounded-xl font-mono text-xs font-semibold border tactile-btn ${
            timer.preset === 30 && timer.isRunning
              ? 'bg-amber-400/20 border-amber-400/80 text-amber-200'
              : 'bg-stone-900/90 hover:bg-stone-800/90 border-stone-800/80 text-stone-300'
          }`}
        >
          30s Flash
        </button>

        <button
          onClick={() => handleSelectPreset(60, '60s Cure')}
          type="button"
          className={`min-h-touch rounded-xl font-mono text-xs font-semibold border tactile-btn ${
            timer.preset === 60 && timer.isRunning
              ? 'bg-amber-400/20 border-amber-400/80 text-amber-200'
              : 'bg-stone-900/90 hover:bg-stone-800/90 border-stone-800/80 text-stone-300'
          }`}
        >
          60s Cure
        </button>

        <button
          onClick={() => handleSelectPreset(600, '10m Soak')}
          type="button"
          className={`min-h-touch rounded-xl font-mono text-xs font-semibold border tactile-btn ${
            timer.preset === 600 && timer.isRunning
              ? 'bg-rose-500/20 border-rose-500/80 text-rose-200'
              : 'bg-stone-900/90 hover:bg-stone-800/90 border-stone-800/80 text-stone-300'
          }`}
        >
          10m Soak
        </button>
      </div>
    </div>
  );
};
