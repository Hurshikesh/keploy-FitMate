import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import app from '../src/index'
import { prisma } from '../src/lib/prisma'

let analysisId: number

beforeAll(async () => {
  const analysis = await prisma.analysis.create({
    data: {
      age: 30,
      weight: 75,
      height: 180,
      bodyFat: 18,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmi: 23.15,
      bmr: 1700,
      tdee: 2635,
      recommendedCalories: 2635,
    },
  })

  analysisId = analysis.id

  await prisma.recommendation.create({
    data: {
      analysisId,
      meals: [
        { name: 'Oats', calories: 250 },
        { name: 'Chicken', calories: 400 },
      ],
      workouts: ['Pushups', 'Running'],
      proteinGrams: 140,
      fatGrams: 80,
      carbGrams: 300,
    },
  })
})

afterAll(async () => {
  await prisma.recommendation.deleteMany()
  await prisma.analysis.deleteMany()
})

describe('GET /api/history (integration)', () => {
  it('should return a list of analysis records with optional recommendations', async () => {
    const req = new Request('http://localhost/api/history', {
      method: 'GET',
    })

    const res = await app.fetch(req)
    expect(res.status).toBe(200)

    const json = await res.json()

    expect(Array.isArray(json)).toBe(true)
    expect(json.length).toBeGreaterThan(0)

    const first = json[0]

    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('weight')
    expect(first).toHaveProperty('bmi')
    expect(first).toHaveProperty('createdAt')

    // If recommendation exists
    if (first.recommendation) {
      expect(first.recommendation).toHaveProperty('meals')
      expect(Array.isArray(first.recommendation.meals)).toBe(true)
      expect(typeof first.recommendation.meals[0].name).toBe('string')
    }
  })
})
