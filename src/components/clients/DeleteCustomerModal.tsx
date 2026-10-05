import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X } from 'lucide-react';
import type { ClientRecord } from '../../types';
import { db } from '../../db/schema';
import { playTactileTick, playChimeSuccess } from '../../utils/audio';

interface DeleteCustomerModalProps {
  isOpen: boolean;
  client: ClientRecord | null;
  onClose: () => void;
  onDeleted?: (clientId: string) => void;
}

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
  isOpen,
  client,
  onClose,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !client || typeof document === 'undefined') return null;


  const handleDelete = async () => {
    setIsDeleting(true);
    playTactileTick();

    try {
      // 1. Delete client record
      await db.clients.delete(client.id);

      // 2. Cascade delete or clean up appointments for this client if needed
      await db.appointments.where('clientId').equals(client.id).delete();

      playChimeSuccess();
      if (onDeleted) {
        onDeleted(client.id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete customer:', err);
    } finally {
      setIsDeleting(false);
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
      <div className="relative w-full max-w-sm my-auto bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-pink-100 modal-spring-enter text-center max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playTactileTick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <Trash2 className="w-7 h-7 stroke-[2]" />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-bold text-slate-800">
            Delete Customer?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            Are you sure you want to remove{' '}
            <strong className="text-slate-800 font-semibold">{client.name}</strong>{' '}
            from your studio roster? This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <button
            type="button"
            onClick={() => {
              playTactileTick();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex-1 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-rose-200 tactile-btn transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

