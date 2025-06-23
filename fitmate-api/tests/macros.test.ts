import { describe, it, expect } from 'vitest'
import { calculateMacros } from '../src/utils/calculate'

describe('calculateMacros()', () => {
  it('calculates correct macros for lose goal', () => {
    const { proteinGrams, fatGrams, carbGrams } = calculateMacros('lose', 60, 2000)

    expect(proteinGrams).toBe(96) // 60 * 1.6
    expect(fatGrams).toBeCloseTo(Math.round((2000 * 0.25) / 9))
    const totalCalories = proteinGrams * 4 + fatGrams * 9 + carbGrams * 4
    expect(totalCalories).toBeGreaterThanOrEqual(1950)
    expect(totalCalories).toBeLessThanOrEqual(2050)
  })

  it('calculates correct macros for gain goal', () => {
    const { proteinGrams, fatGrams, carbGrams } = calculateMacros('gain', 75, 2700)

    expect(proteinGrams).toBe(150) // 75 * 2
    expect(fatGrams).toBeCloseTo(Math.round((2700 * 0.25) / 9))
    const totalCalories = proteinGrams * 4 + fatGrams * 9 + carbGrams * 4
    expect(totalCalories).toBeGreaterThanOrEqual(2650)
    expect(totalCalories).toBeLessThanOrEqual(2750)
  })

  it('calculates correct macros for maintain goal', () => {
    const { proteinGrams, fatGrams, carbGrams } = calculateMacros('maintain', 65, 2200)

    expect(proteinGrams).toBe(104) // 65 * 1.6
    expect(fatGrams).toBeCloseTo(Math.round((2200 * 0.25) / 9))
    const totalCalories = proteinGrams * 4 + fatGrams * 9 + carbGrams * 4
    expect(totalCalories).toBeGreaterThanOrEqual(2150)
    expect(totalCalories).toBeLessThanOrEqual(2250)
  })
})
