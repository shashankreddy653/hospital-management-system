import React, { useState } from 'react';
import { Bell, ChevronDown, Sparkles, Building2, Radio } from 'lucide-react';
import { HospitalFacility } from '../types/hospital';

interface HeaderProps {
  currentFacility: HospitalFacility;
  facilities: HospitalFacility[];
  onSelectFacility: (fac: HospitalFacility) => void;
  isSimulated: boolean;
  onToggleSimulated: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentFacility,
  facilities,
  onSelectFacility,
  isSimulated,
  onToggleSimulated,
  onOpenNotifications,
  onOpenProfile,
  unreadAlertCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-md mx-auto px-4 py-2.5 sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Brand Icon + Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo matching the screenshot's distinctive cyan 4-point medical icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M12 2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-4a2 2 0 0 0-2-2H4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2V4a2 2 0 0 1 2-2z" />
                <circle cx="12" cy="12" r="2.5" className="fill-white" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-heading font-bold text-slate-900 text-base tracking-tight truncate">
                  SmartCare Opti...
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200/80">
                  COMMAND CENTER
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate -mt-0.5">
                Metro Health Medical Center
              </p>
            </div>
          </div>

          {/* Right: Notification Bell & Profile Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            <button
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-sky-500 transition-all"
              title="Hospital Administrator Profile"
            >
              <span className="sr-only">Administrator Profile</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Demo Mode / Status Ribbon */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <button
            onClick={onToggleSimulated}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium transition-colors border border-sky-200/60"
          >
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            <span>{isSimulated ? 'Demo Mode — Simulated Data' : 'Live Mode — EHR Stream Connected'}</span>
          </button>

          {/* Hospital Switcher dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium py-0.5 px-1.5 rounded hover:bg-slate-100 text-[11px]"
            >
              <Building2 className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Facility:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[120px]">{currentFacility.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Facility Command
                </div>
                {facilities.map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => {
                      onSelectFacility(fac);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      fac.id === currentFacility.id ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{fac.name}</div>
                      <div className="text-[10px] text-slate-400">{fac.totalBeds} Total Beds · {fac.icuBeds} ICU</div>
                    </div>
                    {fac.id === currentFacility.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
