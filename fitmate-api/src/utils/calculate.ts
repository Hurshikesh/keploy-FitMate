type Gender = 'male' | 'female'
type ActivityLevel = 'low' | 'moderate' | 'high'
type Goal = 'lose' | 'maintain' | 'gain'

export function calculateBMI(weight: number, height: number): number {
  return +(weight / ((height / 100) ** 2)).toFixed(2)
}

export function calculateBMR(age: number, gender: Gender, weight: number, height: number): number {
  return gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161
}

export function getActivityMultiplier(level: string): number {
  const map: Record<ActivityLevel, number> = {
    low: 1.2,
    moderate: 1.55,
    high: 1.9
  }
  return map[level as ActivityLevel] || 1.2
}

export function calculateTDEE(bmr: number, multiplier: number): number {
  return Math.round(bmr * multiplier)
}




export function calculateMacros(goal: 'lose' | 'maintain' | 'gain', weight: number, totalCalories: number) {
  const proteinGrams = Math.round(weight * (goal === 'gain' ? 2 : 1.6))
  const fatGrams = Math.round((totalCalories * 0.25) / 9)
  const proteinCalories = proteinGrams * 4
  const fatCalories = fatGrams * 9
  const carbCalories = totalCalories - (proteinCalories + fatCalories)
  const carbGrams = Math.round(carbCalories / 4)

  return { proteinGrams, fatGrams, carbGrams }
}
