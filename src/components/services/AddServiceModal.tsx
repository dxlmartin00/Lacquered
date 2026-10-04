import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { ServiceItem, ServiceCategory } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (newService: ServiceItem) => void;
}

const CATEGORIES: { key: ServiceCategory; label: string }[] = [
  { key: 'soft_gel', label: 'Soft Gel Services' },
  { key: 'hard_gel', label: 'Hard Gel Services' },
  { key: 'add_on', label: 'Add Ons Per Nail' },
];

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onAddService,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('250');
  const [category, setCategory] = useState<ServiceCategory>('soft_gel');
  const [perNail, setPerNail] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price) || 0;
    const catLabel = CATEGORIES.find((c) => c.key === category)?.label || 'Services';

    playTactileTick();
    onAddService({
      id: `srv-custom-${Date.now()}`,
      category,
      categoryLabel: catLabel,
      name: name.trim(),
      price: parsedPrice,
      perNail: category === 'add_on' ? perNail : false,
    });

    setName('');
    setPrice('250');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 space-y-4 modal-spring-enter">
        <div className="flex items-center justify-between pb-2 border-b border-pink-50">
          <h3 className="font-display text-base font-bold text-slate-800">
            Add New Service
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center tactile-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Category Picker */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Service Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setCategory(cat.key);
                    if (cat.key === 'add_on') setPerNail(true);
                    else setPerNail(false);
                  }}
                  className={`py-2 px-1 text-[11px] rounded-xl font-medium transition-all ${
                    category === cat.key
                      ? 'bg-pink-500 text-white font-semibold shadow-sm'
                      : 'bg-pink-50 text-slate-600 hover:bg-pink-100'
                  }`}
                >
                  {cat.label.replace(' Services', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Russian Manicure"
              className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Price (₱)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-mono font-bold text-pink-500">
                ₱
              </span>
              <input
                type="number"
                step="5"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl pl-9 pr-4 py-2.5 font-mono text-sm font-bold text-slate-800 focus:outline-none focus:border-pink-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Per Nail Checkbox for Add-ons */}
          {category === 'add_on' && (
            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={perNail}
                onChange={(e) => setPerNail(e.target.checked)}
                className="rounded text-pink-500 focus:ring-pink-400"
              />
              <span>Priced per nail (allows quantity selection)</span>
            </label>
          )}

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
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Save Service</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
