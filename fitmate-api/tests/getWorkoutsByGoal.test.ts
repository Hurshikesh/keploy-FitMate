// tests/getWorkoutsByGoal.test.ts

import { describe, it, expect } from 'vitest'
import { getWorkoutsByGoal } from '../src/utils/getWorkoutsByGoal'

describe('getWorkoutsByGoal', () => {
  it('returns workouts for goal "lose"', () => {
    const workouts = getWorkoutsByGoal('lose')
    expect(workouts).toContain('HIIT (30 min)')
    expect(workouts.length).toBeGreaterThan(0)
  })

  it('returns workouts for goal "gain"', () => {
    const workouts = getWorkoutsByGoal('gain')
    expect(workouts).toContain('Heavy weightlifting')
    expect(workouts.length).toBeGreaterThan(0)
  })

  it('returns workouts for goal "maintain"', () => {
    const workouts = getWorkoutsByGoal('maintain')
    expect(workouts).toContain('Yoga')
    expect(workouts.length).toBeGreaterThan(0)
  })

  it('returns empty array for invalid goal', () => {
    expect(getWorkoutsByGoal('bulk')).toEqual([])
    expect(getWorkoutsByGoal('cut')).toEqual([])
    expect(getWorkoutsByGoal('')).toEqual([])
  })
})
