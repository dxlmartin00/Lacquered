import React, { useState } from 'react';
import { X, Calendar, Plus, Check } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import type { AppointmentRecord } from '../../types';
import { BASE_SERVICES, ART_TIERS } from '../../stores/useQuoteStore';
import { playTactileTick } from '../../utils/audio';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (aptId: string) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const clients = useLiveQuery(() => db.clients.toArray()) || [];
  const [clientId, setClientId] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [baseService, setBaseService] = useState<string>(BASE_SERVICES[1].name);
  const [artTier, setArtTier] = useState<number>(1);
  const [seatNow, setSeatNow] = useState<boolean>(true);
  const [quotedPrice, setQuotedPrice] = useState<number>(90);
  const [durationMinutes, setDurationMinutes] = useState<number>(75);
  const [depositPaid, setDepositPaid] = useState<number>(0);
  const [notes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playTactileTick();
    setIsSubmitting(true);
    try {
      const selectedClient = clients.find((c) => c.id === clientId);
      const clientName = selectedClient ? selectedClient.name : guestName || 'Walk-In Guest';

      const newApt: AppointmentRecord = {
        id: `apt-${Date.now()}`,
        clientId: selectedClient ? selectedClient.id : 'guest',
        clientName,
        scheduledTime: seatNow ? Date.now() : Date.now() + 1000 * 60 * 60 * 2,
        status: seatNow ? 'in_chair' : 'scheduled',
        baseService,
        artTier,
        quotedPrice,
        durationMinutes,
        depositPaid,
        notes,
      };

      await db.appointments.add(newApt);
      if (onCreated) onCreated(newApt.id);
      onClose();
    } catch (err) {
      console.error('Failed to create appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-lg hairline-card rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 my-auto max-h-[92dvh] overflow-y-auto modal-spring-enter">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-stone-100">
              New Chair Booking / Walk-In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="touch-target p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client select or guest */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Select Client
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-stone-700"
            >
              <option value="">Guest / New Walk-In Client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.allergies.hema ? '[HEMA Sensitive]' : ''}
                </option>
              ))}
            </select>

            {!clientId && (
              <input
                type="text"
                placeholder="Guest Name..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-100 focus:outline-none focus:border-stone-700 mt-2"
              />
            )}
          </div>

          {/* Service & Art Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Base Service
              </label>
              <select
                value={baseService}
                onChange={(e) => setBaseService(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100"
              >
                {BASE_SERVICES.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} (${b.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Art Tier
              </label>
              <select
                value={artTier}
                onChange={(e) => setArtTier(Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100"
              >
                {ART_TIERS.map((t) => (
                  <option key={t.tier} value={t.tier}>
                    Tier {t.tier} (+${t.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Buffer & Deposit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-stone-400">Quoted ($)</label>
              <input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 font-mono tabular-nums text-sm text-stone-100 text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-stone-400">Mins</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 font-mono tabular-nums text-sm text-stone-100 text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-stone-400">Deposit ($)</label>
              <input
                type="number"
                value={depositPaid}
                onChange={(e) => setDepositPaid(Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 font-mono tabular-nums text-sm text-stone-100 text-center"
              />
            </div>
          </div>

          {/* Seat Now Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <div>
              <span className="text-xs font-semibold text-stone-200">Seat in chair immediately</span>
              <p className="text-[11px] text-stone-400">Marks appointment as actively In Chair</p>
            </div>
            <button
              type="button"
              onClick={() => {
                playTactileTick();
                setSeatNow(!seatNow);
              }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all tactile-btn ${
                seatNow ? 'bg-amber-400 border-amber-400 text-stone-950' : 'bg-stone-900 border-stone-700 text-transparent'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="touch-target w-full py-3.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center justify-center space-x-2 shadow-lg tactile-btn disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{seatNow ? 'CONFIRM & SEAT CLIENT NOW' : 'ADD TO DAILY SCHEDULE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
