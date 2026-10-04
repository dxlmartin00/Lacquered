import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation, type NavTab } from './Navigation';
import { useSessionStore } from '../../stores/useSessionStore';
import { RotateCcw } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  inChairCount?: number;
  onOpenQuickQuote?: () => void;
  onOpenNewClient?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  onTabChange,
  inChairCount = 0,
  onOpenQuickQuote,
  onOpenNewClient,
}) => {
  const { timer, pauseTimer, resumeTimer, resetTimer } = useSessionStore();

  const isTimerRunningOrActive = timer.totalSeconds > 0 && timer.remainingSeconds > 0;

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-studio-base text-studio-text select-none">
      {/* Top Application Header */}
      <Header
        onOpenQuickQuote={onOpenQuickQuote}
        onOpenNewClient={onOpenNewClient}
      />

      {/* Global Mini Timer Banner when navigating on non-desk tabs and timer is running */}
      {isTimerRunningOrActive && activeTab !== 'desk' && (
        <div className="w-full bg-amber-950/90 border-b border-amber-600/70 px-4 py-2 flex items-center justify-between text-xs font-mono text-amber-200 z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold">{timer.label}:</span>
            <span className="text-base font-extrabold text-stone-100">
              {Math.floor(timer.remainingSeconds / 60)}:
              {timer.remainingSeconds % 60 < 10 ? '0' : ''}
              {timer.remainingSeconds % 60}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={timer.isRunning ? pauseTimer : resumeTimer}
              className="touch-target px-3 py-1 rounded-lg bg-amber-900 border border-amber-700 text-amber-100 font-bold"
            >
              {timer.isRunning ? 'PAUSE' : 'RESUME'}
            </button>
            <button
              onClick={resetTimer}
              className="touch-target p-1.5 rounded-lg bg-amber-900 border border-amber-700 text-amber-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTabChange('desk')}
              className="touch-target px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold"
            >
              CHAIR →
            </button>
          </div>
        </div>
      )}

      {/* Middle Workspace Layout: Left Rail on desktop + Scrollable Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Rail */}
        <Navigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          inChairCount={inChairCount}
        />

        {/* Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-8 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
};
