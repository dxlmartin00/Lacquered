import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Check,
  Copy,
  Armchair,
  Receipt,
} from 'lucide-react';
import {
  useQuoteStore,
  BASE_SERVICES,
  ART_TIERS,
  NAIL_REPAIR_PRICE,
  FOREIGN_REMOVAL_PRICE,
  FOREIGN_REMOVAL_DURATION,
} from '../../stores/useQuoteStore';
import { useSessionStore } from '../../stores/useSessionStore';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import type { AppointmentRecord } from '../../types';
import { playTactileTick } from '../../utils/audio';

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

  const handleSelectBase = (id: string) => {
    playTactileTick();
    setBaseService(id);
  };

  const handleSelectTier = (tier: number) => {
    playTactileTick();
    setArtTier(tier);
  };

  const handleIncrementRepairs = () => {
    playTactileTick();
    incrementRepairs();
  };

  const handleDecrementRepairs = () => {
    playTactileTick();
    decrementRepairs();
  };

  const handleToggleRemoval = () => {
    playTactileTick();
    toggleForeignRemoval();
  };

  const handleCopyQuote = () => {
    playTactileTick();
    const text = `LACQUERED STUDIO QUOTE:
${selectedBase.name} ($${selectedBase.price})
Art Tier ${selectedTier}: ${selectedTierObj.name} (+$${selectedTierObj.price})
${nailRepairsCount > 0 ? `Repairs: ${nailRepairsCount} nails (+$${nailRepairsCount * NAIL_REPAIR_PRICE})\n` : ''}${hasForeignRemoval ? `Foreign Removal: Yes (+$${FOREIGN_REMOVAL_PRICE})\n` : ''}---
Total: $${totalPrice} (${totalDuration} min)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSeatNow = async () => {
    playTactileTick();
    setIsSaving(true);
    try {
      const client = clients.find((c) => c.id === selectedClientId) || clients[0];
      const newAppointment: AppointmentRecord = {
        id: `apt-${Date.now()}`,
        clientId: client ? client.id : 'walk-in',
        clientName: client ? client.name : 'Walk-In Client',
        scheduledTime: Date.now(),
        status: 'in_chair',
        baseService: selectedBase.name,
        artTier: selectedTier,
        quotedPrice: totalPrice,
        durationMinutes: totalDuration,
        depositPaid: depositAmount,
      };

      await db.appointments.add(newAppointment);
      setActiveAppointmentId(newAppointment.id);

      if (onSeatClient) onSeatClient(newAppointment.id);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create chair session:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 md:pb-6 select-none">
      {/* Title & Client Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-800/60">
        <div>
          <h2 className="text-lg font-display font-bold uppercase tracking-wider text-stone-100">
            Consultation Quote
          </h2>
          <span className="text-xs font-mono text-stone-400">
            Tap extension &amp; art tiers for instant pricing calculation
          </span>
        </div>

        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="bg-stone-900 border border-stone-800 text-stone-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-stone-700"
        >
          <option value="">Walk-In Guest</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.allergies.hema ? '[HEMA Sensitive]' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Base Services */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
          1. Base Extension / Structure
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {BASE_SERVICES.map((base) => {
            const isSelected = selectedBaseId === base.id;
            return (
              <button
                key={base.id}
                type="button"
                onClick={() => handleSelectBase(base.id)}
                className={`min-h-touch p-3 rounded-xl text-left tactile-btn border ${
                  isSelected
                    ? 'bg-stone-800/90 border-amber-400/90 text-stone-100 ring-1 ring-amber-400/30'
                    : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800/80 text-stone-300'
                }`}
              >
                <div className="text-xs font-medium text-stone-200 truncate">{base.name}</div>
                <div className="text-sm font-mono tabular-nums font-bold text-amber-300 mt-1">${base.price}</div>
                <div className="text-[10px] font-mono text-stone-500">{base.duration}m</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Art Tiers */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
          2. Nail Art Tier Complexity
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {ART_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.tier;
            return (
              <button
                key={tier.tier}
                type="button"
                onClick={() => handleSelectTier(tier.tier)}
                className={`min-h-touch p-3 rounded-xl text-left tactile-btn border ${
                  isSelected
                    ? 'bg-stone-800/90 border-amber-400/90 text-stone-100 ring-1 ring-amber-400/30'
                    : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800/80 text-stone-300'
                }`}
              >
                <div className="text-xs font-mono font-bold text-amber-400">Tier {tier.tier}</div>
                <div className="text-[11px] text-stone-200 mt-0.5 truncate">{tier.name.split(': ')[1] || tier.name}</div>
                <div className="text-xs font-mono tabular-nums text-stone-400 mt-1">
                  {tier.price > 0 ? `+$${tier.price}` : '$0'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add-ons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Nail Repairs */}
        <div className="flex items-center justify-between p-3.5 rounded-xl hairline-card">
          <div>
            <span className="text-xs font-medium text-stone-200">Emergency Nail Repairs</span>
            <div className="text-[10px] text-stone-500 font-mono">${NAIL_REPAIR_PRICE} / nail tip</div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={nailRepairsCount <= 0}
              onClick={handleDecrementRepairs}
              className="touch-target w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-20 flex items-center justify-center tactile-btn"
              aria-label="Decrease nail repairs"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono tabular-nums text-base font-bold text-amber-300 w-6 text-center">
              {nailRepairsCount}
            </span>
            <button
              type="button"
              disabled={nailRepairsCount >= 10}
              onClick={handleIncrementRepairs}
              className="touch-target w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-20 flex items-center justify-center tactile-btn"
              aria-label="Increase nail repairs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Foreign Removal */}
        <button
          type="button"
          onClick={handleToggleRemoval}
          className={`min-h-touch p-3.5 rounded-xl border flex items-center justify-between tactile-btn ${
            hasForeignRemoval
              ? 'bg-stone-800/90 border-amber-400/90 text-stone-100 ring-1 ring-amber-400/20'
              : 'bg-stone-900/60 border-stone-800 text-stone-300'
          }`}
        >
          <div>
            <span className="text-xs font-medium text-stone-200">Foreign Salon Removal</span>
            <div className="text-[10px] text-stone-500 font-mono">+${FOREIGN_REMOVAL_PRICE} · +{FOREIGN_REMOVAL_DURATION}m soak</div>
          </div>
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
              hasForeignRemoval
                ? 'bg-amber-400 border-amber-400 text-stone-950 font-bold'
                : 'border-stone-700 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Summary Ticket Card (Taste & Impeccable) */}
      <div className="p-5 rounded-2xl hairline-card flex flex-wrap items-center justify-between gap-4 mt-2">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-stone-500 block font-semibold">
              Quoted Total
            </span>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-mono tabular-nums font-bold text-amber-300">
                ${totalPrice}
              </span>
              <span className="text-xs font-mono text-stone-400">
                {totalDuration} mins chair buffer
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyQuote}
            className="touch-target px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-xs flex items-center space-x-1.5 border border-stone-800 tactile-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSeatNow}
            className="touch-target px-4 py-2 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-1.5 tactile-btn shadow-md disabled:opacity-50"
          >
            <Armchair className="w-4 h-4 stroke-[2.5]" />
            <span>Seat in Chair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
