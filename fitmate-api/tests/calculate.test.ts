import { describe, it, expect } from 'vitest'
import {
  calculateBMI,
  calculateBMR,
  getActivityMultiplier,
  calculateTDEE,
} from '../src/utils/calculate'

describe('calculateBMI()', () => {
  it('calculates correct BMI', () => {
    expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 1)
  })
})

describe('calculateBMR()', () => {
  it('calculates correct BMR for male', () => {
    expect(calculateBMR(25, 'male', 70, 175)).toBeCloseTo(1673.75, 1)
  })

  it('calculates correct BMR for female', () => {
    expect(calculateBMR(25, 'female', 70, 175)).toBeCloseTo(1507.75, 1)
  })
})

describe('getActivityMultiplier()', () => {
  it('returns correct multiplier', () => {
    expect(getActivityMultiplier('low')).toBe(1.2)
    expect(getActivityMultiplier('moderate')).toBe(1.55)
    expect(getActivityMultiplier('high')).toBe(1.9)
  })

  it('defaults to 1.2 for invalid input', () => {
    expect(getActivityMultiplier('extreme')).toBe(1.2)
  })
})

describe('calculateTDEE()', () => {
  it('calculates correct TDEE', () => {
    expect(calculateTDEE(1600, 1.55)).toBeCloseTo(2480)
  })
})
