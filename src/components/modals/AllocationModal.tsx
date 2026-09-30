import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, UserCheck, Shield, Bed, Stethoscope, AlertCircle } from 'lucide-react';
import { BedItem, ProtocolIntervention } from '../../types/hospital';

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepDownBeds: BedItem[];
  interventions: ProtocolIntervention[];
  onExecuteAllocation: () => void;
  isExecuted: boolean;
}

export const AllocationModal: React.FC<AllocationModalProps> = ({
  isOpen,
  onClose,
  stepDownBeds,
  interventions,
  onExecuteAllocation,
  isExecuted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <h3 className="font-heading font-bold text-slate-900 text-lg">
                Operational Bed & Resource Allocation
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Protocol execution package for 48h ICU surge mitigation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Status summary banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-start gap-3 text-sky-900">
            <Shield className="w-5 h-5 text-sky-700 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Automated Reallocation Strategy:</span>
              <p className="text-sky-800 text-xs mt-0.5 leading-relaxed">
                By executing these 3 clinical protocol actions, Metro General recovers 4 acute ICU bays, adds 2 critical care nurse shifts, and protects reserve capacity for incoming weekend emergencies.
              </p>
            </div>
          </div>

          {/* Section 1: Patient Step-Down Candidates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-sky-600" />
                Step-Down Patient Transfers (ICU → Ward C Telemetry)
              </h4>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                4 Patients Cleared
              </span>
            </div>

            <div className="space-y-2">
              {stepDownBeds.slice(0, 4).map((bed, idx) => (
                <div
                  key={bed.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">
                      {bed.bedNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                        {bed.patientId} · Age {bed.patientAge}
                        <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                          Telemetry Ready
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Physician: {bed.doctor} · O2: {bed.respiratorySupport}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-1 rounded-lg">
                    <span>Ward C-{idx + 12}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Clinical Nursing Staffing Adjustment */}
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              Critical Care Nursing Surge Allocation
            </h4>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 text-xs">Assigned Nurses (Saturday Swing 14:00 - 22:00)</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  +2 Confirmed
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Nurse Sarah Jenkins, RN (CCRN certified, 6 yrs acute ICU experience)</li>
                <li>Nurse Andrew Chen, BSN (ECMO / Rapid Response certified)</li>
              </ul>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                Maintains target ICU nurse-to-patient ratio at 1:1.8 during predicted peak.
              </div>
            </div>
          </div>

          {/* Section 3: Elective Post-Op Reservation Safeguard */}
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Elective ICU Hold Policy (Post-14:00)
            </h4>
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-xs text-slate-700">
              Elective recovery bays reserved for surgical cases OR 4 and OR 6 will be rerouted to PACU Extended Stay rather than occupying licensed ICU beds, shielding 3 buffer beds.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-xs sm:text-sm hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onExecuteAllocation();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{isExecuted ? 'Update Protocol Orders' : 'Authorize & Dispatch Allocation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
