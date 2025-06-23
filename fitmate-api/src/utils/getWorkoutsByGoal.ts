// src/utils/getWorkoutsByGoal.ts

export type Goal = 'lose' | 'maintain' | 'gain'

const workouts: Record<Goal, string[]> = {
  lose: ['HIIT (30 min)', 'Brisk walk', 'Cycling'],
  maintain: ['Jogging', 'Strength & flexibility', 'Yoga'],
  gain: ['Heavy weightlifting', 'Split workouts (push/pull)', 'Progressive overload']
}

export function getWorkoutsByGoal(goal: string): string[] {
  if (goal === 'lose' || goal === 'maintain' || goal === 'gain') {
    return workouts[goal]
  }
  return []
}
