import React, { useState } from 'react';
import {
  CheckCircle2,
  Tag,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import type { AppointmentRecord, ClientRecord, ServiceFormula } from '../../types';
import { ChairTimer } from './ChairTimer';
import { FormulaLoggerModal } from './FormulaLoggerModal';
import { CheckoutModal } from './CheckoutModal';

interface ActiveSessionCardProps {
  appointment: AppointmentRecord;
  client?: ClientRecord;
  onViewSizingVault?: (clientId: string) => void;
}

export const ActiveSessionCard: React.FC<ActiveSessionCardProps> = ({
  appointment,
  client,
  onViewSizingVault,
}) => {
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [activeFormula, setActiveFormula] = useState<ServiceFormula>({
    baseBrand: client?.allergies.hema ? 'Light Elegance HEMA-Free' : 'Apres Gel-X',
    shadeCodes: ['Cashmere Kiss'],
    topCoat: 'Glossy',
    details: 'Apex structure',
  });

  const hasCriticalAllergy = client?.allergies.hema || client?.allergies.acrylates;
  const leftHand = client?.sizing?.leftHand;
  const rightHand = client?.sizing?.rightHand;

  const formatHandSizes = (h?: Record<string, number>) => {
    if (!h) return '-';
    return [h.thumb, h.index, h.middle, h.ring, h.pinky]
      .map((val) => (val === -1 ? '00' : val))
      .join(' · ');
  };

  return (
    <section className="w-full hairline-card rounded-2xl p-5 md:p-6 space-y-5 select-none shadow-sm relative">
      {/* Top Row: Client identity & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">
              {appointment.clientName}
            </h2>
            {hasCriticalAllergy && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800/80 flex items-center space-x-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>HEMA Sensitive</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-stone-400">
            <span>{appointment.baseService}</span>
            <span className="text-stone-600">•</span>
            <span className="text-amber-400">Tier {appointment.artTier} Art</span>
            <span className="text-stone-600">•</span>
            <span className="tabular-nums font-semibold text-stone-200">${appointment.quotedPrice}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsFormulaModalOpen(true)}
            className="touch-target px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-xs flex items-center space-x-1.5 border border-stone-800 tactile-btn"
          >
            <Tag className="w-3.5 h-3.5 text-stone-400" />
            <span>Formula</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(true)}
            className="touch-target px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-1.5 tactile-btn shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Checkout</span>
          </button>
        </div>
      </div>

      {/* Verified Tip Sizing Strip */}
      {client && (
        <div
          onClick={() => onViewSizingVault && onViewSizingVault(client.id)}
          className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-stone-950/70 border border-stone-800/60 font-mono text-xs cursor-pointer hover:border-stone-700 transition-colors"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-400">
            <span className="text-stone-500 uppercase text-[10px] tracking-wider font-semibold">
              {client.sizing.system} Sizes:
            </span>
            <span className="text-stone-200 tabular-nums">
              <strong className="text-stone-500 font-normal">L </strong>
              {formatHandSizes(leftHand)}
            </span>
            <span className="text-stone-700">|</span>
            <span className="text-stone-200 tabular-nums">
              <strong className="text-stone-500 font-normal">R </strong>
              {formatHandSizes(rightHand)}
            </span>
            <span className="text-stone-500 text-[11px]">
              ({client.preferredShape} · {client.preferredLength})
            </span>
          </div>

          <span className="text-[11px] text-amber-400/90 flex items-center space-x-0.5 hover:text-amber-300">
            <span>Edit Sizing</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      )}

      {/* The Chair Timer */}
      <ChairTimer />

      {/* Modals */}
      <FormulaLoggerModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        initialFormula={activeFormula}
        onSave={setActiveFormula}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        appointment={appointment}
        formula={activeFormula}
        onCompleted={() => {}}
      />
    </section>
  );
};
