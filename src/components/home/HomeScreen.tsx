import React from 'react';
import {
  Sparkles,
  Armchair,
  Clock,
  Plus,
  CheckCircle2,
  Heart,
  TrendingUp,
} from 'lucide-react';
import type { AppointmentRecord, ClientRecord } from '../../types';
import { playTactileTick, playChimeSuccess } from '../../utils/audio';

interface HomeScreenProps {
  activeAppointment: AppointmentRecord | null;
  appointments: AppointmentRecord[];
  clients?: ClientRecord[];
  onOpenAddCustomer: () => void;
  onSeatAppointment: (aptId: string) => void;
  onCompleteAppointment: (aptId: string) => void;
  onNavigateToServices?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeAppointment,
  appointments,
  onOpenAddCustomer,
  onSeatAppointment,
  onCompleteAppointment,
}) => {
  const completedApts = appointments.filter((a) => a.status === 'completed');

  const todayRevenue = completedApts.reduce((sum, a) => sum + (a.totalPrice || 0), 0);

  const handleCheckoutChair = (aptId: string) => {
    playChimeSuccess();
    onCompleteAppointment(aptId);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-28 pt-2 px-1 select-none">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-pink-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Laquered</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            Ready to Style
          </h1>
        </div>

        {/* Studio Badge / Mini Avatar with single-family Lucide icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-200">
          <Sparkles className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Hero Pink Gradient Card (Matching Image 1: "Today's Skin Mood" pink card) */}
      <div className="relative overflow-hidden pink-hero-card rounded-3xl p-5 sm:p-6 text-white space-y-4">
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white/95">
            Active Chair Session
          </span>
          <div className="flex items-center space-x-1 text-xs text-white/80">
            <Clock className="w-3.5 h-3.5" />
            <span>Live</span>
          </div>
        </div>

        {activeAppointment ? (
          <div className="relative z-10 space-y-3">
            <div>
              <h2 className="text-2xl font-black font-display tracking-tight">
                {activeAppointment.clientName}
              </h2>
              <div className="text-xs text-white/90 mt-1 flex flex-wrap gap-1.5">
                {activeAppointment.selectedServices && activeAppointment.selectedServices.length > 0 ? (
                  activeAppointment.selectedServices.map((srv, idx) => (
                    <span
                      key={idx}
                      className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px]"
                    >
                      {srv.name} {srv.quantity > 1 ? `(${srv.quantity}x)` : ''}
                    </span>
                  ))
                ) : (
                  <span>Custom Nail Service</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/20">
              <div>
                <span className="text-[10px] text-white/80 uppercase block">Total Due</span>
                <span className="font-mono tabular-nums text-2xl font-black">
                  ₱{activeAppointment.totalPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCheckoutChair(activeAppointment.id)}
                className="py-2.5 px-4 rounded-2xl bg-white text-pink-600 font-bold text-xs shadow-lg shadow-pink-900/20 flex items-center space-x-1.5 tactile-btn hover:bg-pink-50"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Finish &amp; Complete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Armchair className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Chair is Currently Open</h3>
                <p className="text-xs text-white/80">Tap to add customer &amp; pick services</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAddCustomer}
              className="w-full py-3 rounded-2xl bg-white text-pink-600 font-bold text-xs shadow-lg shadow-pink-900/20 flex items-center justify-center space-x-2 tactile-btn hover:bg-pink-50"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Seat New Customer Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Summary Pill / Today's Routine (Matching Image 1: "Daily Routine" section) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-base font-bold text-slate-800">
            Today's Schedule &amp; Orders
          </h3>
          <span className="text-xs font-semibold text-pink-500">
            {appointments.length} Total
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="pastel-card rounded-3xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-pink-400">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500">
              No appointments scheduled yet. Tap the pink '+' button to add your first customer!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {appointments.map((apt) => {
              const isInChair = apt.status === 'in_chair';
              const isDone = apt.status === 'completed';

              return (
                <div
                  key={apt.id}
                  className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 border transition-colors ${isInChair
                      ? 'bg-pink-50/90 border-pink-300 shadow-sm'
                      : isDone
                        ? 'bg-white/80 border-slate-100 opacity-70'
                        : 'bg-white border-pink-100 hover:border-pink-200 shadow-xs'
                    }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-800 truncate">
                        {apt.clientName}
                      </span>
                      {isInChair && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-pink-500 text-white">
                          In Chair
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                          Paid
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      {apt.selectedServices && apt.selectedServices.length > 0
                        ? apt.selectedServices.map((s) => s.name).join(', ')
                        : 'Nail service'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0">
                    <div className="font-mono tabular-nums text-sm font-bold text-slate-800">
                      ₱{apt.totalPrice}
                    </div>

                    {!isInChair && !isDone && (
                      <button
                        type="button"
                        onClick={() => {
                          playTactileTick();
                          onSeatAppointment(apt.id);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs tactile-btn shadow-xs"
                      >
                        Seat
                      </button>
                    )}

                    {isInChair && (
                      <button
                        type="button"
                        onClick={() => handleCheckoutChair(apt.id)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs tactile-btn shadow-xs"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Studio Tip / Revenue Banner (Matching Image 1: "Today's Tip" section) */}
      <div className="pastel-card rounded-3xl p-4 flex items-center justify-between border border-pink-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Today's Earnings
            </span>
            <span className="text-[11px] text-slate-400">
              {completedApts.length} completed sessions
            </span>
          </div>
        </div>

        <div className="font-mono tabular-nums text-lg font-black text-pink-600">
          ₱{todayRevenue}
        </div>
      </div>
    </div>
  );
};
