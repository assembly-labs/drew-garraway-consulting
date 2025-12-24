/**
 * Alliance BJJ App - Mock Data
 * Single source of truth for all prototype/demo data
 *
 * When updating mock data for design iterations, only modify this file.
 * All screens import from here to ensure consistency.
 */

// =============================================================================
// MEMBER DATA
// =============================================================================

export const currentMember = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '(610) 555-0198',
  memberId: 'ALB-2023-1156',
  profileImage: null,

  // Belt/rank info
  belt: 'Blue Belt',
  beltColor: 'Blue',
  stripes: 3,
  nextBelt: 'Purple Belt',
  progressPercentage: 75,
  timeInBelt: '18 months',

  // Membership info
  memberSince: '2023-01-15',
  memberSinceFormatted: 'January 2023',
  membershipStatus: 'Active',

  // Gym info
  gym: {
    name: 'Alliance BJJ Paoli',
    shortName: 'Paoli',
    address: '123 Main Street, Paoli, PA 19301',
  },

  // Emergency contact
  emergencyContact: {
    name: 'Jane Smith',
    phone: '(610) 555-0199',
    relationship: 'Spouse',
  },
};

// =============================================================================
// MEMBERSHIP & BILLING
// =============================================================================

export const membershipInfo = {
  plan: 'Unlimited Monthly',
  amount: '$159.00',
  nextBillingDate: 'December 1, 2024',
  status: 'Active',
  paymentMethod: {
    type: 'Visa',
    last4: '4242',
    display: 'Visa ending in 4242',
  },
};

export const paymentHistory = [
  {
    id: 1,
    date: 'November 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
    status: 'Paid',
    method: 'Visa ****4242',
    invoiceNumber: 'INV-2024-11-001',
  },
  {
    id: 2,
    date: 'October 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
    status: 'Paid',
    method: 'Visa ****4242',
    invoiceNumber: 'INV-2024-10-001',
  },
  {
    id: 3,
    date: 'September 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
    status: 'Paid',
    method: 'Visa ****4242',
    invoiceNumber: 'INV-2024-09-001',
  },
  {
    id: 4,
    date: 'August 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
    status: 'Paid',
    method: 'Visa ****4242',
    invoiceNumber: 'INV-2024-08-001',
  },
  {
    id: 5,
    date: 'July 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
    status: 'Paid',
    method: 'Visa ****4242',
    invoiceNumber: 'INV-2024-07-001',
  },
  {
    id: 6,
    date: 'June 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
    status: 'Paid',
    method: 'Visa ****4242',
    invoiceNumber: 'INV-2024-06-001',
  },
];

export const upcomingCharges = [
  {
    id: 1,
    date: 'December 1, 2024',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
  },
  {
    id: 2,
    date: 'January 1, 2025',
    amount: '$159.00',
    description: 'Monthly Membership - Unlimited',
  },
];

// =============================================================================
// TRAINING STATS
// =============================================================================

export const trainingStats = {
  // Current period
  classesThisMonth: 12,
  classesLastMonth: 15,
  avgPerMonth: 13,

  // Totals
  totalClasses: 156,

  // Streaks
  currentStreak: 4,
  longestStreak: 12,

  // Weekly
  weeklyClasses: 3,
};

// =============================================================================
// PROGRESS & TECHNIQUES
// =============================================================================

export const techniques = [
  { id: 1, name: 'Guard Passes', mastered: 8, total: 12, percentage: 67 },
  { id: 2, name: 'Submissions', mastered: 10, total: 15, percentage: 67 },
  { id: 3, name: 'Sweeps', mastered: 6, total: 10, percentage: 60 },
  { id: 4, name: 'Escapes', mastered: 7, total: 10, percentage: 70 },
  { id: 5, name: 'Takedowns', mastered: 4, total: 8, percentage: 50 },
];

