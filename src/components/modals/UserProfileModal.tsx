import React from 'react';
import { X, User, Shield, CheckCircle, Hospital, Award, LogOut } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulated: boolean;
  onToggleSimulated: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  isSimulated,
  onToggleSimulated,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-heading font-bold text-slate-900 text-sm">
            Administrator Profile & Session
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center font-bold text-xl shadow-md border-2 border-sky-400">
            DR
          </div>

          <div>
            <h4 className="font-heading font-bold text-slate-900 text-base">
              Dr. Marcus Rosenthal, MD, FACHE
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Chief Medical Officer & VP of Clinical Operations
            </p>
            <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
              Metro Health Medical Center
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-left space-y-2 text-xs border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Privileges:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-sky-600" /> Executive Triage Authorizer
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Active Shift:</span>
              <span className="font-semibold text-slate-800">Command Center Lead (Day)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">EHR Credential:</span>
              <span className="font-mono text-emerald-700 font-semibold">Epic/Cerner Auth Valid</span>
            </div>
          </div>

          {/* Simulation Toggle */}
          <div className="pt-2">
            <button
              onClick={onToggleSimulated}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                isSimulated
                  ? 'bg-sky-50 text-sky-900 border-sky-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              <span>Operational Data Feed:</span>
              <span className="font-bold underline">
                {isSimulated ? 'Simulated Telemetry' : 'Real-time Live EHR'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
