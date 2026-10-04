import React, { useState } from 'react';
import { Plus, Sparkles, Search } from 'lucide-react';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import type { ServiceItem, ServiceCategory } from '../../types';
import { SwipeableServiceRow } from './SwipeableServiceRow';
import { DeleteServiceModal } from './DeleteServiceModal';
import { EditPriceModal } from './EditPriceModal';
import { AddServiceModal } from './AddServiceModal';
import { playTactileTick } from '../../utils/audio';

export const ServicesScreen: React.FC = () => {
  const services = useLiveQuery(() => db.services.toArray()) || [];
  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const filtered = services.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleConfirmDelete = async (id: string) => {
    try {
      await db.services.delete(id);
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const handleSavePrice = async (id: string, newPrice: number) => {
    try {
      await db.services.update(id, { price: newPrice });
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };

  const handleAddService = async (item: ServiceItem) => {
    try {
      await db.services.add(item);
    } catch (err) {
      console.error('Failed to add service:', err);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-28 pt-2 px-1 select-none">
      {/* Top Banner / Price List Header matching Image 2 */}
      <div className="text-center space-y-1 py-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100/70 text-pink-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Laquered Studio Menu</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-800">
          Services &amp; Price List
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Swipe left on any service to delete. Tap the price or edit icon to change rates.
        </p>
      </div>

      {/* Search & Add New Service */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services (e.g. Gel Polish, Chrome)..."
            className="w-full bg-white border border-pink-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-300 shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            playTactileTick();
            setIsAddServiceOpen(true);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-pink-200 tactile-btn shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add</span>
        </button>
      </div>

      {/* Pill Category Switcher (Image 1 style) */}
      <div className="flex items-center space-x-1.5 p-1 bg-white rounded-2xl border border-pink-100 shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            playTactileTick();
            setActiveCategory('all');
          }}
          className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          All ({services.length})
        </button>
        <button
          type="button"
          onClick={() => {
            playTactileTick();
            setActiveCategory('soft_gel');
          }}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'soft_gel'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Soft Gel
        </button>
        <button
          type="button"
          onClick={() => {
            playTactileTick();
            setActiveCategory('hard_gel');
          }}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'hard_gel'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Hard Gel
        </button>
        <button
          type="button"
          onClick={() => {
            playTactileTick();
            setActiveCategory('add_on');
          }}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'add_on'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Add Ons
        </button>
      </div>

      {/* Services List with Swipe to Delete and Edit Price */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No services found. Tap "+ Add" to create one.
          </div>
        ) : (
          filtered.map((service) => (
            <SwipeableServiceRow
              key={service.id}
              service={service}
              isSelectionMode={false}
              onEditPrice={(srv) => setServiceToEdit(srv)}
              onRequestDelete={(srv) => setServiceToDelete(srv)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <DeleteServiceModal
        isOpen={Boolean(serviceToDelete)}
        service={serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <EditPriceModal
        isOpen={Boolean(serviceToEdit)}
        service={serviceToEdit}
        onClose={() => setServiceToEdit(null)}
        onSavePrice={handleSavePrice}
      />

      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onAddService={handleAddService}
      />
    </div>
  );
};
