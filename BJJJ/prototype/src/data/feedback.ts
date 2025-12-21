/**
 * Mock Coach Feedback Data
 * Structured feedback, focus areas, and AI-assisted input
 */

export type FeedbackCategory = 'strength' | 'needs-work' | 'drill-focus' | 'general';

export interface CoachFeedback {
  id: string;
  coachId: string;
  coachName: string;
  studentId: string;
  date: string;
  category: FeedbackCategory;
  techniqueIds?: string[];
  techniqueNames?: string[];
  message: string;
  isRead: boolean;
  readAt?: string;
  sessionId?: string;
}

export interface FocusArea {
  id: string;
  studentId: string;
  assignedBy: string;
  coachName: string;
  title: string;
  description: string;
  techniqueIds?: string[];
  priority: 'high' | 'medium' | 'low';
  assignedAt: string;
  completedAt?: string;
  isActive: boolean;
}

export interface PeriodicReview {
  id: string;
  coachId: string;
  coachName: string;
  studentId: string;
  date: string;
  period: string; // e.g., "Q4 2024"
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  goalsForNextPeriod: string[];
  promotionReadiness: 'not-ready' | 'progressing' | 'close' | 'ready';
}

export interface VoiceFeedback {
  id: string;
  coachId: string;
  rawTranscript: string;
  processedFeedback: string;
  extractedTechniques: string[];
  suggestedCategory: FeedbackCategory;
  createdAt: string;
  isApproved: boolean;
  sentAt?: string;
}

// ===========================================
// MOCK COACH FEEDBACK
// ===========================================

export const mockCoachFeedback: CoachFeedback[] = [
  {
    id: 'fb-001',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-12-19',
    category: 'strength',
    techniqueIds: ['tech-007'],
    techniqueNames: ['Toreando Pass'],
    message: 'Your toreando pass is looking sharp. The hip pressure detail you picked up today is exactly what separates good passers from great ones. Keep drilling this.',
    isRead: true,
    readAt: '2024-12-19T20:30:00Z',
  },
  {
    id: 'fb-002',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-12-17',
    category: 'needs-work',
    techniqueIds: ['tech-008'],
    techniqueNames: ['Knee Cut Pass'],
    message: 'Your knee cut is getting stuffed in half guard too often. Focus on securing the underhook before committing to the pass. We\'ll drill this next week.',
    isRead: true,
    readAt: '2024-12-17T21:00:00Z',
  },
  {
    id: 'fb-003',
    coachId: 'coach-002',
    coachName: 'Coach Amanda Foster',
    studentId: 'user-001',
    date: '2024-12-15',
    category: 'drill-focus',
    techniqueIds: ['tech-012', 'tech-013'],
    techniqueNames: ['Heel Hook', 'Saddle/Inside Sankaku'],
    message: 'For leg locks, you need to slow down and focus on the control position first. Don\'t rush to the submission. Spend time in the saddle before attacking. I want you drilling entries for the next two weeks.',
    isRead: true,
    readAt: '2024-12-16T10:00:00Z',
  },
  {
    id: 'fb-004',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-12-10',
    category: 'general',
    message: 'Great consistency this month, Marcus. Your guard passing game has improved significantly. Keep up the 4x/week training schedule - it\'s showing results.',
    isRead: true,
    readAt: '2024-12-10T19:00:00Z',
  },
  {
    id: 'fb-005',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-12-05',
    category: 'needs-work',
    message: 'I noticed you\'re getting caught with your posture broken in guard a lot. Remember: posture first, pass second. Frame on the hips, stand up to break guard.',
    isRead: true,
    readAt: '2024-12-06T08:00:00Z',
  },
  {
    id: 'fb-006',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-11-28',
    category: 'strength',
    techniqueIds: ['tech-004'],
    techniqueNames: ['Rear Naked Choke'],
    message: 'Your back attacks are getting really solid. The seatbelt control and patience before going for the choke is exactly right. This is purple belt level work.',
    isRead: true,
    readAt: '2024-11-28T20:00:00Z',
  },
];

// ===========================================
// MOCK FOCUS AREAS
// ===========================================

