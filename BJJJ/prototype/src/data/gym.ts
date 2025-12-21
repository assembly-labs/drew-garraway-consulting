/**
 * Mock Gym Data
 * Academy info, rosters, and owner dashboard data
 */

import type { BeltColor } from './users';

export interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  ownerId: string;
  headCoachId: string;
  coachIds: string[];
  memberCount: number;
  foundedYear: number;
  affiliation?: string;
}

export interface ClassScheduleItem {
  id: string;
  gymId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  className: string;
  type: 'gi' | 'nogi' | 'fundamentals' | 'advanced' | 'kids' | 'competition' | 'openmat';
  instructorId: string;
  instructorName: string;
  maxCapacity?: number;
}

export interface RosterMember {
  id: string;
  name: string;
  belt: BeltColor;
  stripes: number;
  joinDate: string;
  lastAttendance: string;
  attendanceThisMonth: number;
  isActive: boolean;
}

export interface RetentionMetrics {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  churnedThisMonth: number;
  retentionRate: number;
  averageTenure: string;
  atRiskMembers: number;
}

export interface PromotionPipeline {
  belt: BeltColor;
  readyForPromotion: RosterMember[];
  closeToPromotion: RosterMember[];
}

export interface AttendancePattern {
  dayOfWeek: string;
  averageAttendance: number;
  peakClass: string;
}

// ===========================================
// MOCK GYMS
// ===========================================

export const mockGyms: Gym[] = [
  {
    id: 'gym-001',
    name: 'Alliance BJJ Austin',
    address: '1234 Martial Arts Blvd',
    city: 'Austin',
    state: 'TX',
    phone: '(512) 555-0123',
    email: 'info@alliancebjjaustin.com',
    website: 'https://alliancebjjaustin.com',
    ownerId: 'owner-001',
    headCoachId: 'coach-001',
    coachIds: ['coach-001', 'coach-002'],
    memberCount: 147,
    foundedYear: 2015,
    affiliation: 'Alliance Jiu-Jitsu',
  },
  {
    id: 'gym-002',
    name: 'Alliance BJJ South Austin',
    address: '5678 Southern Way',
    city: 'Austin',
    state: 'TX',
    phone: '(512) 555-0456',
    email: 'south@alliancebjjaustin.com',
    ownerId: 'owner-001',
    headCoachId: 'coach-002',
    coachIds: ['coach-002'],
    memberCount: 89,
    foundedYear: 2020,
    affiliation: 'Alliance Jiu-Jitsu',
  },
];

// ===========================================
// CLASS SCHEDULE
// ===========================================

