import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  ShoppingBag,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import type { ServiceItem, SelectedServiceItem, ClientRecord } from '../../types';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { SwipeableServiceRow } from '../services/SwipeableServiceRow';
import { DeleteServiceModal } from '../services/DeleteServiceModal';
import { EditPriceModal } from '../services/EditPriceModal';
import { AddServiceModal } from '../services/AddServiceModal';
import { playTactileTick, playChimeSuccess } from '../../utils/audio';

interface AddCustomerFlowModalProps {
  isOpen: boolean;
  initialClient?: ClientRecord;
  onClose: () => void;
  onCustomerSeated?: (appointmentId: string) => void;
  onComplete?: (appointmentId: string) => void;
}

export const AddCustomerFlowModal: React.FC<AddCustomerFlowModalProps> = ({
  isOpen,
  initialClient,
  onClose,
  onCustomerSeated,
  onComplete,
}) => {
  // Step State: 1 = Name & Info, 2 = Service Selection
  const [step, setStep] = useState<1 | 2>(1);

  // Customer Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  useEffect(() => {
    if (initialClient) {
      setCustomerName(initialClient.name || '');
      setCustomerPhone(initialClient.phone || '');
      setCustomerNotes(initialClient.notes || '');
      setStep(2); // Jump straight to service selection if client is already known
    }
  }, [initialClient]);

  // Service Selection State
  const services = useLiveQuery(() => db.services.toArray()) || [];
  const [selectedItems, setSelectedItems] = useState<SelectedServiceItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'soft_gel' | 'hard_gel' | 'add_on'>('all');

  // Modals for editing/deleting services on the fly
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  // Toggle service selection
  const handleToggleService = (service: ServiceItem) => {
    const existingIndex = selectedItems.findIndex((item) => item.serviceId === service.id);
    if (existingIndex >= 0) {
      // Remove from selected
      setSelectedItems(selectedItems.filter((_, idx) => idx !== existingIndex));
    } else {
      // Add with quantity 1 (or 10 if perNail default)
      const defaultQty = service.perNail ? 10 : 1;
      setSelectedItems([
        ...selectedItems,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          quantity: defaultQty,
          perNail: service.perNail,
        },
      ]);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.serviceId === serviceId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate live total price
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Filtered services
  const filteredServices = services.filter((s) => {
    if (activeCategoryFilter === 'all') return true;
    return s.category === activeCategoryFilter;
  });

  // Proceed from Step 1 to Step 2
  const handleProceedToServices = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    playTactileTick();
    setStep(2);
  };

  // Finalize order & seat customer
  const handleFinalizeOrder = async () => {
    if (!customerName.trim()) return;
    playChimeSuccess();

    try {
      const clientId = initialClient ? initialClient.id : `client-${Date.now()}`;
      // 1. Add customer to database if new
      if (!initialClient) {
        await db.clients.add({
          id: clientId,
          name: customerName.trim(),
          phone: customerPhone.trim() || 'N/A',
          allergies: { hema: false, acrylates: false, acetone: false },
          sizing: {
            system: 'Gel-X',
            leftHand: { thumb: 0, index: 4, middle: 3, ring: 4, pinky: 7 },
            rightHand: { thumb: 0, index: 4, middle: 3, ring: 4, pinky: 7 },
          },
          preferredShape: 'Almond',
          preferredLength: 'Medium',
          notes: customerNotes.trim() || undefined,
          createdAt: Date.now(),
        });
      }

      // 2. Add appointment record
      const appointmentId = `apt-${Date.now()}`;
      await db.appointments.add({
        id: appointmentId,
        clientId,
        clientName: customerName.trim(),
        clientPhone: customerPhone.trim() || undefined,
        scheduledTime: Date.now(),
        status: 'in_chair',
        baseService: selectedItems[0]?.name || 'Nail Service',
        artTier: 1,
        quotedPrice: totalPrice,
        durationMinutes: 60,
        depositPaid: 0,
        selectedServices: selectedItems,
        totalPrice,
        notes: customerNotes.trim() || undefined,
        createdAt: Date.now(),
      });

      // Reset and close
      if (onComplete) onComplete(appointmentId);
      if (onCustomerSeated) onCustomerSeated(appointmentId);
      handleClose();
    } catch (err) {
      console.error('Failed to create customer order:', err);
    }
  };

  const handleClose = () => {
    playTactileTick();
    setStep(1);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNotes('');
    setSelectedItems([]);
    onClose();
  };

  // Delete service action
  const handleConfirmDeleteService = async (serviceId: string) => {
    try {
      await db.services.delete(serviceId);
      // Also remove from selected items if selected
      setSelectedItems((prev) => prev.filter((item) => item.serviceId !== serviceId));
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  // Update service price action
  const handleSaveServicePrice = async (serviceId: string, newPrice: number) => {
    try {
      await db.services.update(serviceId, { price: newPrice });
      // Update price in active selected items
      setSelectedItems((prev) =>
        prev.map((item) => (item.serviceId === serviceId ? { ...item, price: newPrice } : item))
      );
    } catch (err) {
      console.error('Failed to update service price:', err);
    }
  };

  // Add custom service action
  const handleAddNewService = async (newService: ServiceItem) => {
    try {
      await db.services.add(newService);
    } catch (err) {
      console.error('Failed to add service:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-sm select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-100 space-y-4 my-auto max-h-[92dvh] flex flex-col modal-spring-enter">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-50 shrink-0">
          <div className="flex items-center space-x-2.5">
            {step === 2 && (
              <button
                type="button"
                onClick={() => {
                  playTactileTick();
                  setStep(1);
                }}
                className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center tactile-btn"
                aria-label="Back to customer details"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-pink-500 font-bold">
                {step === 1 ? 'Step 1 of 2: Customer Details' : 'Step 2 of 2: Select Services'}
              </span>
              <h3 className="font-display text-lg font-bold text-slate-800">
                {step === 1 ? 'Add New Customer' : `Services for ${customerName}`}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center tactile-btn"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: ENTER CUSTOMER NAME & DETAILS */}
        {step === 1 && (
          <form onSubmit={handleProceedToServices} className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-3xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto text-pink-500 shadow-inner">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Millie Chen"
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-2xl px-4 py-3 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+63 917 000 0000"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Special Notes / Shape (Optional)
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Medium Almond, sensitive cuticles"
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!customerName.trim()}
                className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-pink-200 tactile-btn disabled:opacity-50"
              >
                <span>Proceed to Select Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: SELECT SERVICES (Image 2 Price List) */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Pill Category Switcher (Matching Image 1 Morning/Night style) */}
            <div className="flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center space-x-1.5 p-1 bg-pink-50/80 rounded-2xl border border-pink-100 overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setActiveCategoryFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategoryFilter === 'all'
                      ? 'bg-white text-pink-600 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  All ({services.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setActiveCategoryFilter('soft_gel');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategoryFilter === 'soft_gel'
                      ? 'bg-white text-pink-600 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Soft Gel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setActiveCategoryFilter('hard_gel');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategoryFilter === 'hard_gel'
                      ? 'bg-white text-pink-600 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Hard Gel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setActiveCategoryFilter('add_on');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategoryFilter === 'add_on'
                      ? 'bg-white text-pink-600 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Add Ons
                </button>
              </div>

              {/* Add New Custom Service button */}
              <button
                type="button"
                onClick={() => {
                  playTactileTick();
                  setIsAddServiceOpen(true);
                }}
                className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center tactile-btn shrink-0"
                title="Add New Service to Menu"
                aria-label="Add New Service"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Hint message */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1 shrink-0">
              <span>Tap a service to add. Swipe left to delete.</span>
              <span>{selectedItems.length} selected</span>
            </div>

            {/* Scrollable Service List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
              {filteredServices.map((service) => {
                const isSelected = selectedItems.some((item) => item.serviceId === service.id);
                const selectedItem = selectedItems.find((item) => item.serviceId === service.id);

                return (
                  <SwipeableServiceRow
                    key={service.id}
                    service={service}
                    isSelected={isSelected}
                    selectedItem={selectedItem}
                    onToggleSelect={handleToggleService}
                    onUpdateQuantity={handleUpdateQuantity}
                    onEditPrice={(srv) => setServiceToEdit(srv)}
                    onRequestDelete={(srv) => setServiceToDelete(srv)}
                  />
                );
              })}
            </div>

            {/* Sticky Bottom Order Summary & Total Price */}
            <div className="pt-3 border-t border-pink-100 shrink-0 space-y-2.5">
              <div className="flex items-center justify-between bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200/80">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wider block">
                      Total Quoted
                    </span>
                    <span className="text-xs text-slate-500">
                      {selectedItems.length} {selectedItems.length === 1 ? 'service' : 'services'} chosen
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono tabular-nums text-2xl font-black text-slate-800">
                    ₱{totalPrice}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinalizeOrder}
                className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-pink-200 tactile-btn"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Confirm &amp; Seat {customerName}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modals for service deletion, editing price, and adding custom service */}
        <DeleteServiceModal
          isOpen={Boolean(serviceToDelete)}
          service={serviceToDelete}
          onClose={() => setServiceToDelete(null)}
          onConfirm={handleConfirmDeleteService}
        />

        <EditPriceModal
          isOpen={Boolean(serviceToEdit)}
          service={serviceToEdit}
          onClose={() => setServiceToEdit(null)}
          onSavePrice={handleSaveServicePrice}
        />

        <AddServiceModal
          isOpen={isAddServiceOpen}
          onClose={() => setIsAddServiceOpen(false)}
          onAddService={handleAddNewService}
        />
      </div>
    </div>
  );
};
