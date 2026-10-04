import React, { useState } from 'react';
import { Search, UserPlus, Armchair } from 'lucide-react';
import type { ClientRecord } from '../../types';
import { playTactileTick } from '../../utils/audio';

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

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
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
            {clients.length} registered clients
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
          placeholder="Search customers by name or phone..."
          className="w-full bg-white border border-pink-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-300 shadow-xs"
        />
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No customers match "{query}".
          </div>
        ) : (
          filtered.map((client) => (
            <div
              key={client.id}
              className="pastel-card p-4 rounded-2xl flex items-center justify-between gap-3 border border-pink-100 hover:border-pink-200"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-800 truncate">
                    {client.name}
                  </span>
                  {client.allergies?.hema && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-rose-100 text-rose-600">
                      HEMA Free
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  {client.phone && <span>{client.phone}</span>}
                  {client.notes && (
                    <>
                      <span>•</span>
                      <span className="truncate">{client.notes}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playTactileTick();
                  onSelectCustomerToBook(client);
                }}
                className="py-1.5 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold text-xs flex items-center space-x-1 tactile-btn shrink-0"
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>Start Order</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
