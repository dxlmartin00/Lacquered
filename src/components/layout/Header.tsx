import React, { useState, useEffect } from 'react';
import { Sparkles, Bell, WifiOff, Sun, SunMedium } from 'lucide-react';
import { useWakeLock } from '../../hooks/useWakeLock';
import { playTactileTick } from '../../utils/audio';

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { isSupported: wakeLockSupported, isActive: isWakeLockActive, toggle: toggleWakeLock } = useWakeLock();
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

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-pink-100/80 select-none shrink-0 safe-pt px-4 py-2.5 z-30">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {/* Studio Branding */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-slate-800">
                Laquered
              </span>
              <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Studio OS
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Wake Lock & Notification Bell (Image 1 top right) */}
        <div className="flex items-center space-x-2">
          {!isOnline && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <WifiOff className="w-3 h-3 text-amber-500" />
              <span>Offline</span>
            </span>
          )}

          {wakeLockSupported && (
            <button
              onClick={handleWakeLockToggle}
              type="button"
              className={`p-2 rounded-xl border text-xs transition-all tactile-btn ${
                isWakeLockActive
                  ? 'bg-pink-100 border-pink-300 text-pink-700'
                  : 'bg-white border-pink-100 text-slate-400 hover:text-slate-600'
              }`}
              title="Screen Wake Lock (Stays awake during nail session)"
              aria-label="Toggle Screen Wake Lock"
            >
              {isWakeLockActive ? (
                <Sun className="w-4 h-4 text-pink-600 animate-spin" style={{ animationDuration: '10s' }} />
              ) : (
                <SunMedium className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              playTactileTick();
              if (onOpenNotifications) onOpenNotifications();
            }}
            type="button"
            className="p-2 rounded-xl bg-white border border-pink-100 text-pink-500 hover:bg-pink-50 transition-colors tactile-btn relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
