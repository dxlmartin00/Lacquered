import React from 'react';
import { X } from 'lucide-react';
import { QuoteEngineView } from './QuoteEngineView';
import { playTactileTick } from '../../utils/audio';

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

  const handleClose = () => {
    playTactileTick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl hairline-card rounded-2xl p-4 sm:p-6 my-auto shadow-2xl max-h-[92dvh] overflow-y-auto modal-spring-enter">
        <button
          onClick={handleClose}
          type="button"
          className="touch-target absolute top-4 right-4 p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 border border-stone-800 tactile-btn z-20"
          aria-label="Close Quote Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <QuoteEngineView isModal onClose={onClose} onSeatClient={onSeatClient} />
      </div>
    </div>
  );
};
