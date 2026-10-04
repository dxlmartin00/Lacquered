import React from 'react';
import { Armchair, Users, Calculator, BookOpen } from 'lucide-react';

export type NavTab = 'desk' | 'vault' | 'quote' | 'logs';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  inChairCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, inChairCount = 0 }) => {
  const navItems = [
    {
      id: 'desk' as NavTab,
      label: 'Chair',
      icon: Armchair,
      badge: inChairCount > 0 ? 'Live' : undefined,
    },
    {
      id: 'vault' as NavTab,
      label: 'Sizing',
      icon: Users,
    },
    {
      id: 'quote' as NavTab,
      label: 'Quote',
      icon: Calculator,
    },
    {
      id: 'logs' as NavTab,
      label: 'Archive',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* DESKTOP & TABLET: Left Rail Navigation */}
      <nav className="hidden md:flex flex-col w-52 bg-studio-base border-r border-stone-800/80 p-3 shrink-0 select-none">
        <div className="space-y-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`w-full min-h-[46px] px-3 py-2 rounded-xl flex items-center justify-between text-left transition-colors active:scale-[0.98] ${
                  isActive
                    ? 'bg-stone-800 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                }`}
                aria-label={item.label}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MOBILE: Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-studio-base/95 backdrop-blur-md border-t border-stone-800/80 safe-pb px-2 py-1 select-none">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`min-h-touch py-1.5 px-1 rounded-xl flex flex-col items-center justify-center relative transition-colors ${
                  isActive ? 'text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
                <span className="text-[10px] mt-1 font-mono tracking-tight">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute top-1.5 right-6 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
