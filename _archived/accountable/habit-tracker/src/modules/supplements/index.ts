import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class SupplementsModule extends BaseHabitModule {
  id = 'supplements';
  name = 'Supplements';
  category = 'diet' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}