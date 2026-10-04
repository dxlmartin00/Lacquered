import React from 'react';
import { Home, Sparkles, Plus, TrendingUp, Users } from 'lucide-react';
import { LaqueredLogo } from '../common/LaqueredLogo';
import { playTactileTick } from '../../utils/audio';

export type NavTab = 'home' | 'services' | 'history' | 'customers';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddCustomer: () => void;
  inChairCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenAddCustomer,
  inChairCount = 0,
}) => {
  const handleTabClick = (tabId: NavTab) => {
    playTactileTick();
    onTabChange(tabId);
  };

  const handleCenterPlusClick = () => {
    playTactileTick();
    onOpenAddCustomer();
  };

  return (
    <>
      {/* DESKTOP & TABLET: Left Rail Navigation */}
      <nav className="hidden md:flex flex-col w-56 bg-white border-r border-pink-100 p-4 shrink-0 select-none justify-between">
        <div className="space-y-2">
          {/* Logo / Studio Header */}
          <div className="px-2 py-3 mb-2 flex items-center space-x-2.5">
            <LaqueredLogo className="w-9 h-9 rounded-2xl shadow-md shadow-pink-200 shrink-0" />
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-slate-800 block">
                Laquered
              </span>
              <span className="text-[10px] font-semibold text-pink-500 tracking-wider uppercase block">
                Studio OS
              </span>
            </div>
          </div>

          {/* Quick Action: Add Customer Button */}
          <button
            type="button"
            onClick={handleCenterPlusClick}
            className="w-full py-2.5 px-4 mb-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-pink-200 tactile-btn"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Customer</span>
          </button>

          {/* Nav Items */}
          <button
            onClick={() => handleTabClick('home')}
            type="button"
            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-left tactile-btn transition-all ${
              activeTab === 'home'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-pink-500' : 'text-slate-400'}`} />
              <span className="text-xs">Home</span>
            </div>
            {inChairCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white">
                Live
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('services')}
            type="button"
            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-left tactile-btn transition-all ${
              activeTab === 'services'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className={`w-4 h-4 ${activeTab === 'services' ? 'text-pink-500' : 'text-slate-400'}`} />
              <span className="text-xs">Services &amp; Prices</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('history')}
            type="button"
            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-left tactile-btn transition-all ${
              activeTab === 'history'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-4 h-4 ${activeTab === 'history' ? 'text-pink-500' : 'text-slate-400'}`} />
              <span className="text-xs">Progress &amp; History</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('customers')}
            type="button"
            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-left tactile-btn transition-all ${
              activeTab === 'customers'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className={`w-4 h-4 ${activeTab === 'customers' ? 'text-pink-500' : 'text-slate-400'}`} />
              <span className="text-xs">Customers</span>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-2 text-[10px] text-slate-400 text-center">
          Laquered • Offline Studio OS
        </div>
      </nav>

      {/* MOBILE: Fixed Bottom Navigation Bar (Image 1 replica) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 safe-pb px-3 py-1 select-none shadow-[0_-4px_20px_rgba(255,100,140,0.06)]">
        <div className="flex items-center justify-around relative">
          {/* Tab 1: Home */}
          <button
            onClick={() => handleTabClick('home')}
            type="button"
            className={`py-1.5 px-3 flex flex-col items-center justify-center tactile-btn transition-colors ${
              activeTab === 'home' ? 'text-pink-500 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label="Home"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-0.5 font-medium">Home</span>
          </button>

          {/* Tab 2: Services / Routine */}
          <button
            onClick={() => handleTabClick('services')}
            type="button"
            className={`py-1.5 px-3 flex flex-col items-center justify-center tactile-btn transition-colors ${
              activeTab === 'services' ? 'text-pink-500 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label="Services"
          >
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-0.5 font-medium">Services</span>
          </button>

          {/* Center Elevated Pink Circular '+' Button (Exact replica of Image 1) */}
          <div className="relative -top-4 flex flex-col items-center">
            <button
              onClick={handleCenterPlusClick}
              type="button"
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-300 ring-4 ring-white active:scale-95 transition-transform"
              aria-label="Add Customer and Services"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          {/* Tab 3: History / Progress */}
          <button
            onClick={() => handleTabClick('history')}
            type="button"
            className={`py-1.5 px-3 flex flex-col items-center justify-center tactile-btn transition-colors ${
              activeTab === 'history' ? 'text-pink-500 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label="Progress"
          >
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-0.5 font-medium">Progress</span>
          </button>

          {/* Tab 4: Customers / Profile */}
          <button
            onClick={() => handleTabClick('customers')}
            type="button"
            className={`py-1.5 px-3 flex flex-col items-center justify-center tactile-btn transition-colors ${
              activeTab === 'customers' ? 'text-pink-500 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label="Customers"
          >
            <Users className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-0.5 font-medium">Clients</span>
          </button>
        </div>
      </nav>
    </>
  );
};
