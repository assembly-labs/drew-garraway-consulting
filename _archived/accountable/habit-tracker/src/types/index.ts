export type HabitCategory = 'physical' | 'mental' | 'diet';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
}

export interface ClusterRequirement {
  id: string;
  name: string;
  category: HabitCategory;
  habitIds: string[];
  requiredCount: number;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  habits: Record<string, boolean>;
}

export interface SessionData {
  habitId: string;
  date: string;
  completed: boolean;
  details?: Record<string, unknown>; // Module-specific data
}

export interface DashboardCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  isEditable?: boolean;
}

export interface ModuleRoute {
  path: string;
  element: React.ReactNode;
}