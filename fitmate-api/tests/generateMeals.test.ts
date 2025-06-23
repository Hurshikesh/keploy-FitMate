import { describe, it, expect } from 'vitest'
import { generateMeals } from '../src/utils/generateMeals'

describe('generateMeals()', () => {
  it('should return a list of meals within calorie limit (+100 buffer)', () => {
    const target = 1500
    const meals = generateMeals(target)

    const total = meals.reduce((sum, m) => sum + m.calories, 0)
    expect(meals.length).toBeLessThanOrEqual(5)
    expect(total).toBeLessThanOrEqual(target + 100)
  })

  it('should return an empty array if calorie target is too low', () => {
    const meals = generateMeals(100) // below all meal entries
    expect(meals.length).toBe(0)
  })

  it('should return diverse meals', () => {
    const meals = generateMeals(2000)
    const names = meals.map(m => m.name)
    const unique = new Set(names)
    expect(unique.size).toBeGreaterThan(1)
  })
})
