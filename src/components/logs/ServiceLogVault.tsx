import React, { useState } from 'react';
import {
  BookOpen,
  Tag,
  Heart,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import type { ServiceLogRecord } from '../../types';

export const ServiceLogVault: React.FC = () => {
  const serviceLogs = useLiveQuery(() => db.serviceLogs.reverse().sortBy('timestamp')) || [];
  const [selectedPhotoLog, setSelectedPhotoLog] = useState<ServiceLogRecord | null>(null);

  const totalRevenue = serviceLogs.reduce((sum, l) => sum + l.finalBilled, 0);
  const totalTips = serviceLogs.reduce((sum, l) => sum + (l.tip || 0), 0);

  // Helper to convert blob to object URL
  const getBlobUrl = (blob?: Blob) => {
    if (!blob) return null;
    return URL.createObjectURL(blob);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 md:pb-6 select-none">
      {/* Header & Revenue Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-studio-surface border border-studio-elevated rounded-3xl p-5 md:p-6 shadow-md">
        <div>
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-display font-bold uppercase tracking-wider text-stone-100">
              Formulas &amp; Archive Log
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Complete history of nail sets, layer recipes, shade codes, and compressed result photography
          </p>
        </div>

        {/* Studio Financial Snapshot Pills */}
        <div className="flex items-center space-x-3">
          <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Logged Services
            </span>
            <span className="text-base font-bold font-mono text-stone-100">
              ${totalRevenue}
            </span>
          </div>

          <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block flex items-center justify-end space-x-1">
              <Heart className="w-3 h-3 fill-rose-400 inline" />
              <span>Gratuity</span>
            </span>
            <span className="text-base font-bold font-mono text-amber-300">
              +${totalTips}
            </span>
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        {serviceLogs.length === 0 ? (
          <div className="text-center py-16 bg-studio-surface border border-studio-elevated rounded-3xl text-stone-500 font-mono text-xs space-y-2">
            <BookOpen className="w-8 h-8 text-stone-700 mx-auto" />
            <p>No service logs archived yet.</p>
            <p className="text-stone-600">Complete an active chair session to log formulas &amp; photos.</p>
          </div>
        ) : (
          serviceLogs.map((log) => {
            const hasPhoto = Boolean(log.resultPhotoBlob);
            const photoUrl = hasPhoto ? getBlobUrl(log.resultPhotoBlob) : null;

            return (
              <div
                key={log.id}
                className="bg-studio-surface border border-studio-elevated p-5 rounded-2xl space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-studio-elevated">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-stone-100">
                        {log.clientName || 'Studio Client'}
                      </h3>
                      <span className="text-xs font-mono text-stone-500">•</span>
                      <span className="text-xs font-mono text-amber-400">{log.baseService}</span>
                    </div>
                    <div className="text-xs font-mono text-stone-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-stone-100">${log.finalBilled}</div>
                    {log.tip > 0 && (
                      <div className="text-[11px] text-amber-400">Tip: +${log.tip}</div>
                    )}
                  </div>
                </div>

                {/* Formula Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center space-x-1.5 text-stone-300 font-semibold mb-1">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gel Formula Recipe</span>
                    </div>

                    <div className="space-y-1 text-stone-400">
                      <div>
                        <span className="text-stone-500">Base System: </span>
                        <span className="text-stone-200">{log.formula.baseBrand}</span>
                      </div>
                      {log.formula.shadeCodes.length > 0 && (
                        <div>
                          <span className="text-stone-500">Shade Codes: </span>
                          <span className="text-amber-300 font-semibold">
                            {log.formula.shadeCodes.join(' • ')}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-stone-500">Top Coat: </span>
                        <span className="text-stone-200">{log.formula.topCoat}</span>
                      </div>
                      {log.formula.details && (
                        <p className="text-[11px] text-stone-400 italic pt-1 border-t border-stone-900 leading-relaxed">
                          "{log.formula.details}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Photo Thumbnail if captured */}
                  <div className="flex items-center justify-center bg-stone-950 rounded-xl border border-stone-800 p-2 min-h-[100px]">
                    {photoUrl ? (
                      <div
                        onClick={() => setSelectedPhotoLog(log)}
                        className="relative group cursor-pointer w-full h-full min-h-[100px] rounded-lg overflow-hidden flex items-center justify-center bg-stone-900"
                      >
                        <img
                          src={photoUrl}
                          alt="Finished Set"
                          className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-white">
                          View Full-Res
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-stone-600 font-mono text-[11px] space-y-1">
                        <ImageIcon className="w-6 h-6 mx-auto text-stone-700" />
                        <span>No photo captured</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full-Screen Photo Modal */}
      {selectedPhotoLog && selectedPhotoLog.resultPhotoBlob && (
        <div
          onClick={() => setSelectedPhotoLog(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90dvh] bg-stone-950 border border-stone-800 rounded-3xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-mono text-xs text-stone-300">
                {selectedPhotoLog.clientName} · {selectedPhotoLog.baseService}
              </span>
              <button
                onClick={() => setSelectedPhotoLog(null)}
                className="touch-target p-2 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={getBlobUrl(selectedPhotoLog.resultPhotoBlob)!}
              alt="Full-res finished nail art"
              className="max-h-[75dvh] max-w-full rounded-2xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
