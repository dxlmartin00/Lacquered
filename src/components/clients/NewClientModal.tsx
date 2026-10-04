import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert, Check } from 'lucide-react';
import { db } from '../../db/schema';
import type { ClientRecord, NailShape, NailLength } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (clientId: string) => void;
}

const NAIL_SHAPES: NailShape[] = ['Square', 'Squoval', 'Almond', 'Coffin', 'Stiletto', 'Duck'];
const NAIL_LENGTHS: NailLength[] = ['Natural', 'Short', 'Medium', 'Long', 'XL'];

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [hema, setHema] = useState(false);
  const [acrylates, setAcrylates] = useState(false);
  const [acetone, setAcetone] = useState(false);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [preferredShape, setPreferredShape] = useState<NailShape>('Almond');
  const [preferredLength, setPreferredLength] = useState<NailLength>('Medium');
  const [notes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playTactileTick();

    setIsSubmitting(true);
    try {
      const newClient: ClientRecord = {
        id: `client-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim() || '+1 (555) 000-0000',
        instagram: instagram.trim() ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : undefined,
        allergies: {
          hema,
          acrylates,
          acetone,
          notes: allergyNotes.trim() || undefined,
        },
        sizing: {
          system: 'Gel-X',
          leftHand: { thumb: 1, index: 5, middle: 4, ring: 5, pinky: 8 },
          rightHand: { thumb: 1, index: 5, middle: 4, ring: 5, pinky: 8 },
        },
        preferredShape,
        preferredLength,
        notes: notes.trim() || undefined,
        createdAt: Date.now(),
      };

      await db.clients.add(newClient);
      if (onCreated) onCreated(newClient.id);
      onClose();
    } catch (err) {
      console.error('Failed to create client:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHema = () => {
    playTactileTick();
    setHema(!hema);
  };

  const toggleAcrylates = () => {
    playTactileTick();
    setAcrylates(!acrylates);
  };

  const toggleAcetone = () => {
    playTactileTick();
    setAcetone(!acetone);
  };

  const selectShape = (s: NailShape) => {
    playTactileTick();
    setPreferredShape(s);
  };

  const selectLength = (l: NailLength) => {
    playTactileTick();
    setPreferredLength(l);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-lg hairline-card rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 my-auto max-h-[92dvh] overflow-y-auto modal-spring-enter">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-stone-100">
              New Client Profile &amp; Sizing Vault
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
          {/* Basic Details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-stone-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (415) 000-0000"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-stone-700"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@handle"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Medical & Chemical Allergy Toggles (Crimson alert design) */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">
                Medical &amp; Chemical Sensitivities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={toggleHema}
                className={`min-h-touch p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between tactile-chip ${
                  hema
                    ? 'bg-rose-950 border-rose-600 text-rose-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
                }`}
              >
                <span>HEMA</span>
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${hema ? 'bg-rose-500 text-white' : 'border border-stone-700'}`}>
                  {hema && <Check className="w-3 h-3 stroke-[2.5]" />}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleAcrylates}
                className={`min-h-touch p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between tactile-chip ${
                  acrylates
                    ? 'bg-rose-950 border-rose-600 text-rose-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
                }`}
              >
                <span>Acrylates</span>
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${acrylates ? 'bg-rose-500 text-white' : 'border border-stone-700'}`}>
                  {acrylates && <Check className="w-3 h-3 stroke-[2.5]" />}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleAcetone}
                className={`min-h-touch p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between tactile-chip ${
                  acetone
                    ? 'bg-amber-950 border-amber-600 text-amber-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
                }`}
              >
                <span>Acetone</span>
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${acetone ? 'bg-amber-500 text-stone-950 font-extrabold' : 'border border-stone-700'}`}>
                  {acetone && <Check className="w-3 h-3 stroke-[2.5]" />}
                </span>
              </button>
            </div>

            {(hema || acrylates || acetone) && (
              <input
                type="text"
                value={allergyNotes}
                onChange={(e) => setAllergyNotes(e.target.value)}
                placeholder="Specific reactions, safe alternative products..."
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-stone-700"
              />
            )}
          </div>

          {/* Aesthetic Shape & Length Chips */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Preferred Shape
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {NAIL_SHAPES.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => selectShape(shape)}
                    className={`min-h-[40px] px-2 py-1 text-xs font-mono rounded-lg border tactile-chip ${
                      preferredShape === shape
                        ? 'bg-stone-100 text-stone-950 font-bold border-white'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Preferred Length
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {NAIL_LENGTHS.map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => selectLength(len)}
                    className={`min-h-[40px] px-2 py-1 text-xs font-mono rounded-lg border tactile-chip ${
                      preferredLength === len
                        ? 'bg-amber-400 text-stone-950 font-bold border-amber-300'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="touch-target w-full py-3.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center justify-center space-x-2 shadow-lg tactile-btn disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>SAVE CLIENT TO LOCAL VAULT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
