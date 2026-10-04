import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation, type NavTab } from './Navigation';

interface AppShellProps {
  children: ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddCustomer: () => void;
  inChairCount?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  onTabChange,
  onOpenAddCustomer,
  inChairCount = 0,
}) => {
  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-[#fff5f7] text-slate-800 select-none">
      {/* Top Application Header */}
      <Header />

      {/* Middle Workspace Layout: Left Rail on desktop + Scrollable Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <Navigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          onOpenAddCustomer={onOpenAddCustomer}
          inChairCount={inChairCount}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
};
