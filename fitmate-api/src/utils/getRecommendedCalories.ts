// src/utils/getRecommendedCalories.ts

export function getRecommendedCalories(tdee: number, goal: string): number {
  if (goal === 'lose') return tdee - 300
  if (goal === 'gain') return tdee + 300
  return tdee
}
