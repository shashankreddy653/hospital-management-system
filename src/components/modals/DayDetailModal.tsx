import React from 'react';
import { X, Calendar, Activity, AlertTriangle, Users, Bed, ArrowUpRight } from 'lucide-react';
import { DayForecast } from '../../types/hospital';

interface DayDetailModalProps {
  day: DayForecast | null;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ day, onClose }) => {
  if (!day) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                {day.day} ({day.dateStr}) Telemetry
              </h3>
              <p className="text-slate-500 text-xs">
                {day.isToday ? 'Today’s Operational Intake' : 'AI Predictive Intake Horizon'}
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

        {/* Content */}
        <div className="p-4 space-y-4 text-xs sm:text-sm">
          {/* Main big metric */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-xs font-medium">Projected Total Intake</div>
              <div className="text-3xl font-extrabold text-slate-900 font-heading tabular-nums mt-0.5">
                {day.intake} <span className="text-sm font-normal text-slate-500">patients</span>
              </div>
            </div>
            {day.isSurgeAlert ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" /> Surge Risk
              </span>
            ) : day.isToday ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                Active Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                Baseline Trajectory
              </span>
            )}
          </div>

          {/* Breakdown cards */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Inflow Channel Distribution
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-slate-500 text-[11px]">Emergency Dept (ED)</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  {day.edArrivals}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-slate-500 text-[11px]">Elective Surgical</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  {day.electiveSurgical}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-slate-500 text-[11px]">Direct Regional Transfers</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  {day.directTransfers}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50">
                <div className="text-rose-700 text-[11px] font-semibold">ICU Requirement</div>
                <div className="text-lg font-bold text-rose-700 tabular-nums">
                  {day.icuProjected} <span className="text-xs text-rose-500 font-normal">beds</span>
                </div>
              </div>
            </div>
          </div>

          {day.isSurgeAlert && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-800 text-xs leading-relaxed">
              <strong>High Saturation Advisory:</strong> Projected ICU requirement ({day.icuProjected} beds) approaches or exceeds licensed baseline capacity (40 beds). Proactive step-down transfers are strongly recommended.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
