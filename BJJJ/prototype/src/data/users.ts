/**
 * Mock User Data
 * User types: Practitioner, Coach, Gym Owner
 */

export type BeltColor = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type UserRole = 'practitioner' | 'coach' | 'owner';

export interface UserProfile {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  belt: BeltColor;
  stripes: 0 | 1 | 2 | 3 | 4;
  trainingStartDate: string;
  homeGymId: string;
  affiliatedGymIds: string[];
  weightClass?: string;
  goals?: string[];
  isPrivate: boolean;
}

export interface CoachProfile extends UserProfile {
  role: 'coach';
  credentials: string[];
  lineage: string;
  teachingGyms: string[];
  specialties: string[];
}

export interface GymOwnerProfile extends UserProfile {
  role: 'owner';
  ownedGyms: string[];
}

// ===========================================
// MOCK PRACTITIONERS
// ===========================================

export const mockPractitioners: UserProfile[] = [
  {
    id: 'user-001',
    role: 'practitioner',
    firstName: 'Tony',
    lastName: 'Chen',
    email: 'tony.chen@email.com',
    belt: 'blue',
    stripes: 2,
    trainingStartDate: '2022-03-15',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001'],
    weightClass: 'Medium Heavy (181-195 lbs)',
    goals: ['Compete at IBJJF Worlds', 'Master leg locks', 'Train 4x per week'],
    isPrivate: false,
  },
  {
    id: 'user-002',
    role: 'practitioner',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@email.com',
    belt: 'purple',
    stripes: 1,
    trainingStartDate: '2019-08-20',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001', 'gym-002'],
    weightClass: 'Feather (129-141 lbs)',
    goals: ['Get brown belt by 2025', 'Improve wrestling'],
    isPrivate: false,
  },
  {
    id: 'user-003',
    role: 'practitioner',
    firstName: 'Jake',
    lastName: 'Morrison',
    email: 'jake.m@email.com',
    belt: 'white',
    stripes: 3,
    trainingStartDate: '2024-02-10',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001'],
    weightClass: 'Heavy (195-209 lbs)',
    goals: ['Earn blue belt', 'Learn basic submissions'],
    isPrivate: true,
  },
  {
    id: 'user-004',
    role: 'practitioner',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    email: 'elena.r@email.com',
    belt: 'brown',
    stripes: 0,
    trainingStartDate: '2017-11-05',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001'],
    weightClass: 'Light (141-154 lbs)',
    goals: ['Compete more in no-gi', 'Develop teaching skills'],
    isPrivate: false,
  },
  {
    id: 'user-005',
    role: 'practitioner',
    firstName: 'Tommy',
    lastName: 'Nguyen',
    email: 'tommy.n@email.com',
    belt: 'blue',
    stripes: 4,
    trainingStartDate: '2021-05-22',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001'],
    weightClass: 'Rooster (127 lbs and under)',
    goals: ['Purple belt promotion', 'Win local tournament'],
    isPrivate: false,
  },
];

// ===========================================
// MOCK COACHES
// ===========================================

export const mockCoaches: CoachProfile[] = [
  {
    id: 'coach-001',
    role: 'coach',
    firstName: 'Ricardo',
    lastName: 'Silva',
    email: 'ricardo.silva@bjjgym.com',
    belt: 'black',
    stripes: 3,
    trainingStartDate: '2005-06-15',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001'],
    credentials: ['3rd Degree Black Belt', 'IBJJF Certified Referee', 'Pan American Champion 2012'],
    lineage: 'Helio Gracie → Rickson Gracie → Jean Jacques Machado → Ricardo Silva',
    teachingGyms: ['gym-001'],
    specialties: ['Guard passing', 'Submissions from mount', 'Competition strategy'],
    isPrivate: false,
  },
  {
    id: 'coach-002',
    role: 'coach',
    firstName: 'Amanda',
    lastName: 'Foster',
    email: 'amanda.f@bjjgym.com',
    belt: 'black',
    stripes: 1,
    trainingStartDate: '2010-09-01',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001', 'gym-002'],
    credentials: ['1st Degree Black Belt', 'World No-Gi Champion 2019'],
    lineage: 'Helio Gracie → Carlson Gracie → Ricardo Liborio → Amanda Foster',
    teachingGyms: ['gym-001', 'gym-002'],
    specialties: ['No-gi grappling', 'Leg locks', 'Women\'s self-defense'],
    isPrivate: false,
  },
];

// ===========================================
// MOCK GYM OWNERS
// ===========================================

export const mockGymOwners: GymOwnerProfile[] = [
  {
    id: 'owner-001',
    role: 'owner',
    firstName: 'Daniel',
    lastName: 'Park',
    email: 'daniel.park@bjjgym.com',
    belt: 'black',
    stripes: 2,
    trainingStartDate: '2003-01-10',
    homeGymId: 'gym-001',
    affiliatedGymIds: ['gym-001'],
    ownedGyms: ['gym-001', 'gym-002'],
    isPrivate: false,
  },
];

// ===========================================
// CURRENT USER (for prototype)
// ===========================================

export const currentUser = mockPractitioners[0]; // Tony Chen - Blue belt 2 stripe
