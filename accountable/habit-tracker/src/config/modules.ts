import { IHabitModule } from '@/modules/_base/HabitModule';
import { JiuJitsuModule } from '@/modules/jiu-jitsu';
import { GymModule } from '@/modules/gym';
import { YogaModule } from '@/modules/yoga';
import { MeditationModule } from '@/modules/meditation';
import { NotYellingModule } from '@/modules/not-yelling';
import { SupplementsModule } from '@/modules/supplements';

export const HABIT_MODULES: IHabitModule[] = [
  new YogaModule(),
  new GymModule(),
  new JiuJitsuModule(),
  new MeditationModule(),
  new NotYellingModule(),
  new SupplementsModule(),
];

export const getModuleById = (id: string): IHabitModule | undefined => {
  return HABIT_MODULES.find(module => module.id === id);
};

export const getModulesByCategory = (category: string): IHabitModule[] => {
  return HABIT_MODULES.filter(module => module.category === category);
};