export const mockClassSchedule: ClassScheduleItem[] = [
  // Monday
  { id: 'class-001', gymId: 'gym-001', dayOfWeek: 1, startTime: '06:00', endTime: '07:00', className: 'Morning Fundamentals', type: 'fundamentals', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },
  { id: 'class-002', gymId: 'gym-001', dayOfWeek: 1, startTime: '12:00', endTime: '13:00', className: 'Lunch BJJ', type: 'gi', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-003', gymId: 'gym-001', dayOfWeek: 1, startTime: '18:00', endTime: '19:30', className: 'Evening Gi', type: 'gi', instructorId: 'coach-001', instructorName: 'Ricardo Silva', maxCapacity: 30 },
  { id: 'class-004', gymId: 'gym-001', dayOfWeek: 1, startTime: '19:30', endTime: '20:30', className: 'Advanced', type: 'advanced', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },

  // Tuesday
  { id: 'class-005', gymId: 'gym-001', dayOfWeek: 2, startTime: '06:00', endTime: '07:00', className: 'Morning No-Gi', type: 'nogi', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-006', gymId: 'gym-001', dayOfWeek: 2, startTime: '17:00', endTime: '18:00', className: 'Kids BJJ', type: 'kids', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-007', gymId: 'gym-001', dayOfWeek: 2, startTime: '18:00', endTime: '19:30', className: 'No-Gi', type: 'nogi', instructorId: 'coach-002', instructorName: 'Amanda Foster', maxCapacity: 30 },

  // Wednesday
  { id: 'class-008', gymId: 'gym-001', dayOfWeek: 3, startTime: '06:00', endTime: '07:00', className: 'Morning Fundamentals', type: 'fundamentals', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },
  { id: 'class-009', gymId: 'gym-001', dayOfWeek: 3, startTime: '12:00', endTime: '13:00', className: 'Lunch BJJ', type: 'gi', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },
  { id: 'class-010', gymId: 'gym-001', dayOfWeek: 3, startTime: '18:00', endTime: '19:30', className: 'Evening Gi', type: 'gi', instructorId: 'coach-001', instructorName: 'Ricardo Silva', maxCapacity: 30 },

  // Thursday
  { id: 'class-011', gymId: 'gym-001', dayOfWeek: 4, startTime: '06:00', endTime: '07:00', className: 'Morning No-Gi', type: 'nogi', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-012', gymId: 'gym-001', dayOfWeek: 4, startTime: '17:00', endTime: '18:00', className: 'Kids BJJ', type: 'kids', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-013', gymId: 'gym-001', dayOfWeek: 4, startTime: '18:00', endTime: '19:30', className: 'No-Gi', type: 'nogi', instructorId: 'coach-002', instructorName: 'Amanda Foster', maxCapacity: 30 },
  { id: 'class-014', gymId: 'gym-001', dayOfWeek: 4, startTime: '19:30', endTime: '20:30', className: 'Competition Team', type: 'competition', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },

  // Friday
  { id: 'class-015', gymId: 'gym-001', dayOfWeek: 5, startTime: '06:00', endTime: '07:00', className: 'Morning Fundamentals', type: 'fundamentals', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },
  { id: 'class-016', gymId: 'gym-001', dayOfWeek: 5, startTime: '12:00', endTime: '13:00', className: 'Lunch BJJ', type: 'gi', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-017', gymId: 'gym-001', dayOfWeek: 5, startTime: '18:00', endTime: '19:30', className: 'Open Mat', type: 'openmat', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },

  // Saturday
  { id: 'class-018', gymId: 'gym-001', dayOfWeek: 6, startTime: '10:00', endTime: '11:00', className: 'Kids BJJ', type: 'kids', instructorId: 'coach-002', instructorName: 'Amanda Foster' },
  { id: 'class-019', gymId: 'gym-001', dayOfWeek: 6, startTime: '11:00', endTime: '12:30', className: 'All Levels Gi', type: 'gi', instructorId: 'coach-001', instructorName: 'Ricardo Silva', maxCapacity: 40 },

  // Sunday
  { id: 'class-020', gymId: 'gym-001', dayOfWeek: 0, startTime: '11:00', endTime: '13:00', className: 'Open Mat', type: 'openmat', instructorId: 'coach-001', instructorName: 'Ricardo Silva' },
];

// ===========================================
// ROSTER (Sample)
// ===========================================

export const mockRoster: RosterMember[] = [
  { id: 'user-001', name: 'Marcus Chen', belt: 'blue', stripes: 2, joinDate: '2022-03-15', lastAttendance: '2024-12-20', attendanceThisMonth: 12, isActive: true },
  { id: 'user-002', name: 'Sarah Williams', belt: 'purple', stripes: 1, joinDate: '2019-08-20', lastAttendance: '2024-12-19', attendanceThisMonth: 14, isActive: true },
  { id: 'user-003', name: 'Jake Morrison', belt: 'white', stripes: 3, joinDate: '2024-02-10', lastAttendance: '2024-12-20', attendanceThisMonth: 10, isActive: true },
  { id: 'user-004', name: 'Elena Rodriguez', belt: 'brown', stripes: 0, joinDate: '2017-11-05', lastAttendance: '2024-12-18', attendanceThisMonth: 8, isActive: true },
  { id: 'user-005', name: 'Tommy Nguyen', belt: 'blue', stripes: 4, joinDate: '2021-05-22', lastAttendance: '2024-12-20', attendanceThisMonth: 15, isActive: true },
  { id: 'user-006', name: 'David Park', belt: 'white', stripes: 1, joinDate: '2024-09-01', lastAttendance: '2024-12-15', attendanceThisMonth: 6, isActive: true },
  { id: 'user-007', name: 'Lisa Chang', belt: 'blue', stripes: 0, joinDate: '2023-06-10', lastAttendance: '2024-12-19', attendanceThisMonth: 11, isActive: true },
  { id: 'user-008', name: 'Mike Johnson', belt: 'white', stripes: 4, joinDate: '2023-01-15', lastAttendance: '2024-12-17', attendanceThisMonth: 9, isActive: true },
  { id: 'user-009', name: 'Anna Smith', belt: 'purple', stripes: 3, joinDate: '2018-04-20', lastAttendance: '2024-12-20', attendanceThisMonth: 12, isActive: true },
  { id: 'user-010', name: 'Chris Brown', belt: 'blue', stripes: 1, joinDate: '2022-11-10', lastAttendance: '2024-11-30', attendanceThisMonth: 2, isActive: true },
];

// ===========================================
// OWNER DASHBOARD METRICS
// ===========================================

export const mockRetentionMetrics: RetentionMetrics = {
  totalMembers: 147,
  activeMembers: 132,
  newMembersThisMonth: 8,
  churnedThisMonth: 3,
  retentionRate: 94.5,
  averageTenure: '18 months',
  atRiskMembers: 7,
};

export const mockPromotionPipeline: PromotionPipeline[] = [
  {
    belt: 'blue',
    readyForPromotion: [
      { id: 'user-003', name: 'Jake Morrison', belt: 'white', stripes: 4, joinDate: '2024-02-10', lastAttendance: '2024-12-20', attendanceThisMonth: 10, isActive: true },
      { id: 'user-008', name: 'Mike Johnson', belt: 'white', stripes: 4, joinDate: '2023-01-15', lastAttendance: '2024-12-17', attendanceThisMonth: 9, isActive: true },
    ],
    closeToPromotion: [
      { id: 'user-006', name: 'David Park', belt: 'white', stripes: 1, joinDate: '2024-09-01', lastAttendance: '2024-12-15', attendanceThisMonth: 6, isActive: true },
    ],
  },
  {
    belt: 'purple',
    readyForPromotion: [
      { id: 'user-005', name: 'Tommy Nguyen', belt: 'blue', stripes: 4, joinDate: '2021-05-22', lastAttendance: '2024-12-20', attendanceThisMonth: 15, isActive: true },
    ],
    closeToPromotion: [
      { id: 'user-001', name: 'Marcus Chen', belt: 'blue', stripes: 2, joinDate: '2022-03-15', lastAttendance: '2024-12-20', attendanceThisMonth: 12, isActive: true },
    ],
  },
  {
    belt: 'brown',
    readyForPromotion: [],
    closeToPromotion: [
      { id: 'user-009', name: 'Anna Smith', belt: 'purple', stripes: 3, joinDate: '2018-04-20', lastAttendance: '2024-12-20', attendanceThisMonth: 12, isActive: true },
    ],
  },
];

export const mockAttendancePatterns: AttendancePattern[] = [
  { dayOfWeek: 'Monday', averageAttendance: 28, peakClass: 'Evening Gi' },
  { dayOfWeek: 'Tuesday', averageAttendance: 24, peakClass: 'No-Gi' },
  { dayOfWeek: 'Wednesday', averageAttendance: 26, peakClass: 'Evening Gi' },
  { dayOfWeek: 'Thursday', averageAttendance: 25, peakClass: 'No-Gi' },
  { dayOfWeek: 'Friday', averageAttendance: 22, peakClass: 'Open Mat' },
  { dayOfWeek: 'Saturday', averageAttendance: 32, peakClass: 'All Levels Gi' },
  { dayOfWeek: 'Sunday', averageAttendance: 18, peakClass: 'Open Mat' },
];

// ===========================================
// BELT DISTRIBUTION
// ===========================================

export const mockBeltDistribution = {
  white: 52,
  blue: 48,
  purple: 28,
  brown: 12,
  black: 7,
};
