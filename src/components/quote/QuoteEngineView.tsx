import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Minus,
  Check,
  Copy,
  Armchair,
  Calendar,
} from 'lucide-react';
import {
  useQuoteStore,
  BASE_SERVICES,
  ART_TIERS,
  NAIL_REPAIR_PRICE,
  NAIL_REPAIR_DURATION,
  FOREIGN_REMOVAL_PRICE,
  FOREIGN_REMOVAL_DURATION,
} from '../../stores/useQuoteStore';
import { useSessionStore } from '../../stores/useSessionStore';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import type { AppointmentRecord } from '../../types';

interface QuoteEngineViewProps {
  onSeatClient?: (appointmentId: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const QuoteEngineView: React.FC<QuoteEngineViewProps> = ({
  onSeatClient,
  onClose,
}) => {
  const {
    selectedBaseId,
    selectedTier,
    nailRepairsCount,
    hasForeignRemoval,
    depositAmount,
    setBaseService,
    setArtTier,
    incrementRepairs,
    decrementRepairs,
    toggleForeignRemoval,
    getTotalPrice,
    getTotalDuration,
    getSelectedBase,
    getSelectedTierObj,
  } = useQuoteStore();

  const { setActiveAppointmentId } = useSessionStore();
  const clients = useLiveQuery(() => db.clients.toArray()) || [];
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const selectedBase = getSelectedBase();
  const selectedTierObj = getSelectedTierObj();
  const totalPrice = getTotalPrice();
  const totalDuration = getTotalDuration();

  const handleCopyQuote = () => {
    const text = `LACQUERED STUDIO QUOTE:
Base: ${selectedBase.name} ($${selectedBase.price} / ${selectedBase.duration}m)
Art: Tier ${selectedTier} - ${selectedTierObj.name} (+$${selectedTierObj.price} / +${selectedTierObj.duration}m)
${nailRepairsCount > 0 ? `Repairs: ${nailRepairsCount} nails (+$${nailRepairsCount * NAIL_REPAIR_PRICE} / +${nailRepairsCount * NAIL_REPAIR_DURATION}m)\n` : ''}${hasForeignRemoval ? `Foreign Removal: Yes (+$${FOREIGN_REMOVAL_PRICE} / +${FOREIGN_REMOVAL_DURATION}m)\n` : ''}---
Total Estimate: $${totalPrice}
Buffer Time: ${totalDuration} mins
Deposit: $${depositAmount}
Due at Chair: $${Math.max(0, totalPrice - depositAmount)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeatNow = async () => {
    setIsSaving(true);
    try {
      const client = clients.find((c) => c.id === selectedClientId) || clients[0];
      const newAppointment: AppointmentRecord = {
        id: `apt-${Date.now()}`,
        clientId: client ? client.id : 'walk-in',
        clientName: client ? client.name : 'Walk-In Consultation',
        scheduledTime: Date.now(),
        status: 'in_chair',
        baseService: selectedBase.name,
        artTier: selectedTier,
        quotedPrice: totalPrice,
        durationMinutes: totalDuration,
        depositPaid: depositAmount,
        notes: `Consultation Quote: ${selectedBase.name} + Tier ${selectedTier}${
          hasForeignRemoval ? ' + Foreign Removal' : ''
        }${nailRepairsCount > 0 ? ` + ${nailRepairsCount} repairs` : ''}`,
      };

      await db.appointments.add(newAppointment);
      setActiveAppointmentId(newAppointment.id);

      if (onSeatClient) {
        onSeatClient(newAppointment.id);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to create chair session:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleScheduleForToday = async () => {
    setIsSaving(true);
    try {
      const client = clients.find((c) => c.id === selectedClientId) || clients[0];
      const newAppointment: AppointmentRecord = {
        id: `apt-${Date.now()}`,
        clientId: client ? client.id : 'walk-in',
        clientName: client ? client.name : 'Walk-In Consultation',
        scheduledTime: Date.now() + 1000 * 60 * 60, // 1 hour from now
        status: 'scheduled',
        baseService: selectedBase.name,
        artTier: selectedTier,
        quotedPrice: totalPrice,
        durationMinutes: totalDuration,
        depositPaid: depositAmount,
      };

      await db.appointments.add(newAppointment);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 md:pb-6 select-none">
      {/* Title & Client Assign */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-studio-surface border border-studio-elevated rounded-2xl p-4 md:p-6 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg md:text-xl font-display font-bold uppercase tracking-wider text-stone-100">
              Live Consultation Quick-Quote
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Real-time tap-to-calculate pricing and appointment time buffer
          </p>
        </div>

        {/* Client Picker */}
        <div className="flex items-center space-x-2">
          <label htmlFor="client-picker" className="text-xs font-mono text-stone-400 uppercase hidden sm:block">
            Client:
          </label>
          <select
            id="client-picker"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded-xl px-3 py-2 min-h-touch focus:outline-none focus:border-stone-500"
          >
            <option value="">Walk-In / Guest Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.allergies.hema ? '⚠️ (HEMA)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 1: Base Service Selection (Glove touch chips) */}
      <div className="bg-studio-surface border border-studio-elevated rounded-2xl p-4 md:p-6 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400">
            Step 1 · Base Foundation Service
          </span>
          <span className="text-xs text-stone-500 font-mono">Select 1 option</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BASE_SERVICES.map((base) => {
            const isSelected = selectedBaseId === base.id;
            return (
              <button
                key={base.id}
                type="button"
                onClick={() => setBaseService(base.id)}
                className={`min-h-touch p-4 rounded-xl text-left transition-all border active:scale-[0.98] ${
                  isSelected
                    ? 'bg-stone-800 border-amber-400/80 text-stone-100 shadow-md shadow-stone-950/50 ring-1 ring-amber-400/30'
                    : 'bg-stone-950/80 hover:bg-stone-900 border-stone-800 text-stone-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-sm text-stone-100">{base.name}</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-300 text-sm">${base.price}</span>
                    <span className="block text-[10px] text-stone-500 font-mono">{base.duration} min</span>
                  </div>
                </div>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {base.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Nail Art Tier Selection */}
      <div className="bg-studio-surface border border-studio-elevated rounded-2xl p-4 md:p-6 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400">
            Step 2 · Nail Art Complexity Tier
          </span>
          <span className="text-xs text-stone-500 font-mono">Tier 0 to Tier 4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ART_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.tier;
            return (
              <button
                key={tier.tier}
                type="button"
                onClick={() => setArtTier(tier.tier)}
                className={`min-h-touch p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-stone-800 border-amber-400/80 text-stone-100 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-stone-950/80 hover:bg-stone-900 border-stone-800 text-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold uppercase text-amber-400">
                      Tier {tier.tier}
                    </span>
                    <span className="font-mono font-bold text-stone-200 text-sm">
                      {tier.price > 0 ? `+$${tier.price}` : '$0'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-stone-200">{tier.name.split(': ')[1] || tier.name}</div>
                  <p className="text-[11px] text-stone-400 mt-1.5 leading-normal">
                    {tier.description}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>Buffer</span>
                  <span>{tier.duration > 0 ? `+${tier.duration}m` : '0m'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Structural Extras (Nail repairs & foreign removal) */}
      <div className="bg-studio-surface border border-studio-elevated rounded-2xl p-4 md:p-6 space-y-4 shadow-md">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400">
          Step 3 · Structural Add-Ons &amp; Prep
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nail Repairs Stepper */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div>
              <div className="text-sm font-semibold text-stone-200">Broken / Missing Nail Repairs</div>
              <div className="text-xs text-stone-400 mt-0.5 font-mono">
                ${NAIL_REPAIR_PRICE} &amp; +{NAIL_REPAIR_DURATION}m per finger
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={nailRepairsCount <= 0}
                onClick={decrementRepairs}
                className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 border border-stone-700"
                aria-label="Decrease repair count"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-12 h-11 rounded-xl bg-stone-900 font-mono text-lg font-bold text-amber-300 flex items-center justify-center border border-stone-800">
                {nailRepairsCount}
              </div>

              <button
                type="button"
                disabled={nailRepairsCount >= 10}
                onClick={incrementRepairs}
                className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 border border-stone-700"
                aria-label="Increase repair count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Foreign Removal Toggle */}
          <button
            type="button"
            onClick={toggleForeignRemoval}
            className={`min-h-touch p-4 rounded-xl text-left border flex items-center justify-between transition-all active:scale-[0.98] ${
              hasForeignRemoval
                ? 'bg-stone-800 border-amber-400/80 text-stone-100 ring-1 ring-amber-400/30'
                : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900'
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-stone-200">Foreign Salon Removal / Soak</div>
              <div className="text-xs text-stone-400 mt-0.5 font-mono">
                +${FOREIGN_REMOVAL_PRICE} &amp; +{FOREIGN_REMOVAL_DURATION}m debulk &amp; soak
              </div>
            </div>

            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                hasForeignRemoval
                  ? 'bg-amber-400 border-amber-400 text-stone-950'
                  : 'bg-stone-900 border-stone-700 text-transparent'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Quote Aggregate Summary Bar */}
      <div className="sticky bottom-16 md:bottom-4 z-30 bg-stone-950/95 backdrop-blur-md border border-stone-700 rounded-2xl p-4 md:p-5 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Price & Buffer Total Display */}
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                Total Estimated Price
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl md:text-4xl font-extrabold font-mono text-amber-300">
                  ${totalPrice}
                </span>
                <span className="text-xs font-mono text-stone-400">USD</span>
              </div>
            </div>

            <div className="h-10 w-px bg-stone-800" />

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                Total Calendar Buffer
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl md:text-3xl font-extrabold font-mono text-stone-100">
                  {totalDuration}
                </span>
                <span className="text-xs font-mono text-stone-400">mins</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyQuote}
              className="touch-target px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-mono text-xs font-semibold flex items-center space-x-2 border border-stone-700 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO DM' : 'COPY BREAKDOWN'}</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleScheduleForToday}
              className="touch-target px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-mono text-xs font-semibold flex items-center space-x-2 border border-stone-700 transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>BOOK LATER</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSeatNow}
              className="touch-target px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-2 shadow-lg shadow-stone-900 transition-all active:scale-95"
            >
              <Armchair className="w-4 h-4 text-stone-950 stroke-[2.5]" />
              <span>SEAT IN CHAIR NOW</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
