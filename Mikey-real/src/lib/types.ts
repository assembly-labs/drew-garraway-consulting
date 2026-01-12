export type Category = 'national' | 'pa-state';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  category: Category;
  topic: string;
  weight: number;
  difficulty: Difficulty;
  question: string;
  answer: string;
  explanation: string;
  memoryHook: string;
  options: string[];
  correctOption: number;
  source?: string;
}

export interface UserProgress {
  id: string;
  questionId: string;
  lastReviewed: number;
  correctStreak: number;
  incorrectCount: number;
  totalAttempts: number;
  confidence: number; // 1-5 scale
  nextReviewDate: number;
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  mode: StudyMode;
  questionsAttempted: number;
  correctAnswers: number;
  category?: Category;
  topic?: string;
}

export type StudyMode = 'flashcard' | 'quiz' | 'exam' | 'weak-areas' | 'math-drill';

export interface TopicStats {
  topic: string;
  category: Category;
  total: number;
  attempted: number;
  correct: number;
  mastered: number; // correctStreak >= 3
  accuracy: number;
  weight: number;
}

export interface ExamConfig {
  name: string;
  category: Category | 'both';
  questionCount: number;
  timeMinutes: number;
  topics?: string[];
}

export const NATIONAL_TOPICS = [
  { name: 'Real Estate Contracts & Agency', weight: 20 },
  { name: 'Property Ownership & Land Use', weight: 15 },
  { name: 'Financing & Settlement', weight: 15 },
  { name: 'Valuation & Market Analysis', weight: 12 },
  { name: 'Real Estate Math', weight: 10 },
  { name: 'Fair Housing & Ethics', weight: 10 },
  { name: 'Transfer of Property', weight: 10 },
  { name: 'Property Disclosures', weight: 8 },
] as const;

export const PA_STATE_TOPICS = [
  { name: 'Regulations Governing Licensees', weight: 28 },
  { name: 'PA Real Estate Commission', weight: 20 },
  { name: 'PA Contracts & Disclosures', weight: 18 },
  { name: 'PA Licensing Requirements', weight: 17 },
  { name: 'PA Law Updates', weight: 17 },
] as const;

export const EXAM_CONFIGS: ExamConfig[] = [
  { name: 'National Only', category: 'national', questionCount: 80, timeMinutes: 120 },
  { name: 'PA State Only', category: 'pa-state', questionCount: 40, timeMinutes: 60 },
  { name: 'Full Exam (Both)', category: 'both', questionCount: 120, timeMinutes: 180 },
];

export const MATH_FORMULAS = [
  { name: 'Commission', formula: 'Sale Price × Commission Rate', example: '$300,000 × 6% = $18,000' },
  { name: 'Agent Commission', formula: 'Gross Commission × Agent Split %', example: '$18,000 × 50% = $9,000' },
  { name: 'Loan-to-Value (LTV)', formula: 'Loan Amount ÷ Property Value × 100', example: '$240,000 ÷ $300,000 = 80%' },
  { name: 'Down Payment', formula: 'Purchase Price - Loan Amount', example: '$300,000 - $240,000 = $60,000' },
  { name: 'Monthly Interest', formula: 'Loan Amount × (Interest Rate ÷ 12)', example: '$200,000 × (6% ÷ 12) = $1,000' },
  { name: 'Proration (Daily)', formula: 'Annual Amount ÷ 365 × Days', example: '$3,650 ÷ 365 × 30 = $300' },
  { name: 'Square Footage', formula: 'Length × Width', example: '50 ft × 40 ft = 2,000 sq ft' },
  { name: 'Acreage', formula: 'Square Feet ÷ 43,560', example: '87,120 sq ft ÷ 43,560 = 2 acres' },
  { name: 'Price Per Sq Ft', formula: 'Sale Price ÷ Square Footage', example: '$200,000 ÷ 2,000 = $100/sq ft' },
  { name: 'Net to Seller', formula: 'Sale Price - Commission - Closing Costs', example: '$300,000 - $18,000 - $5,000 = $277,000' },
  { name: 'Cap Rate', formula: 'NOI ÷ Property Value × 100', example: '$30,000 ÷ $400,000 = 7.5%' },
  { name: 'GRM (Gross Rent Multiplier)', formula: 'Sale Price ÷ Annual Gross Rent', example: '$200,000 ÷ $24,000 = 8.33' },
];
