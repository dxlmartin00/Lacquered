import React, { useState, useEffect } from 'react';
import { Sun, SunMedium, Plus, WifiOff } from 'lucide-react';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useSessionStore } from '../../stores/useSessionStore';
import { playTactileTick } from '../../utils/audio';

export const Header: React.FC = () => {
  const { isSupported: wakeLockSupported, isActive: isWakeLockActive, toggle: toggleWakeLock } = useWakeLock();
  const { setActiveModal } = useSessionStore();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleWakeLockToggle = () => {
    playTactileTick();
    toggleWakeLock();
  };

  const handleOpenBooking = () => {
    playTactileTick();
    setActiveModal('new-apt');
  };

  return (
    <header className="w-full bg-[#0c0a09]/95 backdrop-blur-md border-b border-stone-800/60 select-none shrink-0 safe-pt px-4 py-3 md:px-6 z-30">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Minimalist Studio Masthead (Taste & Impeccable) */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-lg tracking-[0.2em] text-stone-100 uppercase">
              Lacquered
            </span>
            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800">
              OS
            </span>
          </div>

          {!isOnline && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center space-x-1">
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>Offline Local</span>
            </span>
          )}
        </div>

        {/* Clean Tactile Studio Controls */}
        <div className="flex items-center space-x-2">
          {wakeLockSupported && (
            <button
              onClick={handleWakeLockToggle}
              type="button"
              className={`touch-target px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center space-x-1.5 tactile-btn ${
                isWakeLockActive
                  ? 'bg-amber-950/70 border-amber-600/80 text-amber-200 shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Screen Wake Lock (Stays awake during chair service)"
              aria-label="Toggle Screen Wake Lock"
            >
              {isWakeLockActive ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
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
            onClick={handleOpenBooking}
            type="button"
            className="touch-target px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-white text-stone-950 font-medium text-xs font-mono flex items-center space-x-1.5 tactile-btn shadow-sm"
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
