import { BaseHabitModule } from '@/modules/_base/HabitModule';
import { SimpleHabitCard } from '@/shared/components/SimpleHabitCard';

export class JiuJitsuModule extends BaseHabitModule {
  id = 'jiu-jitsu';
  name = 'Jiu-jitsu';
  category = 'physical' as const;

  DashboardCard = SimpleHabitCard;
  routes = [];
}