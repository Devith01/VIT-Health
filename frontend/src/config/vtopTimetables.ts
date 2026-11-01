export interface VtopSlot {
  slotCode: string;
  courseCode?: string;
  courseTitle?: string;
  venue?: string;
  isRegistered: boolean;
  timeRange: string; // e.g. "08:30 - 10:00"
}

export interface DaySchedule {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  slots: Record<string, VtopSlot>; // key: timeRange e.g. "08:30 - 10:00"
}

export interface StudentVtopTimetable {
  studentId: string;
  studentName: string;
  registrationNo: string;
  branch: string;
  semester: string;
  weeklySchedule: Record<string, Record<string, VtopSlot>>; // day -> timeRange -> slot
}

export const VTOP_TIME_SLOTS = [
  { range: '08:30 - 10:00', label: '08:30 AM - 10:00 AM', timeVal: '08:30' },
  { range: '10:05 - 11:35', label: '10:05 AM - 11:35 AM', timeVal: '10:05' },
  { range: '11:40 - 13:10', label: '11:40 AM - 01:10 PM', timeVal: '11:40' },
  { range: '13:15 - 14:45', label: '01:15 PM - 02:45 PM', timeVal: '13:15' },
  { range: '14:50 - 16:20', label: '02:50 PM - 04:20 PM', timeVal: '14:50' },
  { range: '16:25 - 17:55', label: '04:25 PM - 05:55 PM', timeVal: '16:25' },
  { range: '18:00 - 19:30', label: '06:00 PM - 07:30 PM', timeVal: '18:00' },
];

export const VTOP_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

