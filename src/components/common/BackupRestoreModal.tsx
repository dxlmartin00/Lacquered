import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Upload, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { db } from '../../db/schema';
import { INITIAL_SERVICES } from '../../db/mockData';
import { playTactileTick, playChimeSuccess } from '../../utils/audio';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;


  // 1. Export database to JSON file
  const handleExportBackup = async () => {
    playTactileTick();
    try {
      const [clients, appointments, services, serviceLogs] = await Promise.all([
        db.clients.toArray(),
        db.appointments.toArray(),
        db.services.toArray(),
        db.serviceLogs.toArray(),
      ]);

      const backupData = {
        app: 'Laquered Studio OS',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: {
          clients,
          appointments,
          services,
          serviceLogs,
        },
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `laquered-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playChimeSuccess();
      setStatusMessage('Backup exported successfully to your downloads!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export backup:', err);
      setStatusMessage('Error exporting backup. Please try again.');
    }
  };

  // 2. Import database from JSON file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data || !Array.isArray(parsed.data.services)) {
        setStatusMessage('Invalid backup file format.');
        return;
      }

      await db.transaction('rw', [db.clients, db.appointments, db.services, db.serviceLogs], async () => {
        if (parsed.data.services?.length) {
          await db.services.clear();
          await db.services.bulkAdd(parsed.data.services);
        }
        if (parsed.data.clients?.length) {
          await db.clients.clear();
          await db.clients.bulkAdd(parsed.data.clients);
        }
        if (parsed.data.appointments?.length) {
          await db.appointments.clear();
          await db.appointments.bulkAdd(parsed.data.appointments);
        }
        if (parsed.data.serviceLogs?.length) {
          await db.serviceLogs.clear();
          await db.serviceLogs.bulkAdd(parsed.data.serviceLogs);
        }
      });

      playChimeSuccess();
      setStatusMessage('Database restored successfully!');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Failed to restore backup:', err);
      setStatusMessage('Failed to parse and restore file.');
    }
  };

  // 3. Reset database
  const handleResetDatabase = async () => {
    try {
      await db.transaction('rw', [db.clients, db.appointments, db.services, db.serviceLogs], async () => {
        await db.clients.clear();
        await db.appointments.clear();
        await db.serviceLogs.clear();
        await db.services.clear();
        await db.services.bulkAdd(INITIAL_SERVICES);
      });

      playChimeSuccess();
      setIsResetConfirmOpen(false);
      setStatusMessage('Database reset to clean state with default catalog.');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Failed to reset database:', err);
      setStatusMessage('Error resetting database.');
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
      <div className="relative w-full max-w-sm my-auto bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 space-y-4 modal-spring-enter max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-pink-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-800">
                Studio Data &amp; Security
              </h3>
              <p className="text-[10px] text-slate-400">Offline-first local storage</p>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileTick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center tactile-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-2.5">
          {/* Backup Download */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="w-full p-3.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-between text-left tactile-btn"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs block text-slate-800">
                  Export Studio Backup
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Download offline JSON backup file
                </span>
              </div>
            </div>
          </button>

          {/* Restore Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-between text-left tactile-btn"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs block text-slate-800">
                  Restore from Backup
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Import a previously saved JSON file
                </span>
              </div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Reset Clean Slate */}
          {!isResetConfirmOpen ? (
            <button
              type="button"
              onClick={() => {
                playTactileTick();
                setIsResetConfirmOpen(true);
              }}
              className="w-full p-3 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Studio Data (Reset)</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-start space-x-2 text-rose-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug font-medium">
                  This will erase all clients and appointments and restore default services. Make sure you exported a backup!
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setIsResetConfirmOpen(false);
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-white text-slate-600 text-xs font-semibold border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetDatabase}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-pink-50">
          All records are encrypted &amp; stored locally on your device.
        </div>
      </div>
    </div>,
    document.body
  );

};
