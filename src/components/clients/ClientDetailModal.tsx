import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Phone,
  Instagram,
  Trash2,
} from 'lucide-react';
import type { ClientRecord, SizingProfile } from '../../types';
import { FingerSizingMap } from './FingerSizingMap';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { playTactileTick } from '../../utils/audio';

interface ClientDetailModalProps {
  clientId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSeatInChair?: (client: ClientRecord) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  clientId,
  isOpen,
  onClose,
  onSeatInChair,
}) => {
  const client = useLiveQuery(
    () => (clientId ? db.clients.get(clientId) : undefined),
    [clientId]
  );

  const pastLogs = useLiveQuery(
    () => (clientId ? db.serviceLogs.where('clientId').equals(clientId).reverse().sortBy('timestamp') : []),
    [clientId]
  ) || [];

  const [activeTab, setActiveTab] = useState<'sizing' | 'history'>('sizing');

  if (!isOpen || !client) return null;

  const hasAllergy = client.allergies.hema || client.allergies.acrylates;

  const handleUpdateSizing = async (updatedSizing: SizingProfile) => {
    try {
      await db.clients.update(client.id, { sizing: updatedSizing });
    } catch (err) {
      console.error('Failed to update client sizing profile:', err);
    }
  };

  const handleDeleteClient = async () => {
    playTactileTick();
    if (window.confirm(`Delete client record for ${client.name}?`)) {
      try {
        await db.clients.delete(client.id);
        onClose();
      } catch (err) {
        console.error('Failed to delete client:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl hairline-card rounded-3xl p-5 md:p-7 shadow-2xl space-y-6 my-auto max-h-[92dvh] overflow-y-auto modal-spring-enter">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-800/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-stone-100">
                {client.name}
              </h2>
              {hasAllergy && (
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                  HEMA / Acrylates Sensitive
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-400">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>{client.phone}</span>
              </span>
              {client.instagram && (
                <span className="flex items-center space-x-1 text-stone-300">
                  <Instagram className="w-3.5 h-3.5 text-stone-500" />
                  <span>{client.instagram}</span>
                </span>
              )}
              <span className="text-stone-600">•</span>
              <span className="text-stone-400">
                {client.preferredShape} · {client.preferredLength}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onSeatInChair && (
              <button
                type="button"
                onClick={() => {
                  playTactileTick();
                  onSeatInChair(client);
                }}
                className="touch-target px-4 py-2 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold transition-all shadow-md tactile-btn"
              >
                Seat In Chair
              </button>
            )}

            <button
              onClick={() => {
                playTactileTick();
                onClose();
              }}
              className="touch-target p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Allergy Warning if present */}
        {hasAllergy && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono space-y-1">
            <div className="font-bold uppercase tracking-wider flex items-center space-x-1.5 text-rose-300">
              <ShieldAlert className="w-4 h-4" />
              <span>Medical Safety Notes</span>
            </div>
            <p className="text-rose-200/90 leading-relaxed">
              {client.allergies.notes || 'Strict chemical precautions required. Use verified HEMA-free bases only.'}
            </p>
          </div>
        )}

        {/* Navigation Tabs (Sizing Map vs Service History) */}
        <div className="flex items-center space-x-2 border-b border-stone-800/80 pb-2">
          <button
            type="button"
            onClick={() => {
              playTactileTick();
              setActiveTab('sizing');
            }}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all tactile-chip ${
              activeTab === 'sizing'
                ? 'bg-stone-800 text-stone-100 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            10-Finger Sizing Vault
          </button>
          <button
            type="button"
            onClick={() => {
              playTactileTick();
              setActiveTab('history');
            }}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all tactile-chip ${
              activeTab === 'history'
                ? 'bg-stone-800 text-stone-100 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Service History ({pastLogs.length})
          </button>
        </div>

        {/* Tab 1: Sizing Map */}
        {activeTab === 'sizing' && (
          <div className="space-y-4">
            <FingerSizingMap
              clientId={client.id}
              sizing={client.sizing}
              onUpdate={handleUpdateSizing}
            />
          </div>
        )}

        {/* Tab 2: Service History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {pastLogs.length === 0 ? (
              <div className="text-center py-10 text-stone-500 font-mono text-xs">
                No past service logs recorded for this client yet.
              </div>
            ) : (
              pastLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200">{log.baseService}</span>
                    <span className="text-stone-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-stone-400 space-y-1">
                    <div>
                      <span className="text-stone-500">Base: </span>
                      <span className="text-stone-300">{log.formula.baseBrand}</span>
                    </div>
                    {log.formula.shadeCodes.length > 0 && (
                      <div>
                        <span className="text-stone-500">Shades: </span>
                        <span className="text-amber-300">{log.formula.shadeCodes.join(', ')}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-stone-500">Top Finish: </span>
                      <span className="text-stone-300">{log.formula.topCoat}</span>
                    </div>
                    {log.formula.details && (
                      <p className="text-[11px] text-stone-500 italic mt-1">
                        "{log.formula.details}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-900 flex items-center justify-between text-stone-400">
                    <span className="tabular-nums">Billed: ${log.finalBilled}</span>
                    <span className="tabular-nums">Tip: +${log.tip}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDeleteClient}
            className="touch-target px-3 py-2 text-xs font-mono text-stone-500 hover:text-rose-400 flex items-center space-x-1.5 transition-colors tactile-btn"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileTick();
              onClose();
            }}
            className="touch-target px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-xs font-semibold tactile-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
