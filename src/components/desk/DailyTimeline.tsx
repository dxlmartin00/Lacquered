import React from 'react';
import { Armchair, CheckCircle2, ChevronRight } from 'lucide-react';
import type { AppointmentRecord, ClientRecord } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface DailyTimelineProps {
  appointments: AppointmentRecord[];
  clients: ClientRecord[];
  onSelectAppointment: (apt: AppointmentRecord) => void;
  onSeatAppointment: (aptId: string) => void;
  onNewAppointment?: () => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  appointments,
  clients,
  onSelectAppointment,
  onSeatAppointment,
}) => {
  const sortedAppointments = [...appointments].sort((a, b) => a.scheduledTime - b.scheduledTime);

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const formatAptTime = (timeMs: number) => {
    return new Date(timeMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleSeat = (aptId: string) => {
    playTactileTick();
    onSeatAppointment(aptId);
  };

  const handleSelect = (apt: AppointmentRecord) => {
    playTactileTick();
    onSelectAppointment(apt);
  };

  return (
    <div className="w-full hairline-card rounded-2xl p-5 select-none space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-stone-800/60">
        <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-stone-400">
          Today's Appointments
        </h3>
        <span className="text-[11px] font-mono tabular-nums text-stone-500">
          {appointments.length} scheduled
        </span>
      </div>

      <div className="space-y-1.5">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-6 text-stone-500 font-mono text-xs">
            No appointments scheduled for today.
          </div>
        ) : (
          sortedAppointments.map((apt) => {
            const client = getClient(apt.clientId);
            const isInChair = apt.status === 'in_chair';
            const isCompleted = apt.status === 'completed';
            const hasAllergy = client?.allergies.hema || client?.allergies.acrylates;

            return (
              <div
                key={apt.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  isInChair
                    ? 'bg-emerald-950/20 border-emerald-600/40 text-stone-100 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.1)]'
                    : isCompleted
                    ? 'bg-stone-950/30 border-stone-900 text-stone-500 opacity-60'
                    : 'bg-stone-950/70 border-stone-800/80 text-stone-200 hover:border-stone-700'
                }`}
              >
                {/* Time & Client Summary */}
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="font-mono tabular-nums text-xs font-semibold text-stone-400 w-16 shrink-0">
                    {formatAptTime(apt.scheduledTime)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-stone-100 truncate">
                        {apt.clientName}
                      </span>
                      {hasAllergy && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          HEMA
                        </span>
                      )}
                      {isInChair && (
                        <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Chair</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-stone-400 truncate">
                      {apt.baseService} · Tier {apt.artTier} · <span className="tabular-nums">${apt.quotedPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  {!isInChair && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleSeat(apt.id)}
                      className="touch-target px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-1 tactile-btn shadow-sm"
                    >
                      <Armchair className="w-3.5 h-3.5" />
                      <span>Seat</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="text-emerald-400 p-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelect(apt)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 tactile-btn"
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
