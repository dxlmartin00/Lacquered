import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import type { ServiceLogRecord } from '../../types';
import { playTactileTick } from '../../utils/audio';

export const ServiceLogVault: React.FC = () => {
  const serviceLogs = useLiveQuery(() => db.serviceLogs.reverse().sortBy('timestamp')) || [];
  const [selectedPhotoLog, setSelectedPhotoLog] = useState<ServiceLogRecord | null>(null);

  const totalRevenue = serviceLogs.reduce((sum, l) => sum + l.finalBilled, 0);
  const totalTips = serviceLogs.reduce((sum, l) => sum + (l.tip || 0), 0);

  const getBlobUrl = (blob?: Blob) => {
    if (!blob) return null;
    return URL.createObjectURL(blob);
  };

  const handleOpenPhoto = (log: ServiceLogRecord) => {
    playTactileTick();
    setSelectedPhotoLog(log);
  };

  const handleClosePhoto = () => {
    playTactileTick();
    setSelectedPhotoLog(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pb-20 md:pb-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-800/60">
        <div>
          <h2 className="text-lg font-display font-bold uppercase tracking-wider text-stone-100">
            Service Archive
          </h2>
          <span className="text-xs font-mono tabular-nums text-stone-400">
            {serviceLogs.length} logged sessions
          </span>
        </div>

        <div className="text-right font-mono tabular-nums text-xs">
          <span className="text-stone-100 font-bold">${totalRevenue}</span>
          <span className="text-stone-500 mx-1.5">•</span>
          <span className="text-amber-400">+${totalTips} tip</span>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-2.5">
        {serviceLogs.length === 0 ? (
          <div className="text-center py-12 text-stone-500 font-mono text-xs">
            No service logs archived yet.
          </div>
        ) : (
          serviceLogs.map((log) => {
            const hasPhoto = Boolean(log.resultPhotoBlob);
            const photoUrl = hasPhoto ? getBlobUrl(log.resultPhotoBlob) : null;

            return (
              <div
                key={log.id}
                className="hairline-card p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-stone-100 truncate">
                      {log.clientName || 'Client'}
                    </span>
                    <span className="text-xs font-mono text-amber-400">
                      {log.baseService}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-stone-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <span>{log.formula.baseBrand}</span>
                    {log.formula.shadeCodes.length > 0 && (
                      <span className="text-stone-300">
                        {log.formula.shadeCodes.join(', ')}
                      </span>
                    )}
                    <span className="text-stone-500">{log.formula.topCoat}</span>
                  </div>

                  <div className="text-[10px] font-mono text-stone-500 pt-0.5">
                    {new Date(log.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right font-mono tabular-nums text-xs">
                    <div className="font-bold text-stone-100">${log.finalBilled}</div>
                    {log.tip > 0 && <div className="text-[10px] text-amber-400">+${log.tip}</div>}
                  </div>

                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Finished Set"
                      onClick={() => handleOpenPhoto(log)}
                      className="w-12 h-12 object-cover rounded-lg cursor-pointer border border-stone-700 hover:border-amber-400/60 transition-colors shadow-sm tactile-btn"
                    />
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full-Screen Photo Modal */}
      {selectedPhotoLog && selectedPhotoLog.resultPhotoBlob && (
        <div
          onClick={handleClosePhoto}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[85dvh] hairline-card rounded-2xl p-4 space-y-3 modal-spring-enter"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-mono text-xs text-stone-300">
                {selectedPhotoLog.clientName} · {selectedPhotoLog.baseService}
              </span>
              <button
                onClick={handleClosePhoto}
                className="touch-target p-1 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={getBlobUrl(selectedPhotoLog.resultPhotoBlob)!}
              alt="Finished Set"
              className="max-h-[70dvh] max-w-full rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
