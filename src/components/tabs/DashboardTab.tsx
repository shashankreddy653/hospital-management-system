import React, { useState } from 'react';
import {
  Info,
  Clock,
  Bed,
  HeartPulse,
  BriefcaseMedical,
  Users,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { HospitalFacility, DayForecast, ProtocolIntervention } from '../../types/hospital';

interface DashboardTabProps {
  facility: HospitalFacility;
  forecast: DayForecast[];
  interventions: ProtocolIntervention[];
  onToggleIntervention: (id: string) => void;
  onSelectDayForecast: (day: DayForecast) => void;
  onOpenAllocationModal: () => void;
  onNavigateToSimulator: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  facility,
  forecast,
  interventions,
  onToggleIntervention,
  onSelectDayForecast,
  onOpenAllocationModal,
  onNavigateToSimulator,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayForecast | null>(null);

  // Compute live adjusted stats based on checked interventions
  const stepDownChecked = interventions.find(i => i.id === 'proto-1')?.checked ?? false;
  const nursingChecked = interventions.find(i => i.id === 'proto-2')?.checked ?? false;
  const electiveChecked = interventions.find(i => i.id === 'proto-3')?.checked ?? false;

  // Real-time capacity adjustment based on protocols checked
  const adjustedIcuOccupied = stepDownChecked ? facility.icuOccupied - 4 : facility.icuOccupied;
  const icuCapacityPercent = Math.round((adjustedIcuOccupied / facility.icuBeds) * 100);

  const inpatientOccupied = facility.inpatientOccupied;
  const inpatientPercent = Math.round((inpatientOccupied / facility.totalBeds) * 100);

  const otUtilizedPercent = Math.round((facility.operatingTheatersActive / facility.operatingTheatersTotal) * 100);
  const staffUtilizedPercent = Math.round((facility.staffActive / facility.staffTotal) * 100);

  const maxIntake = Math.max(...forecast.map(f => f.intake), 220);

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Notice Box */}
      <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 transition-all">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-sky-600 flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-slate-900 text-sm">
              Demo Mode — Simulated Hospital Data
            </h2>
            <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed">
              SmartCare provides predictive operational recommendations. Clinical workflows and final triage decisions remain strictly with authorized hospital administrators.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Facility Header & Quick Stats */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 flex-shrink-0 animate-pulse" />
            <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg">
              {facility.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200/70">
              {facility.totalBeds} Total Beds
            </span>
            <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200/70">
              {facility.icuBeds} ICU Beds
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-mono text-[11px] ml-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {facility.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Four Key Metrics Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: INPATIENT BEDS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                INPATIENT BEDS
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                <Bed className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
                {inpatientOccupied}
              </span>
              <span className="text-slate-400 font-medium text-sm">
                /{facility.totalBeds}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {inpatientPercent}% Occupied
            </span>
          </div>
        </div>

        {/* Card 2: ICU CAPACITY */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                ICU CAPACITY
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
                {adjustedIcuOccupied}
              </span>
              <span className="text-slate-400 font-medium text-sm">
                /{facility.icuBeds}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              icuCapacityPercent >= 80
                ? 'bg-rose-50 text-rose-700 border-rose-200/80 animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-200/60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${icuCapacityPercent >= 80 ? 'bg-rose-600' : 'bg-amber-500'}`} />
              {icuCapacityPercent}% High Surge
            </span>
          </div>
        </div>

        {/* Card 3: OPERATING THEATERS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                OPERATING THEATERS
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                <BriefcaseMedical className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
                {facility.operatingTheatersActive}
              </span>
              <span className="text-slate-400 font-medium text-sm">
                /{facility.operatingTheatersTotal}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
              {otUtilizedPercent}% Utilized
            </span>
          </div>
        </div>

        {/* Card 4: CLINICAL STAFF */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                CLINICAL STAFF
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
                {facility.staffActive}
              </span>
              <span className="text-slate-400 font-medium text-sm">
                /{facility.staffTotal}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {facility.staffTotal - facility.staffActive} Available
            </span>
          </div>
        </div>
      </div>

      {/* 4. Hospital Demand Forecast Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg">
              Hospital Demand Forecast
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Next 7 Days Patient Intake Telemetry
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold border border-sky-200/80 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            7-Day Horizon
          </span>
        </div>

        {/* Red Alert Banner */}
        <div className="bg-rose-50/90 border border-rose-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-rose-800 mb-6">
          <TrendingUp className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <p className="text-xs sm:text-[13px] font-medium leading-tight">
            ICU demand is expected to increase over the next 48 hours.
          </p>
        </div>

        {/* 7-Day Chart */}
        <div className="pt-2 pb-1">
          <div className="grid grid-cols-7 gap-2 items-end h-44 px-1">
            {forecast.map((item, idx) => {
              const heightPercent = Math.max(20, Math.round((item.intake / maxIntake) * 100));

              // Determine bar styling matching the screenshot
              let barColor = 'bg-[#cce5ff] hover:bg-[#b8d9fc]'; // Baseline light blue
              let textColor = 'text-slate-600';
              let dayColor = 'text-slate-600';

              if (item.isToday) {
                barColor = 'bg-[#00476e] hover:bg-[#003654]'; // Dark today blue
                textColor = 'text-slate-900 font-bold';
                dayColor = 'text-slate-900 font-bold';
              } else if (item.isSurgeAlert) {
                barColor = 'bg-[#ba1a1a] hover:bg-[#9a1414]'; // Crimson surge
                textColor = item.dayShort === 'F' ? 'text-[#006398] font-semibold' : 'text-[#ba1a1a] font-semibold';
                dayColor = item.dayShort === 'F' ? 'text-[#006398] font-semibold' : 'text-[#ba1a1a] font-semibold';
              }

              return (
                <div
                  key={idx}
                  onClick={() => onSelectDayForecast(item)}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer"
                  title={`${item.day}: ${item.intake} projected intake (Click for breakdown)`}
                >
                  {/* Top value */}
                  <span className={`text-[11px] sm:text-xs font-mono mb-1.5 transition-transform group-hover:scale-110 ${textColor}`}>
                    {item.intake}
                  </span>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[28px] sm:max-w-[34px] flex items-end justify-center h-28 bg-slate-50/50 rounded-t-sm">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all duration-500 shadow-xs ${barColor}`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-xs mt-2 transition-colors ${dayColor}`}>
                    {item.dayShort}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend matching image */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-[#cce5ff]" />
              <span>Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-[#00476e]" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-[#ba1a1a]" />
              <span>Surge Alert (48h)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Resource Utilization Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg">
            Resource Utilization
          </h3>
          <span className="text-slate-500 text-xs">
            Real-time Telemetry
          </span>
        </div>

        <div className="space-y-4">
          {/* Bar 1: Inpatient Beds */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-[13px] mb-1.5">
              <span className="font-medium text-slate-800">Inpatient Beds</span>
              <span className="font-bold text-amber-600 tabular-nums">{inpatientPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${inpatientPercent}%` }}
              />
            </div>
          </div>

          {/* Bar 2: Intensive Care Unit (ICU) */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-[13px] mb-1.5">
              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                Intensive Care Unit (ICU)
                <span className="text-rose-600 font-bold inline-flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 inline" />
                </span>
              </span>
              <span className="font-bold text-rose-600 tabular-nums">
                {icuCapacityPercent}% (High capacity alert)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${icuCapacityPercent}%` }}
              />
            </div>
          </div>

          {/* Bar 3: Operating Theaters */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-[13px] mb-1.5">
              <span className="font-medium text-slate-800">Operating Theaters</span>
              <span className="font-bold text-sky-700 tabular-nums">{otUtilizedPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${otUtilizedPercent}%` }}
              />
            </div>
          </div>

          {/* Bar 4: Nursing & Clinical Staff */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-[13px] mb-1.5">
              <span className="font-medium text-slate-800">Nursing & Clinical Staff</span>
              <span className="font-bold text-emerald-600 tabular-nums">85%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Operational Decision Support Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/70 text-sky-900 text-xs font-semibold">
            <Lightbulb className="w-3.5 h-3.5 text-sky-700" />
            <span>Operational Decision Support</span>
          </div>

          <span className="text-slate-500 text-xs font-mono font-medium">
            Model v4.2
          </span>
        </div>

        {/* Insufficient Warning Box */}
        <div className="bg-[#fff5f5] border border-rose-200/80 rounded-xl p-3.5 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-rose-600 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                ICU capacity may become insufficient
              </h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Predicted demand exceeds baseline reserve thresholds across Friday–Sunday influx.
              </p>
            </div>
          </div>
        </div>

        {/* Prescribed Protocol Interventions */}
        <div className="space-y-2.5 mb-5">
          <div className="text-xs font-bold text-slate-900 tracking-tight mb-2">
            Prescribed Protocol Interventions
          </div>

          {interventions.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => onToggleIntervention(protocol.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                protocol.checked
                  ? 'bg-sky-50/60 border-sky-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                  protocol.checked ? 'text-sky-600' : 'text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-[13px] font-semibold text-slate-900">
                  {protocol.title}
                </div>
                <div className="text-slate-600 text-xs mt-0.5 leading-snug">
                  {protocol.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Primary View Allocation Button (Solid Black) */}
          <button
            onClick={onOpenAllocationModal}
            className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>View Allocation</span>
          </button>

          {/* Secondary Run What-If Simulation Button (Soft Blue) */}
          <button
            onClick={onNavigateToSimulator}
            className="w-full py-3 px-4 rounded-xl bg-[#e5eeff] hover:bg-[#d8e7ff] active:scale-[0.99] text-[#00476e] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-[#cce0ff]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Run What-If Simulation</span>
          </button>
        </div>

        {/* Disclaimer footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-[11px] leading-tight">
          <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            Final decisions remain with authorized hospital administrators and certified medical directors.
          </span>
        </div>
      </div>
    </div>
  );
};
