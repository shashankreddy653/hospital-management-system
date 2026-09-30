import React, { useState } from 'react';
import { ProtocolIntervention, BedItem } from '../../types/hospital';
import { SlidersHorizontal, CheckCircle2, ShieldCheck, Zap, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

interface OptimizationTabProps {
  interventions: ProtocolIntervention[];
  onToggleIntervention: (id: string) => void;
  stepDownBeds: BedItem[];
  onExecuteAll: () => void;
  isExecuted: boolean;
}

export const OptimizationTab: React.FC<OptimizationTabProps> = ({
  interventions,
  onToggleIntervention,
  stepDownBeds,
  onExecuteAll,
  isExecuted,
}) => {
  const [successToast, setSuccessToast] = useState(false);

  const handleExecute = () => {
    onExecuteAll();
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-sky-700" />
            <span>Operational Optimization Engine</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Algorithm v4.2 Active</span>
        </div>

        <h3 className="font-heading font-bold text-slate-900 text-lg">
          Active Surge Mitigation Protocols
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
          The operational decision model continuously matches incoming telemetry with clinical protocols to resolve bed bottlenecks and prevent ambulance diversion.
        </p>

        {successToast && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">Protocol orders dispatched to Epic EHR & Clinical Nursing Command!</span>
          </div>
        )}
      </div>

      {/* Actionable Interventions Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-heading font-bold text-slate-900 text-sm">
            Prescribed Intervention Directives
          </h4>
          <span className="text-xs text-slate-500">
            {interventions.filter(i => i.checked).length} of {interventions.length} Selected
          </span>
        </div>

        <div className="space-y-2.5">
          {interventions.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => onToggleIntervention(protocol.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                protocol.checked
                  ? 'bg-sky-50/70 border-sky-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                <CheckCircle2
                  className={`w-5 h-5 transition-colors ${
                    protocol.checked ? 'text-sky-600' : 'text-slate-300'
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-semibold text-xs sm:text-sm text-slate-900">
                    {protocol.title}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {protocol.category}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-snug">
                  {protocol.description}
                </div>
                <div className="mt-2 text-[11px] font-semibold text-sky-800 flex items-center gap-1 bg-sky-100/50 px-2 py-0.5 rounded-md inline-flex">
                  <span>Impact: {protocol.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={handleExecute}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isExecuted ? 'Re-dispatch Active Protocols' : 'Authorize & Dispatch Selected Directives'}</span>
          </button>
        </div>
      </div>

      {/* Transfer Staging Queue */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="font-heading font-bold text-slate-900 text-sm">
          Patient Step-Down Dispatch Staging
        </h4>

        <div className="space-y-2">
          {stepDownBeds.map((bed, idx) => (
            <div
              key={bed.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">{bed.patientId}</span>
                <span className="text-slate-500 ml-2 font-mono">{bed.bedNumber}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  LOS: {bed.admissionHoursAgo}h · Attending: {bed.doctor}
                </div>
              </div>

              <div className="flex items-center gap-2 font-semibold text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <span>Ward C-Bed {idx + 10}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
