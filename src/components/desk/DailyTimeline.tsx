import React, { useState } from 'react';
import {
  Calendar,
  Armchair,
  CheckCircle2,
  Plus,
  ChevronRight,
} from 'lucide-react';
import type { AppointmentRecord, ClientRecord } from '../../types';

interface DailyTimelineProps {
  appointments: AppointmentRecord[];
  clients: ClientRecord[];
  onSelectAppointment: (apt: AppointmentRecord) => void;
  onSeatAppointment: (aptId: string) => void;
  onNewAppointment: () => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  appointments,
  clients,
  onSelectAppointment,
  onSeatAppointment,
  onNewAppointment,
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const filteredAppointments = appointments
    .filter((apt) => {
      if (filter === 'all') return true;
      if (filter === 'scheduled') return apt.status === 'scheduled' || apt.status === 'in_chair';
      if (filter === 'completed') return apt.status === 'completed';
      return true;
    })
    .sort((a, b) => a.scheduledTime - b.scheduledTime);

  const getClientForApt = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const formatAptTime = (timeMs: number) => {
    const date = new Date(timeMs);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-studio-surface border border-studio-elevated rounded-3xl p-4 sm:p-6 space-y-5 select-none shadow-md">
      {/* Header & Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-studio-elevated">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-stone-100">
            Daily Studio Schedule
          </h3>
          <span className="text-xs font-mono text-stone-400 px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800">
            {appointments.length} Sessions
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'scheduled'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'completed'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Finished
            </button>
          </div>

          <button
            onClick={onNewAppointment}
            className="touch-target px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-mono flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-10 text-stone-500 font-mono text-xs space-y-2">
            <Calendar className="w-8 h-8 text-stone-700 mx-auto" />
            <p>No appointments match the selected filter</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const client = getClientForApt(apt.clientId);
            const isInChair = apt.status === 'in_chair';
            const isCompleted = apt.status === 'completed';
            const hasAllergy = client?.allergies.hema || client?.allergies.acrylates;

            return (
              <div
                key={apt.id}
                className={`p-4 rounded-2xl border transition-all active:scale-[0.99] flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isInChair
                    ? 'bg-emerald-950/20 border-emerald-600/70 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/20'
                    : isCompleted
                    ? 'bg-stone-950/40 border-stone-800/60 opacity-70'
                    : 'bg-stone-950/90 border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Left Block: Time & Client */}
                <div className="flex items-start space-x-3.5">
                  <div className="flex flex-col items-center justify-center w-14 py-2 rounded-xl bg-stone-900 border border-stone-800 font-mono shrink-0">
                    <span className="text-xs font-bold text-stone-200">
                      {formatAptTime(apt.scheduledTime)}
                    </span>
                    <span className="text-[10px] text-stone-500">{apt.durationMinutes}m</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-base text-stone-100">{apt.clientName}</h4>
                      {hasAllergy && (
                        <span className="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                          HEMA ALLERGY
                        </span>
                      )}
                      {isInChair && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 animate-pulse">
                          LIVE IN CHAIR
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400">
                      <span className="text-stone-300">{apt.baseService}</span>
                      <span className="text-stone-600">•</span>
                      <span className="text-amber-400">Tier {apt.artTier} Art</span>
                      <span className="text-stone-600">•</span>
                      <span className="text-stone-200 font-bold">${apt.quotedPrice}</span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-stone-500 line-clamp-1 italic">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {!isInChair && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => onSeatAppointment(apt.id)}
                      className="touch-target px-4 py-2 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Armchair className="w-4 h-4 stroke-[2.5]" />
                      <span>SEAT IN CHAIR</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="flex items-center space-x-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectAppointment(apt)}
                    className="touch-target p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800"
                    title="View Details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
