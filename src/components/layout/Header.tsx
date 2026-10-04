import React from 'react';
import { Sun, SunMedium, Plus } from 'lucide-react';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useSessionStore } from '../../stores/useSessionStore';

export const Header: React.FC = () => {
  const { isSupported: wakeLockSupported, isActive: isWakeLockActive, toggle: toggleWakeLock } = useWakeLock();
  const { setActiveModal } = useSessionStore();

  return (
    <header className="w-full bg-studio-base border-b border-stone-800/80 select-none shrink-0 safe-pt px-4 py-3 md:px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Minimalist Brand */}
        <div className="flex items-center space-x-2.5">
          <span className="font-display font-bold text-lg tracking-widest text-stone-100 uppercase">
            Lacquered
          </span>
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
            Studio
          </span>
        </div>

        {/* Clean Controls */}
        <div className="flex items-center space-x-2">
          {wakeLockSupported && (
            <button
              onClick={toggleWakeLock}
              type="button"
              className={`touch-target px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center space-x-1.5 active:scale-95 ${
                isWakeLockActive
                  ? 'bg-amber-950/60 border-amber-600/80 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Screen Wake Lock"
              aria-label="Toggle Screen Wake Lock"
            >
              {isWakeLockActive ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium">Awake</span>
                </>
              ) : (
                <>
                  <SunMedium className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px]">Sleep</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveModal('new-apt')}
            type="button"
            className="touch-target px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-950 font-medium text-xs font-mono flex items-center space-x-1.5 transition-colors active:scale-95"
            aria-label="Add Appointment"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </header>
  );
};
