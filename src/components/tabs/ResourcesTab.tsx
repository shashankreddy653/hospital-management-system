import React, { useState } from 'react';
import { BedItem, OperatingTheater, StaffMember, HospitalFacility } from '../../types/hospital';
import { Bed, HeartPulse, BriefcaseMedical, Users, Activity, Filter, Check, Clock, Stethoscope } from 'lucide-react';

interface ResourcesTabProps {
  facility: HospitalFacility;
  icuBeds: BedItem[];
  operatingTheaters: OperatingTheater[];
  staff: StaffMember[];
  onSelectBed: (bed: BedItem) => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({
  facility,
  icuBeds,
  operatingTheaters,
  staff,
  onSelectBed,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'icu' | 'or' | 'staff'>('icu');
  const [bedFilter, setBedFilter] = useState<'all' | 'step-down' | 'occupied' | 'available'>('all');
  const [selectedBedDetail, setSelectedBedDetail] = useState<BedItem | null>(null);

  const filteredBeds = icuBeds.filter(b => {
    if (bedFilter === 'all') return true;
    if (bedFilter === 'step-down') return b.status === 'step-down-ready';
    if (bedFilter === 'occupied') return b.status === 'occupied' || b.status === 'step-down-ready';
    if (bedFilter === 'available') return b.status === 'available' || b.status === 'cleaning';
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Selector Subtabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-xs">
        <button
          onClick={() => setActiveSubTab('icu')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'icu'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>ICU Ward (40 Beds)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('or')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'or'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BriefcaseMedical className="w-4 h-4" />
          <span>OR Theaters (10)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'staff'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clinical Staff</span>
        </button>
      </div>

      {/* SUBTAB 1: ICU Beds Grid */}
      {activeSubTab === 'icu' && (
        <div className="space-y-3">
          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex gap-1.5">
              <button
                onClick={() => setBedFilter('all')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  bedFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All (40)
              </button>
              <button
                onClick={() => setBedFilter('step-down')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  bedFilter === 'step-down'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-sky-700 hover:bg-sky-50'
                }`}
              >
                Step-down Ready (4)
              </button>
              <button
                onClick={() => setBedFilter('occupied')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  bedFilter === 'occupied'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
                }`}
              >
                Occupied ({icuBeds.filter(b => b.status === 'occupied' || b.status === 'step-down-ready').length})
              </button>
              <button
                onClick={() => setBedFilter('available')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  bedFilter === 'available'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Available/Cleaning (4)
              </button>
            </div>
          </div>

          {/* 40 Beds Grid */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-heading font-bold text-slate-800">
                ICU Pods Alpha & Beta (Live Telemetry)
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Click bed for vitals
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
              {filteredBeds.map((bed) => {
                const isStepDown = bed.status === 'step-down-ready';
                const isOccupied = bed.status === 'occupied';
                const isAvail = bed.status === 'available';
                const isClean = bed.status === 'cleaning';

                let borderBg = 'border-slate-200 bg-slate-50 text-slate-600';
                if (isStepDown) {
                  borderBg = 'border-sky-300 bg-sky-50 text-sky-900 ring-2 ring-sky-400/40';
                } else if (isOccupied) {
                  borderBg = 'border-rose-200 bg-rose-50/50 text-rose-900';
                } else if (isAvail) {
                  borderBg = 'border-emerald-300 bg-emerald-50 text-emerald-900';
                } else if (isClean) {
                  borderBg = 'border-amber-200 bg-amber-50 text-amber-900';
                }

                return (
                  <div
                    key={bed.id}
                    onClick={() => setSelectedBedDetail(bed)}
                    className={`p-2 rounded-xl border flex flex-col justify-between cursor-pointer hover:scale-105 transition-all text-center min-h-[64px] ${borderBg}`}
                  >
                    <div className="text-[11px] font-bold tracking-tight">
                      {bed.bedNumber.replace('ICU-', '#')}
                    </div>
                    <div className="text-[10px] font-medium truncate mt-0.5">
                      {isStepDown ? (
                        <span className="text-sky-700 font-bold">Transfer</span>
                      ) : isOccupied ? (
                        <span className="text-rose-700 font-semibold">{bed.respiratorySupport === 'Ventilator' ? 'Vent' : 'Bed'}</span>
                      ) : isClean ? (
                        <span className="text-amber-700">Turnaround</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Free</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bed Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Step-down Eligible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cleaning
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
              </span>
            </div>
          </div>

          {/* Selected Bed Detail Card */}
          {selectedBedDetail && (
            <div className="bg-white border-2 border-sky-400 rounded-2xl p-4 shadow-md animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-xs">
                    {selectedBedDetail.bedNumber}
                  </span>
                  <span className="font-heading font-bold text-slate-900 text-sm">
                    {selectedBedDetail.patientId || 'Unoccupied Bed'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBedDetail(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-0.5 rounded hover:bg-slate-100"
                >
                  Dismiss
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-[10px]">Acuity Level</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedBedDetail.patientAcuity || 'N/A'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-[10px]">Respiratory Support</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedBedDetail.respiratorySupport}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-[10px]">Attending Physician</div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate">{selectedBedDetail.doctor || 'None'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-[10px]">Length of Stay</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedBedDetail.admissionHoursAgo ? `${selectedBedDetail.admissionHoursAgo} hrs` : 'Ready'}</div>
                </div>
              </div>

              {selectedBedDetail.status === 'step-down-ready' && (
                <div className="mt-3 p-2.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-sky-900 font-medium">
                    Patient stabilized. Cleared for Ward C telemetry transfer.
                  </span>
                  <span className="font-bold text-sky-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                    Target: Ward C-14
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: Operating Theaters */}
      {activeSubTab === 'or' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-bold text-slate-900 text-sm">
              Surgical Suite Telemetry (7/10 Active)
            </h3>
            <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              70% In Procedure
            </span>
          </div>

          <div className="space-y-2">
            {operatingTheaters.map((or) => {
              const isProc = or.status === 'In Procedure';
              const isSteri = or.status === 'Sterilization';
              const isSched = or.status === 'Scheduled';

              return (
                <div
                  key={or.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isProc ? 'bg-sky-100 text-sky-800' : isSteri ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {or.id}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {or.name} · <span className="font-normal text-slate-500">{or.procedureName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Surgeon: {or.surgeon} · Specialty: {or.specialty}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isProc ? 'bg-sky-100 text-sky-800' : isSteri ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {or.status}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Est. End: {or.estEndTime}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Clinical Staff */}
      {activeSubTab === 'staff' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-bold text-slate-900 text-sm">
              Clinical Staffing Roster (94 Active / 16 Available)
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Coverage Safe
            </span>
          </div>

          <div className="space-y-2">
            {staff.map((person) => (
              <div
                key={person.id}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    {person.name.split(' ')[1]?.[0] || 'S'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {person.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {person.role} · {person.department} ({person.shift} Shift)
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  person.status === 'On Shift'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-sky-50 text-sky-700 border border-sky-200'
                }`}>
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
