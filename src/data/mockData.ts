import { HospitalFacility, DayForecast, ProtocolIntervention, BedItem, OperatingTheater, StaffMember, OperationalAlert } from '../types/hospital';

export const initialFacility: HospitalFacility = {
  id: 'metro-general',
  name: 'Metro General Health',
  totalBeds: 160,
  icuBeds: 40,
  inpatientOccupied: 128, // 128/160 = 80%
  icuOccupied: 32,        // 32/40 = 80%
  operatingTheatersTotal: 10,
  operatingTheatersActive: 7, // 7/10 = 70%
  staffTotal: 110,
  staffActive: 94,        // 94/110, 16 available
  lastUpdated: '10:42 AM',
};

export const alternateFacilities: HospitalFacility[] = [
  initialFacility,
  {
    id: 'westside-memorial',
    name: 'Westside Memorial Trauma Center',
    totalBeds: 220,
    icuBeds: 54,
    inpatientOccupied: 198,
    icuOccupied: 47,
    operatingTheatersTotal: 14,
    operatingTheatersActive: 11,
    staffTotal: 160,
    staffActive: 142,
    lastUpdated: '10:42 AM',
  },
  {
    id: 'st-jude-regional',
    name: 'St. Jude Regional Pavilion',
    totalBeds: 130,
    icuBeds: 28,
    inpatientOccupied: 91,
    icuOccupied: 19,
    operatingTheatersTotal: 8,
    operatingTheatersActive: 5,
    staffTotal: 85,
    staffActive: 72,
    lastUpdated: '10:42 AM',
  }
];

export const initial7DayForecast: DayForecast[] = [
  {
    day: 'Monday',
    dayShort: 'M',
    dateStr: 'Sep 27',
    intake: 142,
    isToday: false,
    isSurgeAlert: false,
    icuProjected: 24,
    edArrivals: 88,
    electiveSurgical: 36,
    directTransfers: 18,
  },
  {
    day: 'Tuesday',
    dayShort: 'T',
    dateStr: 'Sep 28',
    intake: 156,
    isToday: false,
    isSurgeAlert: false,
    icuProjected: 27,
    edArrivals: 94,
    electiveSurgical: 42,
    directTransfers: 20,
  },
  {
    day: 'Wednesday',
    dayShort: 'W',
    dateStr: 'Sep 29',
    intake: 164,
    isToday: false,
    isSurgeAlert: false,
    icuProjected: 29,
    edArrivals: 102,
    electiveSurgical: 41,
    directTransfers: 21,
  },
  {
    day: 'Thursday',
    dayShort: 'T',
    dateStr: 'Sep 30',
    intake: 178,
    isToday: true,
    isSurgeAlert: false,
    icuProjected: 32,
    edArrivals: 114,
    electiveSurgical: 38,
    directTransfers: 26,
  },
  {
    day: 'Friday',
    dayShort: 'F',
    dateStr: 'Oct 01',
    intake: 190,
    isToday: false,
    isSurgeAlert: true,
    icuProjected: 36,
    edArrivals: 122,
    electiveSurgical: 40,
    directTransfers: 28,
  },
  {
    day: 'Saturday',
    dayShort: 'S',
    dateStr: 'Oct 02',
    intake: 204,
    isToday: false,
    isSurgeAlert: true,
    icuProjected: 39,
    edArrivals: 146,
    electiveSurgical: 22,
    directTransfers: 36,
  },
  {
    day: 'Sunday',
    dayShort: 'S',
    dateStr: 'Oct 03',
    intake: 210,
    isToday: false,
    isSurgeAlert: true,
    icuProjected: 41,
    edArrivals: 152,
    electiveSurgical: 18,
    directTransfers: 40,
  },
];

export const initialProtocolInterventions: ProtocolIntervention[] = [
  {
    id: 'proto-1',
    title: 'Reallocate eligible step-down beds',
    description: 'Transition 4 stabilized telemetry patients to Ward C.',
    category: 'bed',
    impact: 'Frees 4 ICU beds immediately',
    checked: true,
    applied: false,
  },
  {
    id: 'proto-2',
    title: 'Adjust trained nursing capacity',
    description: 'Call in 2 on-call critical care nurses for Saturday swing shift.',
    category: 'nursing',
    impact: 'Supports 4 additional high-acuity ventilator bays',
    checked: true,
    applied: false,
  },
  {
    id: 'proto-3',
    title: 'Preserve emergency bed reserve',
    description: 'Halt elective post-op ICU admissions scheduled after 14:00.',
    category: 'elective',
    impact: 'Preserves 3 buffer beds for emergent triage & trauma admissions',
    checked: true,
    applied: false,
  },
];

