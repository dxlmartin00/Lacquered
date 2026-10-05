import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Instagram, Sparkles, ShieldAlert, Check } from 'lucide-react';
import type { ClientRecord, NailShape, NailLength } from '../../types';
import { db } from '../../db/schema';
import { playTactileTick, playChimeSuccess } from '../../utils/audio';

interface EditCustomerModalProps {
  isOpen: boolean;
  client: ClientRecord | null;
  onClose: () => void;
  onSave?: (updatedClient: ClientRecord) => void;
}

const NAIL_SHAPES: NailShape[] = ['Square', 'Squoval', 'Almond', 'Coffin', 'Stiletto', 'Duck'];
const NAIL_LENGTHS: NailLength[] = ['Natural', 'Short', 'Medium', 'Long', 'XL'];

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  client,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [shape, setShape] = useState<NailShape>('Almond');
  const [length, setLength] = useState<NailLength>('Medium');
  const [hemaFree, setHemaFree] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setPhone(client.phone || '');
      setInstagram(client.instagram || '');
      setShape(client.preferredShape || 'Almond');
      setLength(client.preferredLength || 'Medium');
      setHemaFree(Boolean(client.allergies?.hema));
      setNotes(client.notes || '');
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    playTactileTick();

    try {
      const updates: Partial<ClientRecord> = {
        name: name.trim().slice(0, 60),
        phone: phone.trim().slice(0, 25),
        instagram: instagram.trim().slice(0, 40),
        preferredShape: shape,
        preferredLength: length,
        allergies: {
          ...client.allergies,
          hema: hemaFree,
        },
        notes: notes.trim().slice(0, 250),
      };

      await db.clients.update(client.id, updates);

      // Also update clientName on any scheduled or in_chair appointments if name changed
      if (name.trim() !== client.name) {
        await db.appointments
          .where('clientId')
          .equals(client.id)
          .modify({ clientName: name.trim() });
      }

      playChimeSuccess();
      if (onSave) {
        onSave({ ...client, ...updates });
      }
      onClose();
    } catch (err) {
      console.error('Failed to update customer:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playTactileTick();
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm select-none overflow-y-auto"
    >
      <div className="relative w-full max-w-lg my-auto bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-pink-100 modal-spring-enter max-h-[90dvh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pink-100/70 text-pink-600 flex items-center justify-center">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-800">
                Edit Customer Info
              </h3>
              <p className="text-[11px] text-slate-400">
                Update client profile, preferences & allergy notes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playTactileTick();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Customer Name *</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {name.length}/60
              </span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Contact Details (Phone & Instagram) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                maxLength={25}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +63 917 123 4567"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Instagram className="w-3 h-3 text-slate-400" />
                <span>Instagram</span>
              </label>
              <input
                type="text"
                maxLength={40}
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@handle"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Preferred Nail Shape */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-pink-500" />
              <span>Preferred Nail Shape</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NAIL_SHAPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setShape(s);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    shape === s
                      ? 'bg-pink-500 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Length */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Preferred Length
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NAIL_LENGTHS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setLength(l);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    length === l
                      ? 'bg-pink-500 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* HEMA Free Toggle */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-800 block">
                  HEMA / Acrylates Sensitive
                </span>
                <span className="text-[10px] text-rose-600 block">
                  Flag client for HEMA-free bases & low heat cure
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playTactileTick();
                setHemaFree(!hemaFree);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                hemaFree ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                  hemaFree ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {hemaFree && <Check className="w-3 h-3 text-rose-500 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Studio Notes & Cuticle Preferences</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {notes.length}/250
              </span>
            </label>
            <textarea
              maxLength={250}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cuticles are delicate, prefers dry prep, loves sheer nude art..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all shadow-xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-pink-100">
            <button
              type="button"
              onClick={() => {
                playTactileTick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSaving}
              className="px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-pink-200 tactile-btn transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

