import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class MeditationModule extends BaseHabitModule {
  id = 'meditation';
  name = 'Meditation';
  category = 'mental' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}