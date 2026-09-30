export interface HospitalFacility {
  id: string;
  name: string;
  totalBeds: number;
  icuBeds: number;
  inpatientOccupied: number;
  icuOccupied: number;
  operatingTheatersTotal: number;
  operatingTheatersActive: number;
  staffTotal: number;
  staffActive: number;
  lastUpdated: string;
}

export interface DayForecast {
  day: string;
  dayShort: string;
  dateStr: string;
  intake: number;
  isToday: boolean;
  isSurgeAlert: boolean;
  icuProjected: number;
  edArrivals: number;
  electiveSurgical: number;
  directTransfers: number;
}

export interface ProtocolIntervention {
  id: string;
  title: string;
  description: string;
  category: 'bed' | 'nursing' | 'elective';
  impact: string;
  checked: boolean;
  applied?: boolean;
}

export interface BedItem {
  id: string;
  bedNumber: string;
  ward: 'ICU' | 'Step-Down (Ward C)' | 'Inpatient (Ward A)' | 'Inpatient (Ward B)';
  status: 'occupied' | 'step-down-ready' | 'cleaning' | 'available' | 'reserved';
  patientId?: string;
  patientAge?: number;
  patientAcuity?: 'Critical' | 'Stable' | 'Telemetry' | 'Discharge Ready';
  admissionHoursAgo?: number;
  respiratorySupport?: 'Ventilator' | 'BiPAP' | 'Nasal Cannula' | 'None';
  doctor?: string;
}

export interface OperatingTheater {
  id: number;
  name: string;
  status: 'In Procedure' | 'Sterilization' | 'Scheduled' | 'Available';
  specialty: string;
  procedureName: string;
  surgeon: string;
  estEndTime: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Critical Care RN' | 'Charge Nurse' | 'Intensivist' | 'Respiratory Therapist' | 'Hospitalist';
  department: 'ICU' | 'Step-Down' | 'Inpatient' | 'Emergency';
  status: 'On Shift' | 'On Call' | 'Break';
  shift: 'Day' | 'Swing' | 'Night';
}

export interface OperationalAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  location: string;
  acknowledged: boolean;
  suggestedAction?: string;
}

export interface SimulationParams {
  patientInfluxDelta: number; // percentage (-30% to +50%)
  nurseStaffingDelta: number; // percentage (-30% to +30%)
  haltElectiveSurgeries: boolean;
  massCasualtyDrill: boolean;
  respiratoryOutbreak: boolean;
}
