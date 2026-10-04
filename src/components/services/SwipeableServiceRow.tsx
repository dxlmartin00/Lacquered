import React, { useState, useRef } from 'react';
import { Trash2, Edit2, Check, Plus, Minus } from 'lucide-react';
import type { ServiceItem, SelectedServiceItem } from '../../types';
import { playTactileTick } from '../../utils/audio';

interface SwipeableServiceRowProps {
  service: ServiceItem;
  isSelected?: boolean;
  selectedItem?: SelectedServiceItem;
  onToggleSelect?: (service: ServiceItem) => void;
  onUpdateQuantity?: (serviceId: string, delta: number) => void;
  onEditPrice: (service: ServiceItem) => void;
  onRequestDelete: (service: ServiceItem) => void;
  isSelectionMode?: boolean;
}

export const SwipeableServiceRow: React.FC<SwipeableServiceRowProps> = ({
  service,
  isSelected = false,
  selectedItem,
  onToggleSelect,
  onUpdateQuantity,
  onEditPrice,
  onRequestDelete,
  isSelectionMode = true,
}) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);

  // Touch Handlers for horizontal swipe
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwiping) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startXRef.current;

    // Only allow swiping left to reveal delete (up to -80px)
    if (deltaX < 0) {
      const offset = Math.max(-80, deltaX);
      setSwipeOffset(offset);
      currentOffsetRef.current = offset;
    } else {
      setSwipeOffset(0);
      currentOffsetRef.current = 0;
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    // If swiped left more than 40px, snap open; otherwise snap closed
    if (currentOffsetRef.current < -40) {
      setSwipeOffset(-75);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleCardClick = () => {
    if (swipeOffset < -20) {
      // Close swipe
      setSwipeOffset(0);
      return;
    }
    if (isSelectionMode && onToggleSelect) {
      playTactileTick();
      onToggleSelect(service);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileTick();
    setSwipeOffset(0);
    onRequestDelete(service);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileTick();
    onEditPrice(service);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none group">
      {/* Background Revealed Delete Action */}
      <div className="absolute inset-y-0 right-0 w-20 bg-rose-500 rounded-r-2xl flex items-center justify-center">
        <button
          type="button"
          onClick={handleDeleteClick}
          className="w-full h-full flex flex-col items-center justify-center text-white active:scale-95 transition-transform"
          aria-label="Delete service"
        >
          <Trash2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-0.5">Delete</span>
        </button>
      </div>

      {/* Main Foreground Card */}
      <div
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative z-10 w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 border transition-colors cursor-pointer ${
          isSelected
            ? 'bg-pink-50/90 border-pink-400 shadow-sm'
            : 'bg-white border-pink-100/80 hover:border-pink-200'
        }`}
      >
        {/* Left Side: Select Checkmark & Service Name */}
        <div className="flex items-center space-x-3 min-w-0">
          {/* Check Circle Icon */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
              isSelected
                ? 'bg-pink-500 border-pink-500 text-white shadow-sm'
                : 'border-slate-300 text-transparent bg-slate-50/50'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>

          <div className="min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                isSelected ? 'text-pink-900 font-bold' : 'text-slate-800'
              }`}
            >
              {service.name}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span>{service.categoryLabel}</span>
              {service.perNail && (
                <span className="text-[10px] text-pink-500 font-mono bg-pink-50 px-1.5 py-0.2 rounded-full">
                  per nail
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Price, Steppers & Edit Button */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Steppers if selected and has quantity */}
          {isSelected && onUpdateQuantity && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 bg-white border border-pink-200 rounded-xl p-0.5 shadow-xs"
            >
              <button
                type="button"
                onClick={() => {
                  playTactileTick();
                  onUpdateQuantity(service.id, -1);
                }}
                className="w-7 h-7 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center tactile-btn"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="w-5 text-center font-mono tabular-nums text-xs font-bold text-pink-600">
                {selectedItem?.quantity || 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  playTactileTick();
                  onUpdateQuantity(service.id, 1);
                }}
                className="w-7 h-7 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center tactile-btn"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Price Badge */}
          <div className="text-right">
            <div className="font-mono tabular-nums font-bold text-sm text-slate-800">
              ₱{service.price}
            </div>
            {isSelected && selectedItem && selectedItem.quantity > 1 && (
              <div className="text-[10px] font-mono tabular-nums text-pink-600 font-semibold">
                = ₱{service.price * selectedItem.quantity}
              </div>
            )}
          </div>

          {/* Quick Edit Price Button */}
          <button
            type="button"
            onClick={handleEditClick}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-600 border border-slate-200/60 hover:border-pink-200 flex items-center justify-center tactile-btn"
            title="Edit Price"
            aria-label={`Edit price for ${service.name}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
