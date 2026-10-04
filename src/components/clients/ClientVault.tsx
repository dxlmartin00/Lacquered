import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  ShieldAlert,
  ChevronRight,
  Armchair,
} from 'lucide-react';
import type { ClientRecord } from '../../types';
import { ClientDetailModal } from './ClientDetailModal';
import { NewClientModal } from './NewClientModal';

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
    setSelectedClientId(id);
    setIsDetailOpen(true);
  };

  const formatHandSizes = (hand: Record<string, number>) => {
    return [hand.thumb, hand.index, hand.middle, hand.ring, hand.pinky]
      .map((n) => (n === -1 ? '00' : n))
      .join(' · ');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-20 md:pb-6 select-none">
      {/* Vault Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-studio-surface border border-studio-elevated rounded-3xl p-5 md:p-6 shadow-md">
        <div>
          <div className="flex items-center space-x-2.5">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-display font-bold uppercase tracking-wider text-stone-100">
              Client &amp; Sizing Vault
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Offline IndexedDB client roster with verified 10-finger tip profiles
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewClientOpen(true)}
          className="touch-target px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>NEW CLIENT PROFILE</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone, instagram, or shape..."
          className="w-full bg-studio-surface border border-studio-elevated rounded-2xl pl-11 pr-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-stone-600 shadow-sm"
        />
      </div>

      {/* Client Cards Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-12 text-stone-500 font-mono text-xs space-y-2">
            <Users className="w-8 h-8 text-stone-700 mx-auto" />
            <p>No clients found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const hasAllergy = client.allergies.hema || client.allergies.acrylates;
            return (
              <div
                key={client.id}
                onClick={() => handleOpenClient(client.id)}
                className="bg-studio-surface border border-studio-elevated hover:border-stone-700 p-5 rounded-2xl space-y-4 cursor-pointer transition-all active:scale-[0.99] shadow-sm flex flex-col justify-between"
              >
                {/* Header: Name & Allergy Flag */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-base text-stone-100">{client.name}</h3>
                      {client.instagram && (
                        <span className="text-xs text-stone-500 font-mono">{client.instagram}</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400 font-mono mt-0.5">{client.phone}</div>
                  </div>

                  {hasAllergy && (
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 flex items-center space-x-1 shrink-0">
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      <span>HEMA / ACRYLATE</span>
                    </span>
                  )}
                </div>

                {/* Sizing Readout Preview */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span className="text-amber-400 font-semibold">{client.sizing.system} Sizes</span>
                    <span className="text-stone-500">{client.preferredShape} · {client.preferredLength}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="text-stone-300">
                      <span className="text-stone-500">L: </span>
                      {formatHandSizes(client.sizing.leftHand)}
                    </div>
                    <div className="text-stone-300">
                      <span className="text-stone-500">R: </span>
                      {formatHandSizes(client.sizing.rightHand)}
                    </div>
                  </div>
                </div>

                {/* Footer Action Chips */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-900">
                  <span className="text-xs font-mono text-amber-400 flex items-center space-x-1 hover:text-amber-300">
                    <span>Inspect 10-Finger Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  {onSeatInChair && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeatInChair(client);
                      }}
                      className="touch-target px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 flex items-center space-x-1"
                    >
                      <Armchair className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Seat</span>
                    </button>
                  )}
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
