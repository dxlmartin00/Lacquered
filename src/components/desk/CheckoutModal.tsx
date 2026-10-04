import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  Heart,
  FileCheck,
} from 'lucide-react';
import type { AppointmentRecord, ServiceFormula, ServiceLogRecord } from '../../types';
import { useImageCompressor, type CompressionResult } from '../../hooks/useImageCompressor';
import { db } from '../../db/schema';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord;
  formula?: ServiceFormula;
  onCompleted: () => void;
}

const TIP_PERCENTAGES = [15, 20, 25, 30];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  appointment,
  formula,
  onCompleted,
}) => {
  const [finalBilled, setFinalBilled] = useState<number>(appointment.quotedPrice);
  const [tipAmount, setTipAmount] = useState<number>(Math.round(appointment.quotedPrice * 0.2));
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(20);
  const [isCustomTip, setIsCustomTip] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Photo capture & compression state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { compressImage, isCompressing } = useImageCompressor();
  const [compressedResult, setCompressedResult] = useState<CompressionResult | null>(null);

  if (!isOpen) return null;

  const handleSelectTipPercent = (pct: number) => {
    setSelectedTipPercent(pct);
    setIsCustomTip(false);
    setTipAmount(Math.round((finalBilled * pct) / 100));
  };

  const handleCustomTipChange = (val: number) => {
    setIsCustomTip(true);
    setTipAmount(Math.max(0, val));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await compressImage(file, 1440, 0.8);
      setCompressedResult(result);
    } catch (err) {
      console.error('Failed to compress camera photo:', err);
    }
  };

  const totalCollected = finalBilled + tipAmount;
  const balanceDue = Math.max(0, totalCollected - (appointment.depositPaid || 0));

  const handleCompleteService = async () => {
    setIsProcessing(true);
    try {
      // 1. Create permanent ServiceLogRecord
      const logRecord: ServiceLogRecord = {
        id: `log-${Date.now()}`,
        appointmentId: appointment.id,
        clientId: appointment.clientId,
        clientName: appointment.clientName,
        timestamp: Date.now(),
        baseService: appointment.baseService,
        formula: formula || {
          baseBrand: 'Studio Standard Gel',
          shadeCodes: ['Natural Nude'],
          topCoat: 'Glossy',
        },
        resultPhotoBlob: compressedResult?.blob,
        finalBilled,
        tip: tipAmount,
      };

      await db.serviceLogs.add(logRecord);

      // 2. Mark appointment as completed
      await db.appointments.update(appointment.id, {
        status: 'completed',
        quotedPrice: finalBilled,
      });

      onCompleted();
      onClose();
    } catch (err) {
      console.error('Failed to checkout chair session:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-studio-surface border border-studio-elevated rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 my-auto max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-studio-elevated">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-stone-100">
                Chair Session Checkout
              </h3>
              <p className="text-xs text-stone-400">{appointment.clientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="touch-target p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billed Service Breakdown */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Service</span>
            <span className="text-stone-200">{appointment.baseService} (Tier {appointment.artTier})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-300">Base Billed Amount ($):</span>
            <input
              type="number"
              value={finalBilled}
              onChange={(e) => setFinalBilled(Math.max(0, Number(e.target.value)))}
              className="w-24 bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-right font-mono font-bold text-stone-100 text-sm focus:outline-none focus:border-stone-500"
            />
          </div>

          {appointment.depositPaid > 0 && (
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
              <span>Deposit Already Paid</span>
              <span className="text-emerald-400">-${appointment.depositPaid}</span>
            </div>
          )}
        </div>

        {/* Tip Selector (Glove friendly 48px touch targets) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Gratuity / Tip</span>
            </label>
            <span className="text-sm font-mono font-bold text-amber-300">${tipAmount}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {TIP_PERCENTAGES.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleSelectTipPercent(pct)}
                className={`min-h-touch px-2 py-2 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95 ${
                  !isCustomTip && selectedTipPercent === pct
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <span className="text-xs text-stone-400 font-mono">Custom Tip $:</span>
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => handleCustomTipChange(Number(e.target.value))}
              className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-stone-600"
            />
          </div>
        </div>

        {/* Camera / Result Photo Capture (HTML5 Canvas WebP compression) */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Finished Set Result Photo (Optional)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoSelect}
          />

          {compressedResult ? (
            <div className="flex items-center space-x-3 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <img
                src={compressedResult.dataUrl}
                alt="Finished Nails"
                className="w-16 h-16 object-cover rounded-lg border border-stone-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-semibold">
                  <FileCheck className="w-4 h-4" />
                  <span>Compressed WebP</span>
                </div>
                <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                  {Math.round(compressedResult.compressedSizeBytes / 1024)} KB ({compressedResult.reductionPercentage}% smaller)
                </div>
                <div className="text-[10px] text-stone-500 font-mono">
                  {compressedResult.width}×{compressedResult.height}px
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="touch-target px-2.5 py-1 text-xs font-mono text-stone-400 hover:text-stone-200"
              >
                Retake
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => fileInputRef.current?.click()}
              className="touch-target w-full py-3.5 px-4 rounded-xl border border-dashed border-stone-700 hover:border-amber-400/60 bg-stone-900/60 text-stone-300 font-mono text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>{isCompressing ? 'COMPRESSING ON-DEVICE...' : 'CAPTURE SET PHOTO'}</span>
            </button>
          )}
        </div>

        {/* Due at Chair Total Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-700 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
              Balance Due Now
            </span>
            <span className="text-2xl font-mono font-extrabold text-stone-100">
              ${balanceDue}
            </span>
          </div>

          <div className="text-right text-[11px] font-mono text-stone-400">
            <div>Billed: ${finalBilled}</div>
            <div>Tip: +${tipAmount}</div>
          </div>
        </div>

        {/* Finalize Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleCompleteService}
            className="touch-target w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>COMPLETE &amp; ARCHIVE TO LOG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
