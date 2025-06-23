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
      meals: JSON.stringify([
        { name: 'Oats', calories: 250 },
        { name: 'Chicken', calories: 400 },
      ]),
      workouts: JSON.stringify(['Pushups', 'Running']),
      proteinGrams: 140,
      fatGrams: 80,
      carbGrams: 300,
    },
  })
})

afterAll(async () => {
  await prisma.recommendation.deleteMany({ where: { analysisId } })
  await prisma.analysis.deleteMany({ where: { id: analysisId } }) // ✅
})

describe('GET /api/history (integration)', () => {
  it('should return a list of analysis records with recommendations if available', async () => {
    const req = new Request('http://localhost/api/history', {
      method: 'GET',
    })

    const res = await app.fetch(req)
    expect(res.status).toBe(200)

    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)

    const target = json.find((entry) => entry.id === analysisId)
    expect(target).toBeDefined()

    if (target.recommendation) {
      expect(target.recommendation).toHaveProperty('meals')
      const meals = JSON.parse(target.recommendation.meals)
      expect(Array.isArray(meals)).toBe(true)
      expect(typeof meals[0].name).toBe('string')
    }
  })
})
