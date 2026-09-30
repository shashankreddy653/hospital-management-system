import React, { useState } from 'react';
import { DayForecast } from '../../types/hospital';
import { TrendingUp, AlertTriangle, Calendar, Activity, CloudSun, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface ForecastTabProps {
  forecast: DayForecast[];
  onSelectDay: (day: DayForecast) => void;
}

export const ForecastTab: React.FC<ForecastTabProps> = ({ forecast, onSelectDay }) => {
  const [horizon, setHorizon] = useState<'7d' | '14d' | '30d'>('7d');

  return (
    <div className="space-y-4 pb-20">
      {/* Horizon selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Predictive Hospital Demand Modeling
            </h3>
            <p className="text-slate-500 text-xs">
              Bayesian intake telemetry with machine learning surge forecasting
            </p>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {(['7d', '14d', '30d'] as const).map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  horizon === h
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {h.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Surge risk indicator */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 space-y-1">
            <span className="font-bold">48-Hour Weekend Surge Detected:</span>
            <p className="text-rose-800 leading-relaxed">
              Friday to Sunday projection models forecast a 28% increase in emergency admissions, primarily driven by seasonal respiratory cases (34%) and blunt trauma influx (22%).
            </p>
          </div>
        </div>
      </div>

      {/* Daily Breakdown List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-heading font-bold text-slate-900 text-sm">
            Daily Admission Telemetry & Triage Risk
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Click day for details
          </span>
        </div>

        <div className="space-y-2">
          {forecast.map((day) => {
            const isCritical = day.isSurgeAlert;
            const isToday = day.isToday;

            return (
              <div
                key={day.day}
                onClick={() => onSelectDay(day)}
                className={`p-3 rounded-xl border cursor-pointer hover:border-sky-400 transition-all flex items-center justify-between text-xs ${
                  isToday
                    ? 'bg-sky-50/70 border-sky-300'
                    : isCritical
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center font-bold ${
                    isToday ? 'bg-sky-700 text-white' : isCritical ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <span className="text-xs">{day.dayShort}</span>
                    <span className="text-[9px] font-normal opacity-90">{day.dateStr.split(' ')[1]}</span>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      {day.day}
                      {isToday && (
                        <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.2 rounded font-bold">
                          Today
                        </span>
                      )}
                      {isCritical && (
                        <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                          Surge Alert
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ED: {day.edArrivals} · Elective: {day.electiveSurgical} · Transfers: {day.directTransfers}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-slate-900 font-heading tabular-nums">
                    {day.intake} <span className="text-xs font-normal text-slate-500">intake</span>
                  </div>
                  <div className={`text-[11px] font-semibold ${isCritical ? 'text-rose-600' : 'text-slate-600'}`}>
                    ICU Req: {day.icuProjected} beds
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* External Environmental & Epidemiological Correlators */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-sky-600" />
          External Environmental Drivers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Respiratory Wave (RSV/Flu)</span>
            <div className="text-base font-bold text-rose-600 mt-1">+18.4%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Regional positivity trending upward</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Weekend Trauma Index</span>
            <div className="text-base font-bold text-amber-600 mt-1">+24.0%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Metropolitan sporting events & transit</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Post-Op ICU Conversion</span>
            <div className="text-base font-bold text-sky-700 mt-1">21.2%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Complex cardiothoracic & neuro cases</div>
          </div>
        </div>
      </div>
    </div>
  );
};
