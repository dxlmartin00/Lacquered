import React, { useState } from 'react';
import { Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import type { AppointmentRecord } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface HistoryScreenProps {
  appointments: AppointmentRecord[];
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ appointments }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const completed = appointments.filter((a) => a.status === 'completed');

  // Filter based on period
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const filtered = completed.filter((a) => {
    const diff = now - a.scheduledTime;
    if (period === 'today') return diff <= dayMs;
    if (period === 'week') return diff <= 7 * dayMs;
    if (period === 'month') return diff <= 30 * dayMs;
    return true;
  });

  const totalEarnings = filtered.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  const avgOrder = filtered.length > 0 ? Math.round(totalEarnings / filtered.length) : 0;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-28 pt-2 px-1 select-none">
      {/* Title Header matching Image 1: "My Progress" */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Studio Progress
          </h2>
          <p className="text-xs text-slate-400">
            Track your studio performance and completed sets
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Pill period switcher matching Image 1 ("Week | Month | Year") */}
      <div className="flex items-center space-x-1 p-1 bg-white rounded-2xl border border-pink-100 shadow-xs">
        {(['today', 'week', 'month', 'all'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              playTactileTick();
              setPeriod(p);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              period === p
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Revenue Score Card matching Image 1 ("Skin Score 85 Great!") */}
      <div className="relative overflow-hidden pastel-card rounded-3xl p-5 border border-pink-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-pink-500">
            Earnings Summary
          </span>
          <span className="text-[11px] text-slate-400">
            {filtered.length} Orders Completed
          </span>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="font-mono text-3xl sm:text-4xl font-black text-slate-800 tabular-nums">
            ₱{totalEarnings}
          </span>
          <span className="text-xs text-slate-400">gross revenue</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pink-50">
          <div className="p-2.5 rounded-2xl bg-pink-50/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Avg Ticket
            </span>
            <span className="font-mono text-sm font-bold text-pink-600">
              ₱{avgOrder}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-pink-50/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Active Clients
            </span>
            <span className="font-mono text-sm font-bold text-slate-700">
              {new Set(filtered.map((f) => f.clientId)).size}
            </span>
          </div>
        </div>
      </div>

      {/* Completed Orders List */}
      <div className="space-y-2">
        <h3 className="font-display text-sm font-bold text-slate-700 px-1">
          Recent Completed Sets
        </h3>

        {filtered.length === 0 ? (
          <div className="pastel-card rounded-3xl p-8 text-center space-y-2 border border-pink-100">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-pink-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500">
              No orders completed for this period yet.
            </p>
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="pastel-card p-4 rounded-2xl flex items-center justify-between gap-3 border border-pink-100 hover:border-pink-200"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-800 truncate">
                    {apt.clientName}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Done</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 truncate">
                  {apt.selectedServices && apt.selectedServices.length > 0
                    ? apt.selectedServices.map((s) => `${s.name} (x${s.quantity})`).join(', ')
                    : 'Nail styling'}
                </div>

                <div className="text-[10px] text-slate-400">
                  {new Date(apt.scheduledTime).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div className="font-mono tabular-nums text-base font-black text-pink-600 shrink-0">
                ₱{apt.totalPrice}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