export const mockFocusAreas: FocusArea[] = [
  {
    id: 'focus-001',
    studentId: 'user-001',
    assignedBy: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    title: 'Guard Passing Fundamentals',
    description: 'Master 3 fundamental passes: toreando, knee cut, and double under. Focus on pressure and hip control.',
    techniqueIds: ['tech-007', 'tech-008'],
    priority: 'high',
    assignedAt: '2024-12-01',
    isActive: true,
  },
  {
    id: 'focus-002',
    studentId: 'user-001',
    assignedBy: 'coach-002',
    coachName: 'Coach Amanda Foster',
    title: 'Leg Lock Defense',
    description: 'Before attacking with leg locks, you need to understand defense. Drill boot escape and saddle escapes.',
    priority: 'medium',
    assignedAt: '2024-12-10',
    isActive: true,
  },
  {
    id: 'focus-003',
    studentId: 'user-001',
    assignedBy: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    title: 'Takedowns',
    description: 'Work on single leg and double leg entries. You need this for purple belt requirements.',
    priority: 'medium',
    assignedAt: '2024-11-15',
    isActive: true,
  },
  {
    id: 'focus-004',
    studentId: 'user-001',
    assignedBy: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    title: 'Posture in Guard',
    description: 'Maintain good posture when in someone\'s closed guard. Frame, stand, break.',
    priority: 'high',
    assignedAt: '2024-12-05',
    isActive: true,
  },
];

// ===========================================
// MOCK PERIODIC REVIEWS
// ===========================================

export const mockPeriodicReviews: PeriodicReview[] = [
  {
    id: 'review-001',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-12-01',
    period: 'Q4 2024',
    overallAssessment: 'Strong quarter with consistent training and visible improvement. Marcus has developed a more complete game and is starting to think strategically during rolls.',
    strengths: [
      'Excellent guard retention and sweeps',
      'Back control and submissions from back',
      'Training consistency (4x/week average)',
      'Good attitude and coachability',
    ],
    areasForImprovement: [
      'Takedowns and standing game',
      'Posture maintenance in closed guard',
      'Side control escapes under pressure',
      'Competition experience',
    ],
    goalsForNextPeriod: [
      'Complete takedown requirements for purple belt',
      'Compete in at least one tournament in Q1',
      'Start assisting with fundamentals class',
      'Develop a passing system (toreando + knee cut combo)',
    ],
    promotionReadiness: 'progressing',
  },
  {
    id: 'review-002',
    coachId: 'coach-001',
    coachName: 'Professor Ricardo Silva',
    studentId: 'user-001',
    date: '2024-09-01',
    period: 'Q3 2024',
    overallAssessment: 'Marcus earned his second stripe this quarter, well deserved. His guard game is solid and he\'s starting to develop a top game. Needs to expand beyond comfort zone.',
    strengths: [
      'Closed guard attacks (armbar, triangle, kimura)',
      'Training consistency',
      'Improved sparring intensity',
    ],
    areasForImprovement: [
      'Guard passing variety',
      'Leg lock knowledge',
      'Takedowns',
    ],
    goalsForNextPeriod: [
      'Learn toreando and knee cut passes',
      'Start leg lock fundamentals with Coach Amanda',
      'Maintain training consistency',
    ],
    promotionReadiness: 'progressing',
  },
];

// ===========================================
// MOCK VOICE FEEDBACK (AI-assisted)
// ===========================================

export const mockVoiceFeedback: VoiceFeedback[] = [
  {
    id: 'voice-001',
    coachId: 'coach-001',
    rawTranscript: 'Marcus had a good class today um his toreando is looking better but the knee cut still needs work hes getting stuck in half guard too much tell him to focus on the underhook before committing to the pass',
    processedFeedback: 'Your toreando pass is improving, but the knee cut still needs work. You\'re getting stuck in half guard too often. Focus on securing the underhook before committing to the pass.',
    extractedTechniques: ['Toreando Pass', 'Knee Cut Pass'],
    suggestedCategory: 'needs-work',
    createdAt: '2024-12-17T19:00:00Z',
    isApproved: true,
    sentAt: '2024-12-17T19:05:00Z',
  },
  {
    id: 'voice-002',
    coachId: 'coach-002',
    rawTranscript: 'marcus is rushing into leg locks without controlling the position first i want him drilling saddle entries for two weeks slow down control then attack',
    processedFeedback: 'You\'re rushing into leg locks without controlling the position first. I want you drilling saddle entries for two weeks. Slow down, control the position, then attack.',
    extractedTechniques: ['Saddle/Inside Sankaku', 'Heel Hook'],
    suggestedCategory: 'drill-focus',
    createdAt: '2024-12-15T18:30:00Z',
    isApproved: true,
    sentAt: '2024-12-15T18:35:00Z',
  },
];

// ===========================================
// FEEDBACK STATS
// ===========================================

export const mockFeedbackStats = {
  totalFeedbackReceived: 24,
  unreadFeedback: 0,
  activeFocusAreas: 4,
  lastFeedbackDate: '2024-12-19',
  feedbackByCategory: {
    strength: 8,
    'needs-work': 10,
    'drill-focus': 4,
    general: 2,
  },
  topCoaches: [
    { name: 'Professor Ricardo Silva', feedbackCount: 18 },
    { name: 'Coach Amanda Foster', feedbackCount: 6 },
  ],
};
