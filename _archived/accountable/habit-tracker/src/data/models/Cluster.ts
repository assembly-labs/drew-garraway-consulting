import { ClusterRequirement, HabitCategory } from '@/types';

export class Cluster implements ClusterRequirement {
  id: string;
  name: string;
  category: HabitCategory;
  habitIds: string[];
  requiredCount: number;

  constructor(
    id: string,
    name: string,
    category: HabitCategory,
    habitIds: string[],
    requiredCount: number
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.habitIds = habitIds;
    this.requiredCount = requiredCount;
  }

  isComplete(completedHabitIds: string[]): boolean {
    const completedInCluster = this.habitIds.filter(id =>
      completedHabitIds.includes(id)
    );
    return completedInCluster.length >= this.requiredCount;
  }

  getProgress(completedHabitIds: string[]): { completed: number; required: number } {
    const completed = this.habitIds.filter(id =>
      completedHabitIds.includes(id)
    ).length;
    return { completed, required: this.requiredCount };
  }
}