export const milestones = [
  {
    id: 1,
    title: 'Earned 3rd Stripe',
    date: 'November 15, 2024',
    description: 'Demonstrated improved guard passing',
  },
  {
    id: 2,
    title: 'First Competition',
    date: 'October 5, 2024',
    description: 'Silver medal at local tournament',
  },
  {
    id: 3,
    title: '100 Classes',
    date: 'August 20, 2024',
    description: 'Reached 100 total classes',
  },
  {
    id: 4,
    title: 'Earned Blue Belt',
    date: 'June 1, 2024',
    description: 'Promoted from White to Blue Belt',
  },
];

// =============================================================================
// SCHEDULE & CLASSES
// =============================================================================

export const scheduleDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const classFilters = ['All', 'Fundamentals', 'Advanced', 'No-Gi', 'Open Mat'];

export const scheduleClasses = [
  {
    id: 1,
    name: 'Fundamentals',
    instructor: 'Professor Mike',
    time: '6:00 AM - 7:00 AM',
    level: 'All Levels',
    spots: 15,
    totalSpots: 20,
    spotsDisplay: '15 spots available',
    type: 'Fundamentals',
    location: 'Main Mat',
    duration: '60 minutes',
  },
  {
    id: 2,
    name: 'Advanced Gi',
    instructor: 'Professor Sarah',
    time: '12:00 PM - 1:30 PM',
    level: 'Blue Belt+',
    spots: 12,
    totalSpots: 20,
    spotsDisplay: '12 spots available',
    type: 'Advanced',
    location: 'Main Mat',
    duration: '90 minutes',
  },
  {
    id: 3,
    name: 'Fundamentals',
    instructor: 'Coach Dave',
    time: '4:00 PM - 5:00 PM',
    level: 'All Levels',
    spots: 20,
    totalSpots: 20,
    spotsDisplay: '20 spots available',
    type: 'Fundamentals',
    location: 'Main Mat',
    duration: '60 minutes',
  },
  {
    id: 4,
    name: 'No-Gi',
    instructor: 'Professor Mike',
    time: '6:00 PM - 7:30 PM',
    level: 'All Levels',
    spots: 18,
    totalSpots: 20,
    spotsDisplay: '18 spots available',
    type: 'No-Gi',
    location: 'Main Mat',
    duration: '90 minutes',
  },
  {
    id: 5,
    name: 'Competition Training',
    instructor: 'Professor Sarah',
    time: '7:30 PM - 9:00 PM',
    level: 'Advanced',
    spots: 10,
    totalSpots: 15,
    spotsDisplay: '10 spots available',
    type: 'Advanced',
    location: 'Competition Area',
    duration: '90 minutes',
  },
];

// Today's classes for check-in screen
export const todayClasses = [
  {
    id: 1,
    name: 'Fundamentals',
    time: '6:00 AM',
    instructor: 'Professor Mike',
    type: 'Gi',
    isAvailable: false, // Past
  },
  {
    id: 2,
    name: 'No-Gi',
    time: '6:00 PM',
    instructor: 'Professor Mike',
    type: 'No-Gi',
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Competition Training',
    time: '7:30 PM',
    instructor: 'Professor Sarah',
    type: 'No-Gi',
    isAvailable: true,
  },
];

// Next class for home screen
export const nextClass = {
  id: 4,
  name: 'Fundamentals',
  instructor: 'Professor Mike',
  time: 'Today, 6:00 PM',
  location: 'Main Mat',
  type: 'Gi',
};

// =============================================================================
// CLASS DETAILS (for detail view)
// =============================================================================

export const classDetailExample = {
  id: 1,
  name: 'Fundamentals',
  instructor: 'Professor Mike',
  time: '6:00 PM - 7:30 PM',
  date: 'Wednesday, November 27',
  level: 'All Levels',
  spots: 18,
  totalSpots: 20,
  location: 'Main Mat',
  duration: '90 minutes',
  description:
    'This fundamentals class covers essential BJJ techniques including guard work, passing, submissions, and escapes. Perfect for beginners and experienced practitioners alike.',
  requirements: [
    'Gi required',
    'Arrive 10 minutes early',
    'Trim fingernails and toenails',
    'Remove all jewelry',
  ],
  focusAreas: [
    'Guard retention',
    'Basic sweeps',
    'Fundamental submissions',
    'Positional escapes',
  ],
};

