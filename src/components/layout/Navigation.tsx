import React from 'react';
import { Armchair, Users, Calculator, BookOpen } from 'lucide-react';
import { playTactileTick } from '../../utils/audio';

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

  const handleTabClick = (tabId: NavTab) => {
    playTactileTick();
    onTabChange(tabId);
  };

  return (
    <>
      {/* DESKTOP & TABLET: Left Rail Navigation */}
      <nav className="hidden md:flex flex-col w-52 bg-[#0c0a09] border-r border-stone-800/80 p-3 shrink-0 select-none">
        <div className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                type="button"
                className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left tactile-btn border transition-all ${
                  isActive
                    ? 'bg-stone-800/90 border-stone-700 text-stone-100 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                    : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                }`}
                aria-label={item.label}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
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

      {/* MOBILE: Fixed Bottom Navigation Bar (Emil Kowalski safe area & tactile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0a09]/95 backdrop-blur-md border-t border-stone-800/80 safe-pb px-2 py-1 select-none">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                type="button"
                className={`min-h-touch py-1.5 px-1 rounded-xl flex flex-col items-center justify-center relative tactile-btn transition-colors ${
                  isActive
                    ? 'text-stone-100 font-semibold'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-5 h-5 stroke-[2] ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span className="text-[10px] mt-1 font-mono tracking-tight">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute top-1.5 right-6 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-stone-950 animate-pulse" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
