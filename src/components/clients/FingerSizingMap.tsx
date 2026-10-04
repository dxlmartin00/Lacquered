import React from 'react';
import { Minus, Plus, Sparkles, Check, Copy } from 'lucide-react';
import type { SizingProfile, FingerName, SizingHand, SizingSystem } from '../../types';
import { db } from '../../db/schema';

interface FingerSizingMapProps {
  clientId: string;
  sizing: SizingProfile;
  readOnly?: boolean;
  onUpdate?: (updated: SizingProfile) => void;
}

const FINGER_LABELS: { key: FingerName; label: string; short: string }[] = [
  { key: 'thumb', label: 'Thumb', short: 'TH' },
  { key: 'index', label: 'Index', short: 'IN' },
  { key: 'middle', label: 'Middle', short: 'MID' },
  { key: 'ring', label: 'Ring', short: 'RG' },
  { key: 'pinky', label: 'Pinky', short: 'PK' },
];

const SIZING_SYSTEMS: SizingSystem[] = ['Gel-X', 'Paper-Forms', 'Press-On', 'Custom'];

export const FingerSizingMap: React.FC<FingerSizingMapProps> = ({
  clientId,
  sizing,
  readOnly = false,
  onUpdate,
}) => {
  const [copied, setCopied] = React.useState(false);

  const updateFingerSize = async (
    hand: 'leftHand' | 'rightHand',
    finger: FingerName,
    delta: number
  ) => {
    if (readOnly) return;
    const currentVal = sizing[hand][finger] ?? 4;
    // Gel-X sizes typically 00 (-1) to 9
    const newVal = Math.max(-1, Math.min(9, currentVal + delta));

    const updatedProfile: SizingProfile = {
      ...sizing,
      [hand]: {
        ...sizing[hand],
        [finger]: newVal,
      },
    };

    if (onUpdate) {
      onUpdate(updatedProfile);
    }

    try {
      await db.clients.update(clientId, { sizing: updatedProfile });
    } catch (err) {
      console.error('Failed to update sizing in IndexedDB:', err);
    }
  };

  const handleSystemChange = async (system: SizingSystem) => {
    if (readOnly) return;
    const updatedProfile: SizingProfile = {
      ...sizing,
      system,
    };
    if (onUpdate) onUpdate(updatedProfile);
    try {
      await db.clients.update(clientId, { sizing: updatedProfile });
    } catch (err) {
      console.error('Failed to change sizing system:', err);
    }
  };

  const copySizingSummary = () => {
    const formatHand = (h: SizingHand) =>
      `T:${h.thumb === -1 ? '00' : h.thumb} I:${h.index} M:${h.middle} R:${h.ring} P:${h.pinky}`;
    const text = `Sizing (${sizing.system}): L [${formatHand(sizing.leftHand)}] | R [${formatHand(sizing.rightHand)}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatDisplaySize = (val: number) => {
    if (val === -1) return '00';
    return val.toString();
  };

  return (
    <div className="w-full bg-studio-surface border border-studio-elevated rounded-2xl p-4 md:p-6 space-y-5 select-none shadow-md">
      {/* Header with System Selector & Quick Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-studio-elevated">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold font-mono tracking-wider text-stone-200 uppercase">
            10-Finger Sizing Vault
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* System Selection Chips */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            {SIZING_SYSTEMS.map((sys) => (
              <button
                key={sys}
                type="button"
                disabled={readOnly}
                onClick={() => handleSystemChange(sys)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  sizing.system === sys
                    ? 'bg-stone-800 text-stone-100 font-semibold shadow-sm'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={copySizingSummary}
            className="touch-target p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
            title="Copy Sizing Summary"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sizing Grids: Left Hand & Right Hand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Hand Grid */}
        <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400">
              Left Hand
            </span>
            <span className="text-[11px] font-mono text-stone-500">
              Thumb → Pinky
            </span>
          </div>

          <div className="space-y-2">
            {FINGER_LABELS.map(({ key, label, short }) => {
              const value = sizing.leftHand[key] ?? 4;
              return (
                <div
                  key={`left-${key}`}
                  className="flex items-center justify-between bg-stone-900/90 rounded-xl px-3 py-2 border border-stone-800/60"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-stone-800 font-mono text-xs font-bold text-stone-400 flex items-center justify-center">
                      {short}
                    </span>
                    <span className="text-sm font-medium text-stone-200">{label}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Oversized Stepper - (Min 44x44 / 48x48) */}
                    <button
                      type="button"
                      disabled={readOnly || value <= -1}
                      onClick={() => updateFingerSize('leftHand', key, -1)}
                      className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 border border-stone-700"
                      aria-label={`Decrease ${label} Left Hand`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="w-12 h-11 rounded-xl bg-stone-950 font-mono text-xl font-extrabold text-amber-300 flex items-center justify-center border border-stone-800 shadow-inner">
                      {formatDisplaySize(value)}
                    </div>

                    {/* Oversized Stepper + (Min 44x44 / 48x48) */}
                    <button
                      type="button"
                      disabled={readOnly || value >= 9}
                      onClick={() => updateFingerSize('leftHand', key, 1)}
                      className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 border border-stone-700"
                      aria-label={`Increase ${label} Left Hand`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand Grid */}
        <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400">
              Right Hand
            </span>
            <span className="text-[11px] font-mono text-stone-500">
              Thumb → Pinky
            </span>
          </div>

          <div className="space-y-2">
            {FINGER_LABELS.map(({ key, label, short }) => {
              const value = sizing.rightHand[key] ?? 4;
              return (
                <div
                  key={`right-${key}`}
                  className="flex items-center justify-between bg-stone-900/90 rounded-xl px-3 py-2 border border-stone-800/60"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-stone-800 font-mono text-xs font-bold text-stone-400 flex items-center justify-center">
                      {short}
                    </span>
                    <span className="text-sm font-medium text-stone-200">{label}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Oversized Stepper - */}
                    <button
                      type="button"
                      disabled={readOnly || value <= -1}
                      onClick={() => updateFingerSize('rightHand', key, -1)}
                      className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 border border-stone-700"
                      aria-label={`Decrease ${label} Right Hand`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="w-12 h-11 rounded-xl bg-stone-950 font-mono text-xl font-extrabold text-amber-300 flex items-center justify-center border border-stone-800 shadow-inner">
                      {formatDisplaySize(value)}
                    </div>

                    {/* Oversized Stepper + */}
                    <button
                      type="button"
                      disabled={readOnly || value >= 9}
                      onClick={() => updateFingerSize('rightHand', key, 1)}
                      className="touch-target w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 border border-stone-700"
                      aria-label={`Increase ${label} Right Hand`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