// =============================================================================
// INSTRUCTORS
// =============================================================================

export const instructors = {
  professorMike: {
    id: 1,
    name: 'Professor Mike',
    rank: 'Black Belt, 3rd Degree',
    specialties: ['Fundamentals', 'Competition Training', 'Self Defense'],
    bio: 'Professor Mike has been training Brazilian Jiu-Jitsu for over 15 years and teaching for 10 years. He specializes in making complex techniques accessible to beginners.',
  },
  professorSarah: {
    id: 2,
    name: 'Professor Sarah',
    rank: 'Black Belt, 2nd Degree',
    specialties: ['Advanced Gi', 'Competition Training', 'Women\'s Self Defense'],
    bio: 'Professor Sarah is a multiple-time world champion with a passion for helping students reach their competitive goals.',
  },
  coachDave: {
    id: 3,
    name: 'Coach Dave',
    rank: 'Brown Belt',
    specialties: ['Fundamentals', 'Kids Program'],
    bio: 'Coach Dave focuses on building strong fundamentals and creating a welcoming environment for new students.',
  },
};

// =============================================================================
// ATTENDEES (for class detail)
// =============================================================================

export const classAttendees = [
  { id: 1, name: 'Sarah Johnson', belt: 'Purple Belt' },
  { id: 2, name: 'Mike Chen', belt: 'Blue Belt' },
  { id: 3, name: 'Emily Davis', belt: 'White Belt' },
  { id: 4, name: 'David Wilson', belt: 'Blue Belt' },
  { id: 5, name: 'Lisa Martinez', belt: 'White Belt' },
];

// =============================================================================
// CHECK-IN HISTORY
// =============================================================================

export const initialCheckInHistory = [
  {
    id: '1',
    date: '2024-01-15',
    time: '6:00 PM',
    className: 'Fundamentals',
    type: 'Gi',
    instructor: 'Professor Mike',
  },
  {
    id: '2',
    date: '2024-01-13',
    time: '7:30 PM',
    className: 'No-Gi',
    type: 'No-Gi',
    instructor: 'Coach Sarah',
  },
  {
    id: '3',
    date: '2024-01-11',
    time: '6:00 PM',
    className: 'Fundamentals',
    type: 'Gi',
    instructor: 'Professor Mike',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get member's display name with belt info
 */
export const getMemberDisplayInfo = () => ({
  name: currentMember.name,
  belt: currentMember.belt,
  stripes: currentMember.stripes,
  initials: currentMember.name
    .split(' ')
    .map((n) => n[0])
    .join(''),
});

/**
 * Filter schedule classes by type
 * @param {string} filter - Filter type ('All' or specific type)
 */
export const getFilteredClasses = (filter) => {
  if (filter === 'All') return scheduleClasses;
  return scheduleClasses.filter((cls) => cls.type === filter);
};

/**
 * Get instructor by name
 * @param {string} name - Instructor name
 */
export const getInstructorByName = (name) => {
  const key = name.toLowerCase().replace(/\s+/g, '');
  if (key.includes('mike')) return instructors.professorMike;
  if (key.includes('sarah')) return instructors.professorSarah;
  if (key.includes('dave')) return instructors.coachDave;
  return instructors.professorMike; // Default
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

const mockData = {
  currentMember,
  membershipInfo,
  paymentHistory,
  upcomingCharges,
  trainingStats,
  techniques,
  milestones,
  scheduleDays,
  classFilters,
  scheduleClasses,
  todayClasses,
  nextClass,
  classDetailExample,
  instructors,
  classAttendees,
  initialCheckInHistory,
  getMemberDisplayInfo,
  getFilteredClasses,
  getInstructorByName,
};

export default mockData;
