import React, { useState } from 'react';
import { Minus, Plus, Check, Copy } from 'lucide-react';
import type { SizingProfile, FingerName, SizingHand, SizingSystem } from '../../types';
import { db } from '../../db/schema';
import { playTactileTick } from '../../utils/audio';

interface FingerSizingMapProps {
  clientId: string;
  sizing: SizingProfile;
  readOnly?: boolean;
  onUpdate?: (updated: SizingProfile) => void;
}

const FINGERS: { key: FingerName; short: string; label: string }[] = [
  { key: 'thumb', short: 'TH', label: 'Thumb' },
  { key: 'index', short: 'IN', label: 'Index' },
  { key: 'middle', short: 'MID', label: 'Middle' },
  { key: 'ring', short: 'RG', label: 'Ring' },
  { key: 'pinky', short: 'PK', label: 'Pinky' },
];

const SIZING_SYSTEMS: SizingSystem[] = ['Gel-X', 'Paper-Forms', 'Press-On', 'Custom'];

export const FingerSizingMap: React.FC<FingerSizingMapProps> = ({
  clientId,
  sizing,
  readOnly = false,
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);

  const updateFingerSize = async (
    hand: 'leftHand' | 'rightHand',
    finger: FingerName,
    delta: number
  ) => {
    if (readOnly) return;
    playTactileTick();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(10); } catch { /* ignore */ }
    }

    const currentVal = sizing[hand][finger] ?? 4;
    const newVal = Math.max(-1, Math.min(9, currentVal + delta));

    const updatedProfile: SizingProfile = {
      ...sizing,
      [hand]: {
        ...sizing[hand],
        [finger]: newVal,
      },
    };

    if (onUpdate) onUpdate(updatedProfile);
    try {
      await db.clients.update(clientId, { sizing: updatedProfile });
    } catch (err) {
      console.error('Failed to update sizing in IndexedDB:', err);
    }
  };

  const handleSystemChange = async (system: SizingSystem) => {
    if (readOnly) return;
    playTactileTick();
    const updatedProfile: SizingProfile = { ...sizing, system };
    if (onUpdate) onUpdate(updatedProfile);
    try {
      await db.clients.update(clientId, { sizing: updatedProfile });
    } catch (err) {
      console.error('Failed to change sizing system:', err);
    }
  };

  const copySizingSummary = () => {
    playTactileTick();
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

  const renderHand = (handKey: 'leftHand' | 'rightHand', title: string) => (
    <div className="hairline-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-stone-300 font-semibold">
          {title}
        </span>
        <span className="text-[10px] font-mono text-stone-500">Thumb → Pinky</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {FINGERS.map(({ key, short, label }) => {
          const value = sizing[handKey][key] ?? 4;
          return (
            <div
              key={`${handKey}-${key}`}
              className="flex flex-col items-center bg-stone-900/90 rounded-xl p-2 border border-stone-800/70"
            >
              <span className="text-[10px] font-mono text-stone-500 font-bold mb-1">
                {short}
              </span>

              {/* Number display with tabular numerals */}
              <div className="font-mono tabular-nums text-2xl font-light text-amber-300 py-1">
                {formatDisplaySize(value)}
              </div>

              {/* Stepper buttons (Glove-friendly min-48px touch targets) */}
              <div className="flex items-center space-x-1 mt-1 w-full justify-center">
                <button
                  type="button"
                  disabled={readOnly || value <= -1}
                  onClick={() => updateFingerSize(handKey, key, -1)}
                  className="touch-target w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-20 flex items-center justify-center tactile-btn"
                  aria-label={`Decrease ${label}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={readOnly || value >= 9}
                  onClick={() => updateFingerSize(handKey, key, 1)}
                  className="touch-target w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-20 flex items-center justify-center tactile-btn"
                  aria-label={`Increase ${label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full hairline-card rounded-2xl p-5 space-y-4 select-none">
      {/* Header with System Selector & Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800/60">
        <div className="flex items-center space-x-1.5">
          {SIZING_SYSTEMS.map((sys) => (
            <button
              key={sys}
              type="button"
              disabled={readOnly}
              onClick={() => handleSystemChange(sys)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg tactile-chip ${
                sizing.system === sys
                  ? 'bg-stone-800 text-stone-100 font-semibold border border-stone-700'
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
          className="touch-target px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-mono flex items-center space-x-1.5 tactile-btn"
          title="Copy Sizes"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Hand Grids */}
      <div className="space-y-4">
        {renderHand('leftHand', 'Left Hand')}
        {renderHand('rightHand', 'Right Hand')}
      </div>
    </div>
  );
};
