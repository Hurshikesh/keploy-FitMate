import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import app from '../src/index'
import { prisma } from '../src/lib/prisma'

let createdAnalysisId: number

beforeAll(async () => {
  // Create a base analysis to recalculate from
  const analysis = await prisma.analysis.create({
    data: {
      age: 25,
      weight: 70,
      height: 175,
      bodyFat: 15,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmi: 22.86,
      bmr: 1655.2,
      tdee: 2565,
      recommendedCalories: 2565,
    },
  })

  createdAnalysisId = analysis.id
})

afterAll(async () => {
  await prisma.analysis.deleteMany()
})

describe('POST /api/recalculate (integration)', () => {
  it('should return new recalculated analysis for valid data', async () => {
    const req = new Request('http://localhost/api/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId: createdAnalysisId,
        weight: 80,
        bodyFat: 20,
      }),
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toHaveProperty('id')
    expect(json.weight).toBe(80)
    expect(json.bodyFat).toBe(20)
    expect(typeof json.bmi).toBe('number')
    expect(typeof json.bmr).toBe('number')
    expect(typeof json.tdee).toBe('number')
    expect(typeof json.recommendedCalories).toBe('number')
  })

  it('should return 404 if analysisId not found', async () => {
    const req = new Request('http://localhost/api/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId: 999999, // Non-existent
        weight: 80,
        bodyFat: 20,
      }),
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json).toHaveProperty('error')
    expect(json.error).toBe('Previous analysis not found')
  })
})