// Generate 40 ICU beds
export const initialIcuBeds: BedItem[] = Array.from({ length: 40 }, (_, i) => {
  const bedNum = `ICU-${(i + 1).toString().padStart(2, '0')}`;
  
  // 32 occupied, 4 step-down ready, 2 cleaning, 2 available (total 40)
  let status: BedItem['status'] = 'occupied';
  let patientAcuity: BedItem['patientAcuity'] = 'Critical';
  let resp: BedItem['respiratorySupport'] = 'Ventilator';

  if (i < 4) {
    status = 'step-down-ready';
    patientAcuity = 'Stable';
    resp = 'Nasal Cannula';
  } else if (i < 32) {
    status = 'occupied';
    patientAcuity = i % 3 === 0 ? 'Critical' : 'Telemetry';
    resp = i % 2 === 0 ? 'Ventilator' : 'BiPAP';
  } else if (i < 36) {
    status = 'occupied';
    patientAcuity = 'Telemetry';
    resp = 'Nasal Cannula';
  } else if (i < 38) {
    status = 'cleaning';
    patientAcuity = undefined;
    resp = 'None';
  } else {
    status = 'available';
    patientAcuity = undefined;
    resp = 'None';
  }

  return {
    id: `bed-${i + 1}`,
    bedNumber: bedNum,
    ward: 'ICU',
    status,
    patientId: status === 'available' || status === 'cleaning' ? undefined : `PT-${94200 + i}`,
    patientAge: 42 + (i * 3) % 45,
    patientAcuity,
    admissionHoursAgo: 6 + (i * 7) % 84,
    respiratorySupport: resp,
    doctor: ['Dr. Lin (Intensivist)', 'Dr. Vance (Cardiology)', 'Dr. Aris (Trauma)', 'Dr. Patel (Pulm)'][i % 4],
  };
});

// Step-down candidates to Ward C
export const stepDownCandidates = initialIcuBeds.filter(b => b.status === 'step-down-ready');

export const operatingTheatersList: OperatingTheater[] = [
  { id: 1, name: 'OR 1 (Cardiac)', status: 'In Procedure', specialty: 'Cardiothoracic', procedureName: 'Coronary Artery Bypass', surgeon: 'Dr. C. Sterling', estEndTime: '12:30 PM' },
  { id: 2, name: 'OR 2 (Neuro)', status: 'In Procedure', specialty: 'Neurosurgery', procedureName: 'Craniotomy Decompression', surgeon: 'Dr. E. Thorne', estEndTime: '13:15 PM' },
  { id: 3, name: 'OR 3 (Trauma)', status: 'In Procedure', specialty: 'Trauma & Acute', procedureName: 'Exploratory Laparotomy', surgeon: 'Dr. M. Brooks', estEndTime: '11:45 AM' },
  { id: 4, name: 'OR 4 (Ortho)', status: 'In Procedure', specialty: 'Orthopedics', procedureName: 'Total Hip Arthroplasty', surgeon: 'Dr. S. Miller', estEndTime: '14:00 PM' },
  { id: 5, name: 'OR 5 (Vascular)', status: 'In Procedure', specialty: 'Vascular', procedureName: 'Endovascular Aneurysm Repair', surgeon: 'Dr. K. Zhang', estEndTime: '13:45 PM' },
  { id: 6, name: 'OR 6 (General)', status: 'In Procedure', specialty: 'General Surgery', procedureName: 'Laparoscopic Cholecystectomy', surgeon: 'Dr. H. Lopez', estEndTime: '11:15 AM' },
  { id: 7, name: 'OR 7 (Transplant)', status: 'In Procedure', specialty: 'Renal', procedureName: 'Living Donor Kidney Harvest', surgeon: 'Dr. W. Adams', estEndTime: '15:30 PM' },
  { id: 8, name: 'OR 8 (Spine)', status: 'Sterilization', specialty: 'Spinal', procedureName: 'Turnaround Sanitation', surgeon: 'Room Prep Team', estEndTime: '11:30 AM' },
  { id: 9, name: 'OR 9 (Day Surgery)', status: 'Scheduled', specialty: 'ENT', procedureName: 'Tympanoplasty (Starts 13:00)', surgeon: 'Dr. T. Harris', estEndTime: '14:15 PM' },
  { id: 10, name: 'OR 10 (Emergency Buffer)', status: 'Available', specialty: 'Emergency Acute', procedureName: 'Standby for Code Red Intake', surgeon: 'On-Call Surgical Team', estEndTime: 'Ready' },
];

