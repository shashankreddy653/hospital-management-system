import React, { useState } from 'react';
import { OperationalAlert } from '../../types/hospital';
import { AlertTriangle, AlertCircle, Info, Check, CheckCheck, ShieldAlert, ArrowRight } from 'lucide-react';

interface AlertsTabProps {
  alerts: OperationalAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
  onNavigateToOptimization: () => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
  onNavigateToOptimization,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            <span>Active Operational Alarms</span>
          </div>

          <button
            onClick={onAcknowledgeAll}
            className="flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900 font-semibold px-2 py-1 rounded-lg hover:bg-sky-50 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Acknowledge All
          </button>
        </div>

        <h3 className="font-heading font-bold text-slate-900 text-lg">
          Clinical Triage & Surge Warning Log
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
          Real-time threshold breaches, capacity warnings, and operational triage recommendations.
        </p>

        {/* Filter bar */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'critical'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Critical ({alerts.filter(a => a.severity === 'critical').length})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'warning'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Warnings ({alerts.filter(a => a.severity === 'warning').length})
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const isCrit = alert.severity === 'critical';
          const isWarn = alert.severity === 'warning';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${
                alert.acknowledged
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : isCrit
                  ? 'bg-rose-50/60 border-rose-300 shadow-xs'
                  : isWarn
                  ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                  : 'bg-sky-50/50 border-sky-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {isCrit ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  ) : isWarn ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
                  )}
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    {alert.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 ml-7 leading-relaxed mb-3">
                {alert.message}
              </p>

              {alert.suggestedAction && (
                <div className="ml-7 mb-3 p-2.5 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sky-800">Suggested Action: </span>
                    <span>{alert.suggestedAction}</span>
                  </div>
                  <button
                    onClick={onNavigateToOptimization}
                    className="flex-shrink-0 ml-2 text-sky-700 font-bold hover:text-sky-900 flex items-center gap-1 text-[11px]"
                  >
                    Act <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="ml-7 flex items-center justify-between text-xs pt-2 border-t border-slate-200/50">
                <span className="text-slate-500">
                  Location: <span className="font-medium text-slate-700">{alert.location}</span>
                </span>

                {!alert.acknowledged ? (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold border border-slate-300 shadow-2xs flex items-center gap-1 text-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Acknowledged
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
