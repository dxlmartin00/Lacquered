import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
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
    shadeCodes: ['Studio Sheer Nude #02'],
    topCoat: 'Glossy',
    details: 'Standard nail bed apex build.',
  });

  const hasCriticalAllergy = client?.allergies.hema || client?.allergies.acrylates;
  const hasAcetoneSensitivity = client?.allergies.acetone;

  const leftHand = client?.sizing?.leftHand;
  const rightHand = client?.sizing?.rightHand;

  const formatSize = (val: number | undefined) => {
    if (val === undefined) return '-';
    if (val === -1) return '00';
    return val.toString();
  };

  const handleFormulaSave = (newFormula: ServiceFormula) => {
    setActiveFormula(newFormula);
  };

  return (
    <section className="w-full bg-studio-surface border border-studio-elevated rounded-3xl p-4 sm:p-6 shadow-xl space-y-5 select-none relative overflow-hidden">
      {/* Visual In-Chair Glowing Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-studio-elevated">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
            Active Chair Session
          </span>
          <span className="text-xs text-stone-500 font-mono">
            ID: {appointment.id.slice(-6)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Formula Button */}
          <button
            type="button"
            onClick={() => setIsFormulaModalOpen(true)}
            className="touch-target px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-xs flex items-center space-x-1.5 border border-stone-800 active:scale-95 transition-all"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Gel Formula</span>
          </button>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(true)}
            className="touch-target px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-950/40 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>CHECKOUT</span>
          </button>
        </div>
      </div>

      {/* CRITICAL MEDICAL ALLERGY SAFETY BANNER (High-visibility Crimson) */}
      {hasCriticalAllergy && (
        <div
          role="alert"
          className="w-full rounded-2xl bg-rose-950 border-2 border-rose-800 text-rose-200 p-4 shadow-lg flex items-start space-x-3.5 animate-pulse-slow"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-900 border border-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-rose-300 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-rose-300 bg-rose-900/80 px-2 py-0.5 rounded">
                CRITICAL MEDICAL SENSITIVITY FLAG
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-rose-100">
              Client has active sensitivities:{' '}
              {[
                client?.allergies.hema ? 'HEMA-Allergy (Do NOT use standard gel base)' : '',
                client?.allergies.acrylates ? 'Acrylate Sensitivity' : '',
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
            {client?.allergies.notes && (
              <p className="text-xs text-rose-300/90 italic leading-relaxed pt-0.5">
                Note: "{client.allergies.notes}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Non-critical Acetone warning */}
      {!hasCriticalAllergy && hasAcetoneSensitivity && (
        <div className="w-full rounded-2xl bg-amber-950/70 border border-amber-800 text-amber-200 p-3.5 flex items-center space-x-3 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Acetone Sensitivity: Dehydrates quickly. Use gentle e-file debulk removal.</span>
        </div>
      )}

      {/* Client & Service Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client Name & Shape/Length Details */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
              In The Chair
            </span>
            <h2 className="text-xl font-bold font-sans text-stone-100 tracking-tight">
              {appointment.clientName}
            </h2>
            {client?.instagram && (
              <span className="text-xs text-stone-400 font-mono">{client.instagram}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-900">
            {client?.preferredShape && (
              <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 text-[11px] font-mono">
                {client.preferredShape}
              </span>
            )}
            {client?.preferredLength && (
              <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 text-[11px] font-mono">
                {client.preferredLength}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-amber-400 text-[11px] font-mono font-semibold">
              Tier {appointment.artTier} Art
            </span>
          </div>
        </div>

        {/* Verified Tip Sizing Quick Readout (Thumb to Pinky) */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-stone-950 border border-stone-800/80 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                Verified Tip Sizes ({client?.sizing.system || 'Gel-X'})
              </span>
            </div>
            {client && onViewSizingVault && (
              <button
                type="button"
                onClick={() => onViewSizingVault(client.id)}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                <span>Edit 10-Finger Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dual Hand Sizing Readout Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Left Hand */}
            <div className="bg-stone-900/90 rounded-xl p-2.5 border border-stone-800">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Left Hand (T → P)
              </span>
              <div className="grid grid-cols-5 gap-1 text-center font-mono">
                {[
                  { label: 'TH', val: leftHand?.thumb },
                  { label: 'IN', val: leftHand?.index },
                  { label: 'MID', val: leftHand?.middle },
                  { label: 'RG', val: leftHand?.ring },
                  { label: 'PK', val: leftHand?.pinky },
                ].map((item, idx) => (
                  <div key={`lh-${idx}`} className="bg-stone-950 py-1 rounded border border-stone-800">
                    <span className="block text-[9px] text-stone-500">{item.label}</span>
                    <span className="text-sm font-bold text-amber-300">{formatSize(item.val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hand */}
            <div className="bg-stone-900/90 rounded-xl p-2.5 border border-stone-800">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Right Hand (T → P)
              </span>
              <div className="grid grid-cols-5 gap-1 text-center font-mono">
                {[
                  { label: 'TH', val: rightHand?.thumb },
                  { label: 'IN', val: rightHand?.index },
                  { label: 'MID', val: rightHand?.middle },
                  { label: 'RG', val: rightHand?.ring },
                  { label: 'PK', val: rightHand?.pinky },
                ].map((item, idx) => (
                  <div key={`rh-${idx}`} className="bg-stone-950 py-1 rounded border border-stone-800">
                    <span className="block text-[9px] text-stone-500">{item.label}</span>
                    <span className="text-sm font-bold text-amber-300">{formatSize(item.val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAIR TIMERS: 30s Flash, 60s Full, 10m Soak, with Haptic and Wake Lock */}
      <ChairTimer />

      {/* Active Formula Readout Chip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Tag className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-400">Current Formula:</span>
          <span className="text-stone-200 font-semibold">{activeFormula.baseBrand}</span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-300">{activeFormula.shadeCodes.join(', ')}</span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-400">{activeFormula.topCoat}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFormulaModalOpen(true)}
          className="text-amber-400 hover:text-amber-300 font-semibold"
        >
          Edit Formula
        </button>
      </div>

      {/* Modals */}
      <FormulaLoggerModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        initialFormula={activeFormula}
        onSave={handleFormulaSave}
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
