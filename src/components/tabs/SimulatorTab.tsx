import React, { useState } from 'react';
import { Compass, RotateCcw, AlertTriangle, ShieldCheck, Zap, Sliders, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { HospitalFacility } from '../../types/hospital';

interface SimulatorTabProps {
  facility: HospitalFacility;
  onApplyMitigations: () => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({ facility, onApplyMitigations }) => {
  const [influxDelta, setInfluxDelta] = useState<number>(20); // +20% surge default
  const [staffDelta, setStaffDelta] = useState<number>(0);
  const [haltElective, setHaltElective] = useState<boolean>(true);
  const [mciActive, setMciActive] = useState<boolean>(false);
  const [respWave, setRespWave] = useState<boolean>(true);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Simulation calculation engine
  let simulatedIcuDemand = 32; // baseline
  // add surge influx
  simulatedIcuDemand += Math.round(10 * (influxDelta / 50));
  // add resp wave
  if (respWave) simulatedIcuDemand += 4;
  // add MCI drill
  if (mciActive) simulatedIcuDemand += 7;
  // subtract elective holds
  if (haltElective) simulatedIcuDemand -= 3;

  const totalIcuBeds = facility.icuBeds; // 40
  const isOverflow = simulatedIcuDemand > totalIcuBeds;
  const overflowDeficit = simulatedIcuDemand - totalIcuBeds;
  const simulatedPercent = Math.round((simulatedIcuDemand / totalIcuBeds) * 100);

  // Time to saturation
  let saturationEstimate = 'No saturation (Buffer maintained)';
  if (simulatedIcuDemand >= totalIcuBeds) {
    saturationEstimate = 'Saturday ~18:45 PM (Surge peak)';
  } else if (simulatedIcuDemand >= 36) {
    saturationEstimate = 'Sunday ~04:00 AM (Approaching threshold)';
  }

  const handleReset = () => {
    setInfluxDelta(0);
    setStaffDelta(0);
    setHaltElective(false);
    setMciActive(false);
    setRespWave(false);
  };

  const handleApply = () => {
    onApplyMitigations();
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Simulator Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-sky-700" />
            <span>Operational What-If Sandbox</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        <h3 className="font-heading font-bold text-slate-900 text-lg">
          Capacity Stress & Saturation Simulator
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
          Stress-test Metro General’s capacity under sudden multi-casualty events, respiratory epidemics, or staffing disruptions.
        </p>
      </div>

      {/* Output Projection Display */}
      <div className={`border rounded-2xl p-4 sm:p-5 transition-all ${
        isOverflow ? 'bg-rose-50/90 border-rose-300' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
            Projected Peak ICU Load
          </span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
            isOverflow
              ? 'bg-rose-200 text-rose-900 border-rose-300 animate-pulse'
              : 'bg-amber-100 text-amber-900 border-amber-200'
          }`}>
            {simulatedPercent}% Capacity
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-extrabold font-heading tabular-nums ${
            isOverflow ? 'text-rose-700' : 'text-slate-900'
          }`}>
            {simulatedIcuDemand}
          </span>
          <span className="text-slate-500 text-base font-normal">
            / {totalIcuBeds} Licensed Beds
          </span>
          {isOverflow && (
            <span className="text-xs font-bold text-rose-700 ml-2">
              (DEFICIT: -{overflowDeficit} BEDS)
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverflow ? 'bg-rose-600' : simulatedPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, simulatedPercent)}%` }}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500">Saturation Threshold:</span>
            <div className="font-semibold text-slate-800 mt-0.5">{saturationEstimate}</div>
          </div>
          <div>
            <span className="text-slate-500">Triage Status:</span>
            <div className={`font-semibold mt-0.5 ${isOverflow ? 'text-rose-600' : 'text-emerald-700'}`}>
              {isOverflow ? 'Diversion Warning Triggered' : 'Internal Mitigation Sufficient'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sliders & Variables */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
        <h4 className="font-heading font-bold text-slate-900 text-sm">
          Simulated Operational Conditions
        </h4>

        {/* Slider 1: Patient Influx */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-700">Patient Inflow Surge</span>
            <span className="font-bold text-slate-900 font-mono">
              {influxDelta > 0 ? `+${influxDelta}%` : `${influxDelta}%`}
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="50"
            step="5"
            value={influxDelta}
            onChange={(e) => setInfluxDelta(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>-30% (Lull)</span>
            <span>0% (Baseline)</span>
            <span>+50% (Major Surge)</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Scenario Triggers & Safeguards
          </div>

          {/* Toggle: Halt Elective Surgeries */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer select-none text-xs">
            <div>
              <span className="font-semibold text-slate-900">Halt Elective Post-Op Surgeries</span>
              <p className="text-slate-500 text-[11px] mt-0.5">Saves ~3 ICU recovery beds for trauma</p>
            </div>
            <input
              type="checkbox"
              checked={haltElective}
              onChange={(e) => setHaltElective(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>

          {/* Toggle: Winter Respiratory Wave */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer select-none text-xs">
            <div>
              <span className="font-semibold text-slate-900">Severe Respiratory Virus Outbreak</span>
              <p className="text-slate-500 text-[11px] mt-0.5">+4 Ventilator admissions (Flu/RSV)</p>
            </div>
            <input
              type="checkbox"
              checked={respWave}
              onChange={(e) => setRespWave(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>

          {/* Toggle: Mass Casualty Incident */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer select-none text-xs">
            <div>
              <span className="font-semibold text-slate-900">Mass Casualty Incident (MCI Code Brown)</span>
              <p className="text-slate-500 text-[11px] mt-0.5">+7 Critical acute trauma victims arriving</p>
            </div>
            <input
              type="checkbox"
              checked={mciActive}
              onChange={(e) => setMciActive(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>
        </div>

        {/* Apply Action */}
        <div className="pt-2">
          {appliedNotice ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs text-center font-semibold">
              ✓ Simulation parameters deployed to Active Command Dashboard!
            </div>
          ) : (
            <button
              onClick={handleApply}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Apply Recommended Safeguards to Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
