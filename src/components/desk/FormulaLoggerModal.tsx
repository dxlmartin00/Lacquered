import React, { useState } from 'react';
import { X, Save, Tag, Plus, Trash2 } from 'lucide-react';
import type { ServiceFormula } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface FormulaLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFormula?: ServiceFormula;
  onSave: (formula: ServiceFormula) => void;
}

const COMMON_BASE_BRANDS = [
  'Apres Gel-X',
  'Light Elegance (HEMA-Free)',
  'Kokoist Platinum Bond Duo',
  'Bio Sculpture Gel',
  'The GelBottle Inc (BIAB)',
  'Young Nails Synergy Gel',
  'DND Daisy Gel',
];

const COMMON_TOP_COATS: ('Glossy' | 'Matte' | 'Chrome Gel')[] = ['Glossy', 'Matte', 'Chrome Gel'];

export const FormulaLoggerModal: React.FC<FormulaLoggerModalProps> = ({
  isOpen,
  onClose,
  initialFormula,
  onSave,
}) => {
  const [baseBrand, setBaseBrand] = useState<string>(
    initialFormula?.baseBrand || 'Light Elegance (HEMA-Free)'
  );
  const [shadeCodes, setShadeCodes] = useState<string[]>(
    initialFormula?.shadeCodes && initialFormula.shadeCodes.length > 0
      ? initialFormula.shadeCodes
      : ['']
  );
  const [topCoat, setTopCoat] = useState<'Glossy' | 'Matte' | 'Chrome Gel'>(
    initialFormula?.topCoat || 'Glossy'
  );
  const [details, setDetails] = useState<string>(initialFormula?.details || '');

  if (!isOpen) return null;

  const handleAddShade = () => {
    playTactileTick();
    setShadeCodes([...shadeCodes, '']);
  };

  const handleShadeChange = (index: number, val: string) => {
    const updated = [...shadeCodes];
    updated[index] = val;
    setShadeCodes(updated);
  };

  const handleRemoveShade = (index: number) => {
    playTactileTick();
    setShadeCodes(shadeCodes.filter((_, i) => i !== index));
  };

  const handleSelectBrand = (brand: string) => {
    playTactileTick();
    setBaseBrand(brand);
  };

  const handleSelectTopCoat = (coat: 'Glossy' | 'Matte' | 'Chrome Gel') => {
    playTactileTick();
    setTopCoat(coat);
  };

  const handleSave = () => {
    playTactileTick();
    onSave({
      baseBrand,
      shadeCodes: shadeCodes.filter((s) => s.trim().length > 0),
      topCoat,
      details,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-lg hairline-card rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 my-auto max-h-[92dvh] overflow-y-auto modal-spring-enter">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-stone-100">
              Live Gel Formula Logger
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

        {/* Base Brand Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
            Base / Builder Brand
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_BASE_BRANDS.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleSelectBrand(brand)}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-mono border tactile-chip ${
                  baseBrand === brand
                    ? 'bg-amber-400/20 border-amber-400/80 text-amber-200 font-semibold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={baseBrand}
            onChange={(e) => setBaseBrand(e.target.value)}
            placeholder="Or custom brand..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-stone-700"
          />
        </div>

        {/* Shade Codes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Shade &amp; Pigment Codes
            </label>
            <button
              type="button"
              onClick={handleAddShade}
              className="touch-target px-2 py-1 text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1 tactile-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Code</span>
            </button>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {shadeCodes.map((code, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => handleShadeChange(idx, e.target.value)}
                  placeholder="e.g. Kokoist E-148 Black Cherry or Chrome #04"
                  className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-stone-700"
                />
                {shadeCodes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveShade(idx)}
                    className="touch-target p-2 text-stone-500 hover:text-rose-400 tactile-btn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Coat */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
            Top Finish
          </label>
          <div className="grid grid-cols-3 gap-2">
            {COMMON_TOP_COATS.map((coat) => (
              <button
                key={coat}
                type="button"
                onClick={() => handleSelectTopCoat(coat)}
                className={`min-h-touch px-3 py-2 rounded-xl text-xs font-mono font-medium border tactile-chip ${
                  topCoat === coat
                    ? 'bg-stone-100 border-white text-stone-950 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {coat}
              </button>
            ))}
          </div>
        </div>

        {/* Application details */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
            Cure &amp; Layer Notes
          </label>
          <textarea
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g., 2 thin coats, flash cured 30s each, non-wipe top coat full 60s cure."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-100 focus:outline-none focus:border-stone-700 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="touch-target w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-sm font-bold flex items-center justify-center space-x-2 shadow-lg tactile-btn"
          >
            <Save className="w-4 h-4" />
            <span>SAVE TO SERVICE LOG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
