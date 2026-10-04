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
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  onTabChange,
  inChairCount = 0,
}) => {
  const { timer, pauseTimer, resumeTimer, resetTimer } = useSessionStore();

  const isTimerRunningOrActive = timer.totalSeconds > 0 && timer.remainingSeconds > 0;

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-studio-base text-studio-text select-none">
      {/* Top Application Header */}
      <Header />

      {/* Sleek Mini Timer Bar when navigating on non-desk tabs and timer is active */}
      {isTimerRunningOrActive && activeTab !== 'desk' && (
        <div className="w-full bg-stone-900 border-b border-stone-800 px-4 py-2 flex items-center justify-between text-xs font-mono text-stone-200 z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-stone-400">{timer.label}:</span>
            <span className="font-bold text-stone-100">
              {Math.floor(timer.remainingSeconds / 60)}:
              {timer.remainingSeconds % 60 < 10 ? '0' : ''}
              {timer.remainingSeconds % 60}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={timer.isRunning ? pauseTimer : resumeTimer}
              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
            >
              {timer.isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={resetTimer}
              className="p-1 rounded text-stone-500 hover:text-stone-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTabChange('desk')}
              className="px-2.5 py-1 rounded bg-stone-100 text-stone-950 font-bold"
            >
              Chair →
            </button>
          </div>
        </div>
      )}

      {/* Middle Workspace Layout: Left Rail on desktop + Scrollable Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <Navigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          inChairCount={inChairCount}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
};
