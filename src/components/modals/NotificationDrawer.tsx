import React, { useState } from 'react';
import { X, Bell, AlertTriangle, AlertCircle, Info, Check, CheckCheck } from 'lucide-react';
import { OperationalAlert } from '../../types/hospital';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: OperationalAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Operational Alerts Feed
              </h3>
              <p className="text-slate-500 text-xs">
                Real-time Clinical Triage & Surge Notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white text-xs">
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === 'critical'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Critical ({alerts.filter(a => a.severity === 'critical').length})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === 'warning'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Warnings ({alerts.filter(a => a.severity === 'warning').length})
            </button>
          </div>

          <button
            onClick={onAcknowledgeAll}
            className="text-sky-700 hover:text-sky-900 font-semibold text-[11px] flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Ack All
          </button>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No active operational alerts in this view.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-50/60 border-slate-200 opacity-70'
                      : isCrit
                      ? 'bg-rose-50/60 border-rose-200'
                      : isWarn
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-sky-50/40 border-sky-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {isCrit ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      ) : isWarn ? (
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
                      )}
                      <span className="font-heading font-semibold text-xs sm:text-sm text-slate-900">
                        {alert.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 ml-6 leading-relaxed mb-2">
                    {alert.message}
                  </p>

                  <div className="ml-6 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">
                      Location: {alert.location}
                    </span>

                    {!alert.acknowledged ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 font-medium border border-slate-300 shadow-2xs flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