// 1. Aarav Patel (3rd Year CSE - Registration: 21BCE1001)
const AARAV_PATEL_TIMETABLE: StudentVtopTimetable = {
  studentId: 'user-std-1',
  studentName: 'Aarav Patel',
  registrationNo: '21BCE1001',
  branch: 'Computer Science & Engineering',
  semester: 'Semester 5',
  weeklySchedule: {
    MON: {
      '08:30 - 10:00': { slotCode: 'A11', courseCode: 'CSA2001', courseTitle: 'Data Structures', venue: 'AB02-104', isRegistered: true, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'B11', isRegistered: false, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'C11', courseCode: 'SST1003', courseTitle: 'Soft Skills Lab', venue: 'AB-007', isRegistered: true, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'A21', courseCode: 'CSE2002', courseTitle: 'Operating Systems', venue: 'AB02-408', isRegistered: true, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'A14', courseCode: 'ECE2002', courseTitle: 'Digital Logic', venue: 'AB-314', isRegistered: true, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'B21', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'C21', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    TUE: {
      '08:30 - 10:00': { slotCode: 'D11', courseCode: 'ECE2002', courseTitle: 'Digital Logic', venue: 'AB-314', isRegistered: true, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'E11', courseCode: 'MAT2002', courseTitle: 'Discrete Math', venue: 'AB-218', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'F11', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'D21', courseCode: 'HUM1012', courseTitle: 'Ethics & Values', venue: 'AB02-301', isRegistered: true, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'E14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'E21', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'F21', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    WED: {
      '08:30 - 10:00': { slotCode: 'A12', courseCode: 'CSA2001', courseTitle: 'Data Structures', venue: 'AB02-104', isRegistered: true, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'B12', isRegistered: false, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'C12', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'A22', courseCode: 'CSE2002', courseTitle: 'Operating Systems', venue: 'AB02-408', isRegistered: true, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'B14', courseCode: 'HUM1012', courseTitle: 'Ethics & Values', venue: 'AB02-301', isRegistered: true, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'B22', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'A24', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    THU: {
      '08:30 - 10:00': { slotCode: 'D12', courseCode: 'ECE2002', courseTitle: 'Digital Logic', venue: 'AB-314', isRegistered: true, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'E12', courseCode: 'MAT2002', courseTitle: 'Discrete Math', venue: 'AB-218', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'F12', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'D22', courseCode: 'HUM0003', courseTitle: 'Environmental Studies', venue: 'CR-001', isRegistered: true, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'F14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'E22', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'F22', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    FRI: {
      '08:30 - 10:00': { slotCode: 'A13', courseCode: 'CSA2001', courseTitle: 'Data Structures', venue: 'AB02-104', isRegistered: true, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'B13', isRegistered: false, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'C13', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'A23', courseCode: 'CSE2002', courseTitle: 'Operating Systems', venue: 'AB02-408', isRegistered: true, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'C14', courseCode: 'MAT2002', courseTitle: 'Discrete Math', venue: 'AB-218', isRegistered: true, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'B23', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'B24', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    SAT: {
      '08:30 - 10:00': { slotCode: 'D13', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'E13', isRegistered: false, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'F13', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'D23', isRegistered: false, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'D14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'D24', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'E23', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
  },
};

// 2. Rohan Sharma (2nd Year ECE - Registration: 22BEC1044)
const ROHAN_SHARMA_TIMETABLE: StudentVtopTimetable = {
  studentId: 'user-ece-2',
  studentName: 'Rohan Sharma',
  registrationNo: '22BEC1044',
  branch: 'Electronics & Communication Engineering',
  semester: 'Semester 3',
  weeklySchedule: {
    MON: {
      '08:30 - 10:00': { slotCode: 'A11', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'B11', courseCode: 'EEE1001', courseTitle: 'Basic Electrical Eng', venue: 'AB-313', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'C11', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'A21', isRegistered: false, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'A14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'B21', courseCode: 'CHI1001', courseTitle: 'Mandarin Chinese', venue: 'AB02-224', isRegistered: true, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'C21', courseCode: 'MAT3003', courseTitle: 'Complex Variables', venue: 'AB-128', isRegistered: true, timeRange: '18:00 - 19:30' },
    },
    TUE: {
      '08:30 - 10:00': { slotCode: 'D11', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'E11', courseCode: 'CHI2001', courseTitle: 'Chinese II Lab', venue: 'AB02-017', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'F11', courseCode: 'MAT3003', courseTitle: 'Complex Variables', venue: 'AB-128', isRegistered: true, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'D21', isRegistered: false, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'E14', courseCode: 'CHI1001', courseTitle: 'Mandarin Chinese', venue: 'AB02-224', isRegistered: true, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'E21', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'F21', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    WED: {
      '08:30 - 10:00': { slotCode: 'A12', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'B12', courseCode: 'EEE1001', courseTitle: 'Basic Electrical Eng', venue: 'AB-313', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'C12', courseCode: 'HUM0003', courseTitle: 'Environmental Science', venue: 'CR-001', isRegistered: true, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'A22', isRegistered: false, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'B14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'B22', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'A24', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    THU: {
      '08:30 - 10:00': { slotCode: 'D12', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'E12', courseCode: 'CHI2001', courseTitle: 'Chinese II Lab', venue: 'AB02-017', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'F12', courseCode: 'MAT3003', courseTitle: 'Complex Variables', venue: 'AB-128', isRegistered: true, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'D22', isRegistered: false, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'F14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'E22', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'F22', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    FRI: {
      '08:30 - 10:00': { slotCode: 'A13', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'B13', courseCode: 'EEE1001', courseTitle: 'Basic Electrical Eng', venue: 'AB-313', isRegistered: true, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'C13', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'A23', courseCode: 'ENG2005', courseTitle: 'Technical Writing', venue: 'AB-313', isRegistered: true, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'C14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'B23', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'B24', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
    SAT: {
      '08:30 - 10:00': { slotCode: 'D13', isRegistered: false, timeRange: '08:30 - 10:00' },
      '10:05 - 11:35': { slotCode: 'E13', isRegistered: false, timeRange: '10:05 - 11:35' },
      '11:40 - 13:10': { slotCode: 'F13', isRegistered: false, timeRange: '11:40 - 13:10' },
      '13:15 - 14:45': { slotCode: 'D23', isRegistered: false, timeRange: '13:15 - 14:45' },
      '14:50 - 16:20': { slotCode: 'D14', isRegistered: false, timeRange: '14:50 - 16:20' },
      '16:25 - 17:55': { slotCode: 'D24', isRegistered: false, timeRange: '16:25 - 17:55' },
      '18:00 - 19:30': { slotCode: 'E23', isRegistered: false, timeRange: '18:00 - 19:30' },
    },
  },
};

export const DEMO_STUDENT_TIMETABLES: Record<string, StudentVtopTimetable> = {
  'user-std-1': AARAV_PATEL_TIMETABLE,
  'user-ece-2': ROHAN_SHARMA_TIMETABLE,
  default: AARAV_PATEL_TIMETABLE,
};

export function getStudentTimetable(studentId?: string): StudentVtopTimetable {
  if (studentId && DEMO_STUDENT_TIMETABLES[studentId]) {
    return DEMO_STUDENT_TIMETABLES[studentId];
  }
  return AARAV_PATEL_TIMETABLE;
}

/**
 * Checks if a specific day & time slot is BUSY with a VTOP class for a student
 */
export function isClassConflict(
  studentId: string | undefined,
  dayStr: string, // e.g. "MON"
  timeSlotVal: string // e.g. "08:30" or "10:05"
): { hasConflict: boolean; classInfo?: VtopSlot } {
  const timetable = getStudentTimetable(studentId);
  const dayUpper = dayStr.toUpperCase().slice(0, 3) as 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

  const daySchedule = timetable.weeklySchedule[dayUpper];
  if (!daySchedule) return { hasConflict: false };

  for (const timeRange in daySchedule) {
    const slot = daySchedule[timeRange];
    if (slot.isRegistered) {
      if (timeRange.startsWith(timeSlotVal) || (timeSlotVal === '09:30' && timeRange.startsWith('08:30')) || (timeSlotVal === '10:00' && timeRange.startsWith('10:05')) || (timeSlotVal === '11:00' && timeRange.startsWith('10:05')) || (timeSlotVal === '14:30' && timeRange.startsWith('13:15')) || (timeSlotVal === '16:00' && timeRange.startsWith('14:50'))) {
        return { hasConflict: true, classInfo: slot };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * AI Auto-Scheduler: Finds the earliest available non-conflicting time slot for student & doctor
 */
export function findBestAutoSlot(
  studentId: string | undefined,
  dayStr: string // e.g. "MON"
): { recommendedSlot: string; timeRange: string; reason: string } {
  const timetable = getStudentTimetable(studentId);
  const dayUpper = dayStr.toUpperCase().slice(0, 3) as 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  const daySchedule = timetable.weeklySchedule[dayUpper] || {};

  // Available candidate doctor OPD time slots
  const candidates = [
    { timeVal: '10:05', range: '10:05 - 11:35' },
    { timeVal: '11:40', range: '11:40 - 13:10' },
    { timeVal: '13:15', range: '13:15 - 14:45' },
    { timeVal: '14:50', range: '14:50 - 16:20' },
    { timeVal: '16:25', range: '16:25 - 17:55' },
    { timeVal: '18:00', range: '18:00 - 19:30' },
  ];

  for (const c of candidates) {
    const slot = daySchedule[c.range];
    if (!slot || !slot.isRegistered) {
      return {
        recommendedSlot: c.timeVal,
        timeRange: c.range,
        reason: `AI Selected: VTOP Verified Open Slot (${c.range}) on ${dayUpper}. No registered theory/lab classes.`,
      };
    }
  }

  // Fallback if all busy
  return {
    recommendedSlot: '16:25',
    timeRange: '16:25 - 17:55',
    reason: `AI Selected: Post-class OPD hour (${dayUpper} 04:25 PM).`,
  };
}
