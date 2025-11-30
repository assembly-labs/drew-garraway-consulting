import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class SaunaModule extends BaseHabitModule {
  id = 'sauna';
  name = 'Sauna';
  category = 'physical' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}