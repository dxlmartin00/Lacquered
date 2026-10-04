import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Sun, SunMedium, Plus } from 'lucide-react';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useSessionStore } from '../../stores/useSessionStore';

interface HeaderProps {
  onOpenQuickQuote?: () => void;
  onOpenNewClient?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { isSupported: wakeLockSupported, isActive: isWakeLockActive, toggle: toggleWakeLock } = useWakeLock();
  const { setActiveModal } = useSessionStore();

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

  return (
    <header className="w-full bg-studio-base border-b border-studio-elevated select-none shrink-0 safe-pt px-4 py-3 md:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 flex items-center justify-center shadow-inner">
            <span className="font-display text-lg font-black tracking-widest text-stone-100">L</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold text-lg md:text-xl tracking-wider text-stone-100 uppercase">
                Lacquered
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
                Studio OS
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden xs:block font-sans">
              Autonomous Nail Technician Runtime
            </p>
          </div>
        </div>

        {/* Status Indicators & Ergonomic Action Chips */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Offline-First / Sync Indicator */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 text-xs font-mono"
            title={isOnline ? "Local-First: Changes persist to IndexedDB & sync seamlessly" : "Offline Autonomy Active: Reads/writes operating locally"}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5 text-stone-400 hidden sm:inline" />
                <span className="text-stone-300 text-[11px] tracking-wide">LOCAL DB</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-[11px] font-semibold tracking-wide">AIRPLANE MODE</span>
              </>
            )}
          </div>

          {/* Screen Wake Lock Toggle (Glove friendly 48px tap target) */}
          {wakeLockSupported && (
            <button
              onClick={toggleWakeLock}
              type="button"
              className={`touch-target px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center space-x-1.5 active:scale-95 ${
                isWakeLockActive
                  ? 'bg-amber-950/60 border-amber-600/80 text-amber-200 shadow-sm shadow-amber-900/30'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
              title="Screen Wake Lock: Keeps display illuminated during nail services"
              aria-label="Toggle Screen Wake Lock"
            >
              {isWakeLockActive ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline font-medium">AWAKE</span>
                </>
              ) : (
                <>
                  <SunMedium className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">SLEEP ON</span>
                </>
              )}
            </button>
          )}

          {/* New Walk-in / Booking Quick Action */}
          <button
            onClick={() => setActiveModal('new-apt')}
            type="button"
            className="touch-target px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-950 font-medium text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
            aria-label="Add Appointment"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline font-semibold">NEW CHAIR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
