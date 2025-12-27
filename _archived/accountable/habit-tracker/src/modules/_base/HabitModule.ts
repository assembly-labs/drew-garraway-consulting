import { Habit, DashboardCardProps, ModuleRoute } from '@/types';

export interface IHabitModule {
  id: string;
  name: string;
  category: 'physical' | 'mental' | 'diet';

  // Dashboard card component
  DashboardCard: React.ComponentType<DashboardCardProps>;

  // Detailed tracking view (future expansion)
  DetailView?: React.ComponentType;

  // Routes for this module
  routes: ModuleRoute[];

  // Get habit definition
  getHabit(): Habit;
}

export abstract class BaseHabitModule implements IHabitModule {
  abstract id: string;
  abstract name: string;
  abstract category: 'physical' | 'mental' | 'diet';
  abstract DashboardCard: React.ComponentType<DashboardCardProps>;
  abstract routes: ModuleRoute[];

  DetailView?: React.ComponentType;

  getHabit(): Habit {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
    };
  }
}