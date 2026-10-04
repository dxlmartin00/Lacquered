import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { ServiceItem } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface EditPriceModalProps {
  isOpen: boolean;
  service: ServiceItem | null;
  onClose: () => void;
  onSavePrice: (serviceId: string, newPrice: number) => void;
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({
  isOpen,
  service,
  onClose,
  onSavePrice,
}) => {
  const [priceInput, setPriceInput] = useState<string>('');

  useEffect(() => {
    if (service) {
      setPriceInput(service.price.toString());
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(priceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      const clamped = Math.max(0, Math.min(100000, Math.round(parsed)));
      playTactileTick();
      onSavePrice(service.id, clamped);
      onClose();
    }
  };

  const handleQuickAdjust = (delta: number) => {
    playTactileTick();
    const current = parseFloat(priceInput) || 0;
    setPriceInput(Math.max(0, current + delta).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 space-y-4 modal-spring-enter">
        <div className="flex items-center justify-between pb-2 border-b border-pink-50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-500 font-bold">
              {service.categoryLabel}
            </span>
            <h3 className="font-display text-base font-bold text-slate-800">
              Edit Price: {service.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center tactile-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Service Price (₱ PHP)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-mono font-bold text-lg text-pink-500">
                ₱
              </span>
              <input
                type="number"
                step="5"
                min="0"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                autoFocus
                className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl pl-10 pr-4 py-3 font-mono tabular-nums text-xl font-bold text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Quick price adjustment chips */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => handleQuickAdjust(-50)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-xs font-semibold tactile-chip"
            >
              -₱50
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdjust(50)}
              className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-mono text-xs font-semibold tactile-chip"
            >
              +₱50
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdjust(100)}
              className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-mono text-xs font-semibold tactile-chip"
            >
              +₱100
            </button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs tactile-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center justify-center space-x-1 shadow-md shadow-pink-200 tactile-btn"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Update Price</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
