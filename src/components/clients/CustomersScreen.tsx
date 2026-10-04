import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Armchair,
  Pencil,
  Trash2,
  Phone,
  Instagram,
  Sparkles,
  Users,
} from 'lucide-react';
import type { ClientRecord } from '../../types';
import { playTactileTick } from '../../utils/audio';
import { EditCustomerModal } from './EditCustomerModal';
import { DeleteCustomerModal } from './DeleteCustomerModal';

interface CustomersScreenProps {
  clients: ClientRecord[];
  onOpenAddCustomer: () => void;
  onSelectCustomerToBook: (client: ClientRecord) => void;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  clients,
  onOpenAddCustomer,
  onSelectCustomerToBook,
}) => {
  const [query, setQuery] = useState('');
  const [clientToEdit, setClientToEdit] = useState<ClientRecord | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientRecord | null>(null);

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.instagram && c.instagram.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-28 pt-2 px-1 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Customers
          </h2>
          <p className="text-xs text-slate-400">
            {clients.length} {clients.length === 1 ? 'registered client' : 'registered clients'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playTactileTick();
            onOpenAddCustomer();
          }}
          className="px-4 py-2 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-pink-200 tactile-btn"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers by name, phone, or notes..."
          className="w-full bg-white border border-pink-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-300 shadow-xs"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {clients.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/70 border border-dashed border-pink-200 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">No Customers Yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Add your first customer to save sizing profiles, preferences, and allergy details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playTactileTick();
                onOpenAddCustomer();
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-semibold shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add First Customer</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No customers match "{query}".
          </div>
        ) : (
          filtered.map((client) => {
            const hasPhone = Boolean(client.phone && client.phone.trim());
            const hasInstagram = Boolean(client.instagram && client.instagram.trim());
            const hasNotes = Boolean(client.notes && client.notes.trim());
            const hasShapeOrLength = Boolean(client.preferredShape || client.preferredLength);

            return (
              <div
                key={client.id}
                className="pastel-card p-4 rounded-2xl border border-pink-100 hover:border-pink-200 transition-all space-y-3 shadow-xs"
              >
                {/* Top Row: Name + HEMA Badge + Edit/Delete Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-display font-bold text-base text-slate-800 truncate">
                        {client.name}
                      </span>
                      {client.allergies?.hema && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 shrink-0">
                          HEMA Free
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Edit & Delete buttons */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      title="Edit Customer Info"
                      onClick={() => {
                        playTactileTick();
                        setClientToEdit(client);
                      }}
                      className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-600 flex items-center justify-center transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete Customer"
                      onClick={() => {
                        playTactileTick();
                        setClientToDelete(client);
                      }}
                      className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Section: Clean, non-wrapping contact & preference badges */}
                {(hasPhone || hasInstagram || hasShapeOrLength) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                    {hasPhone && (
                      <div className="flex items-center space-x-1.5 text-slate-600 font-medium whitespace-nowrap">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}

                    {hasInstagram && (
                      <div className="flex items-center space-x-1 text-pink-600 font-medium whitespace-nowrap">
                        <Instagram className="w-3 h-3 text-pink-400 shrink-0" />
                        <span>{client.instagram}</span>
                      </div>
                    )}

                    {hasShapeOrLength && (
                      <div className="flex items-center space-x-1 text-slate-400 text-[11px] whitespace-nowrap">
                        <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
                        <span>
                          {client.preferredShape || 'Almond'}
                          {client.preferredLength ? ` · ${client.preferredLength}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes (clean, subtle quote banner) */}
                {hasNotes && (
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-pink-50/50 rounded-xl px-2.5 py-1.5 border border-pink-100/60">
                    "{client.notes}"
                  </p>
                )}

                {/* Footer Action: Start Order */}
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      playTactileTick();
                      onSelectCustomerToBook(client);
                    }}
                    className="py-1.5 px-3.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold text-xs flex items-center space-x-1.5 tactile-btn transition-colors"
                  >
                    <Armchair className="w-3.5 h-3.5" />
                    <span>Start Order</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={Boolean(clientToEdit)}
        client={clientToEdit}
        onClose={() => setClientToEdit(null)}
      />

      {/* Delete Customer Confirmation Modal */}
      <DeleteCustomerModal
        isOpen={Boolean(clientToDelete)}
        client={clientToDelete}
        onClose={() => setClientToDelete(null)}
      />
    </div>
  );
};
