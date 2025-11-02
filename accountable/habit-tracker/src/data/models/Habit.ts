import { Habit as IHabit, HabitCategory } from '@/types';

export class Habit implements IHabit {
  id: string;
  name: string;
  category: HabitCategory;

  constructor(id: string, name: string, category: HabitCategory) {
    this.id = id;
    this.name = name;
    this.category = category;
  }
}