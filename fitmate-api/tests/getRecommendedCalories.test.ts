// tests/getRecommendedCalories.test.ts

import { describe, it, expect } from 'vitest'
import { getRecommendedCalories } from '../src/utils/getRecommendedCalories'

describe('getRecommendedCalories', () => {
  it('should subtract 300 if goal is lose', () => {
    expect(getRecommendedCalories(2000, 'lose')).toBe(1700)
  })

  it('should add 300 if goal is gain', () => {
    expect(getRecommendedCalories(2000, 'gain')).toBe(2300)
  })

  it('should return TDEE as-is if goal is maintain', () => {
    expect(getRecommendedCalories(2000, 'maintain')).toBe(2000)
  })

  it('should return TDEE as-is if goal is invalid', () => {
    expect(getRecommendedCalories(2000, 'random')).toBe(2000)
  })
})
