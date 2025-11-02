import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class GymModule extends BaseHabitModule {
  id = 'gym';
  name = 'Gym';
  category = 'physical' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}