import React from 'react';
import { X } from 'lucide-react';
import { QuoteEngineView } from './QuoteEngineView';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeatClient?: (appointmentId: string) => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  onSeatClient,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-studio-surface border border-studio-elevated rounded-2xl p-4 sm:p-6 my-auto shadow-2xl max-h-[90dvh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="touch-target absolute top-4 right-4 p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 border border-stone-800 transition-colors z-20"
          aria-label="Close Quote Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <QuoteEngineView isModal onClose={onClose} onSeatClient={onSeatClient} />
      </div>
    </div>
  );
};
