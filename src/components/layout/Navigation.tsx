import React from 'react';
import { Armchair, Users, Calculator, Sparkles, BookOpen } from 'lucide-react';

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
      label: 'Chair Desk',
      sublabel: 'Active Timers & Today',
      icon: Armchair,
      badge: inChairCount > 0 ? `${inChairCount} LIVE` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'vault' as NavTab,
      label: 'Sizing Vault',
      sublabel: '10-Finger Tip Profiles',
      icon: Users,
    },
    {
      id: 'quote' as NavTab,
      label: 'Quick Quote',
      sublabel: 'Consultation Pricing',
      icon: Calculator,
    },
    {
      id: 'logs' as NavTab,
      label: 'Formulas & Art',
      sublabel: 'Gel Logs & High-Res',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* DESKTOP & TABLET: Left Rail Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-studio-surface border-r border-studio-elevated p-4 shrink-0 justify-between select-none">
        <div className="space-y-6">
          <div className="px-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Station Navigation
            </span>
          </div>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  type="button"
                  className={`w-full min-h-[52px] px-3.5 py-3 rounded-xl flex items-center justify-between text-left transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-stone-800 text-stone-100 font-semibold shadow-inner border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-transparent'
                  }`}
                  aria-label={item.label}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isActive ? 'bg-stone-100 text-stone-950' : 'bg-stone-950 text-stone-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium leading-tight">{item.label}</div>
                      <div className="text-[11px] text-stone-500 leading-tight mt-0.5">{item.sublabel}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Station Details & Glove Notice */}
        <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 text-[11px] text-stone-400 space-y-1">
          <div className="flex items-center space-x-2 text-stone-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nitrile Ergonomics</span>
          </div>
          <p className="text-stone-500 leading-relaxed">
            All session steppers and timers calibrated for 48px+ thumb touch.
          </p>
        </div>
      </nav>

      {/* MOBILE: Fixed Bottom Navigation Bar (Glove friendly 48px min height per button) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-studio-surface/95 backdrop-blur-md border-t border-studio-elevated safe-pb px-2 py-1 select-none">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`min-h-touch py-1.5 px-1 rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isActive ? 'text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
                aria-label={item.label}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? 'bg-stone-100 text-stone-950' : 'bg-transparent text-stone-400'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                  {item.label.split(' ')[0]}
                </span>
                {item.badge && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-stone-900" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
