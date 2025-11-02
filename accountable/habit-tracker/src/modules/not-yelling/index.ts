import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class NotYellingModule extends BaseHabitModule {
  id = 'not-yelling';
  name = 'Not yelling';
  category = 'mental' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}