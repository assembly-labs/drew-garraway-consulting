import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class YogaModule extends BaseHabitModule {
  id = 'yoga';
  name = 'Yoga';
  category = 'physical' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}