export const staffRoster: StaffMember[] = [
  { id: 'st-1', name: 'Nurse Rachel Kim, BSN, CCRN', role: 'Charge Nurse', department: 'ICU', status: 'On Shift', shift: 'Day' },
  { id: 'st-2', name: 'Nurse David Morales, RN', role: 'Critical Care RN', department: 'ICU', status: 'On Shift', shift: 'Day' },
  { id: 'st-3', name: 'Nurse Elena Rostova, RN', role: 'Critical Care RN', department: 'ICU', status: 'On Shift', shift: 'Day' },
  { id: 'st-4', name: 'Nurse Marcus Washington, RN', role: 'Critical Care RN', department: 'ICU', status: 'On Shift', shift: 'Day' },
  { id: 'st-5', name: 'Nurse Sarah Jenkins, RN', role: 'Critical Care RN', department: 'ICU', status: 'On Call', shift: 'Swing' },
  { id: 'st-6', name: 'Nurse Andrew Chen, BSN', role: 'Critical Care RN', department: 'ICU', status: 'On Call', shift: 'Swing' },
  { id: 'st-7', name: 'Dr. Maya Lin, MD', role: 'Intensivist', department: 'ICU', status: 'On Shift', shift: 'Day' },
  { id: 'st-8', name: 'Patrick O’Connor, RRT', role: 'Respiratory Therapist', department: 'ICU', status: 'On Shift', shift: 'Day' },
  { id: 'st-9', name: 'Dr. Arthur Vance, MD', role: 'Hospitalist', department: 'Step-Down', status: 'On Shift', shift: 'Day' },
  { id: 'st-10', name: 'Nurse Linda Foster, RN', role: 'Charge Nurse', department: 'Step-Down', status: 'On Shift', shift: 'Day' },
];

export const initialAlerts: OperationalAlert[] = [
  {
    id: 'alt-1',
    timestamp: '10:38 AM',
    severity: 'critical',
    title: 'ICU Capacity High Surge Warning',
    message: 'Active occupancy reached 80% (32/40 beds). Weekend forecast model indicates saturation threshold exceeded within 48h.',
    location: 'Intensive Care Unit (Pod A & B)',
    acknowledged: false,
    suggestedAction: 'Execute Step-down protocol for 4 telemetry patients.',
  },
  {
    id: 'alt-2',
    timestamp: '10:20 AM',
    severity: 'warning',
    title: 'Critical Care Staffing Buffer Thinning',
    message: 'Saturday swing shift nurse-to-patient ratio approaching 1:2.8 threshold if ICU admissions spike by >3.',
    location: 'Clinical Operations - Staffing Office',
    acknowledged: false,
    suggestedAction: 'Activate 2 on-call critical care nurses.',
  },
  {
    id: 'alt-3',
    timestamp: '09:45 AM',
    severity: 'warning',
    title: 'Elective Post-Op ICU Reservation Conflict',
    message: '3 elective surgeries scheduled this afternoon require post-op ICU monitoring.',
    location: 'Surgical Suite 4 & 5',
    acknowledged: true,
    suggestedAction: 'Defer non-emergent post-op ICU admissions after 14:00.',
  },
  {
    id: 'alt-4',
    timestamp: '08:15 AM',
    severity: 'info',
    title: 'Ward C Step-Down Bed Sanitation Complete',
    message: '6 step-down telemetry beds in Ward C sanitized, inspected, and primed for immediate intake.',
    location: 'Ward C (West Wing)',
    acknowledged: true,
  },
];
