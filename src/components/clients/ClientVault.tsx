import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  ShieldAlert,
  ChevronRight,
  Armchair,
} from 'lucide-react';
import type { ClientRecord } from '../../types';
import { ClientDetailModal } from './ClientDetailModal';
import { NewClientModal } from './NewClientModal';
import { playTactileTick } from '../../utils/audio';

interface ClientVaultProps {
  clients: ClientRecord[];
  onSeatInChair?: (client: ClientRecord) => void;
}

export const ClientVault: React.FC<ClientVaultProps> = ({ clients, onSeatInChair }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  const filteredClients = clients.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.instagram && c.instagram.toLowerCase().includes(query)) ||
      c.preferredShape.toLowerCase().includes(query)
    );
  });

  const handleOpenClient = (id: string) => {
    playTactileTick();
    setSelectedClientId(id);
    setIsDetailOpen(true);
  };

  const handleOpenNew = () => {
    playTactileTick();
    setIsNewClientOpen(true);
  };

  const formatHandSizes = (hand: Record<string, number>) => {
    return [hand.thumb, hand.index, hand.middle, hand.ring, hand.pinky]
      .map((n) => (n === -1 ? '00' : n))
      .join(' · ');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pb-20 md:pb-6 select-none">
      {/* Header & New Client */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-800/60">
        <div>
          <h2 className="text-lg font-display font-bold uppercase tracking-wider text-stone-100">
            Client Vault
          </h2>
          <span className="text-xs font-mono tabular-nums text-stone-400">
            {clients.length} registered clients
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="touch-target px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-1.5 tactile-btn shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Client</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, shape, phone..."
          className="w-full bg-[#141210] border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-base md:text-xs font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-stone-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
        />
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <div className="text-center py-10 text-stone-500 font-mono text-xs">
            No clients match "{searchQuery}"
          </div>
        ) : (
          filteredClients.map((client) => {
            const hasAllergy = client.allergies.hema || client.allergies.acrylates;
            return (
              <div
                key={client.id}
                onClick={() => handleOpenClient(client.id)}
                className="hairline-card hover:border-stone-700 p-4 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 active:scale-[0.99]"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-stone-100 truncate">
                      {client.name}
                    </span>
                    {client.instagram && (
                      <span className="text-xs text-stone-500 font-mono hidden sm:inline">
                        {client.instagram}
                      </span>
                    )}
                    {hasAllergy && (
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center space-x-1">
                        <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
                        <span>HEMA</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-stone-400 truncate">
                    <span>{client.preferredShape} · {client.preferredLength}</span>
                    <span className="text-stone-600 mx-2">•</span>
                    <span className="text-stone-400 tabular-nums">L: {formatHandSizes(client.sizing.leftHand)}</span>
                    <span className="text-stone-600 mx-1">|</span>
                    <span className="text-stone-400 tabular-nums">R: {formatHandSizes(client.sizing.rightHand)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onSeatInChair && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileTick();
                        onSeatInChair(client);
                      }}
                      className="touch-target px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 flex items-center space-x-1 tactile-btn"
                    >
                      <Armchair className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Seat</span>
                    </button>
                  )}

                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ClientDetailModal
        clientId={selectedClientId}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSeatInChair={onSeatInChair}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onCreated={(id) => handleOpenClient(id)}
      />
    </div>
  );
};
