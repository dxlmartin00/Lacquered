import React from 'react';
import { Trash2 } from 'lucide-react';
import type { ServiceItem } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface DeleteServiceModalProps {
  isOpen: boolean;
  service: ServiceItem | null;
  onClose: () => void;
  onConfirm: (serviceId: string) => void;
}

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  isOpen,
  service,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !service) return null;

  const handleConfirm = () => {
    playTactileTick();
    onConfirm(service.id);
    onClose();
  };

  const handleCancel = () => {
    playTactileTick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 space-y-4 modal-spring-enter text-center">
        {/* Cute Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
          <Trash2 className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-bold text-slate-800">
            Delete Service?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to remove <span className="font-semibold text-slate-700">"{service.name}"</span> (₱{service.price}) from your service price list?
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs tactile-btn"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-200 tactile-btn"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
