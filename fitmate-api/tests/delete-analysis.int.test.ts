import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import app from '../src/index'
import { prisma } from '../src/lib/prisma'

let analysisIdToDelete: number

beforeAll(async () => {
  const created = await prisma.analysis.create({
    data: {
      age: 30,
      weight: 70,
      height: 170,
      bodyFat: 18,
      gender: 'female',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmi: 24.22,
      bmr: 1450.5,
      tdee: 2248.3,
      recommendedCalories: 2248,
    },
  })

  analysisIdToDelete = created.id

  await prisma.recommendation.create({
    data: {
      analysisId: created.id,
      meals: JSON.stringify([]),
      workouts: JSON.stringify([]),
      proteinGrams: 120,
      fatGrams: 60,
      carbGrams: 200,
    },
  })
})

afterAll(async () => {
  await prisma.recommendation.deleteMany({ where: { analysisId: analysisIdToDelete } })
  await prisma.analysis.deleteMany({ where: { id: analysisIdToDelete } }) // ✅
})

describe('DELETE /api/delete/:id - Integration', () => {
  it('should delete analysis and return 200', async () => {
    const req = new Request(`http://localhost/api/delete/${analysisIdToDelete}`, {
      method: 'DELETE',
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual({ success: true })

    const deleted = await prisma.analysis.findUnique({ where: { id: analysisIdToDelete } })
    expect(deleted).toBeNull()
  })

  it('should return 404 if already deleted or not found', async () => {
    const req = new Request(`http://localhost/api/delete/999999`, {
      method: 'DELETE',
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Not Found or already deleted')
  })

  it('should return 400 for invalid ID', async () => {
    const req = new Request(`http://localhost/api/delete/not-a-number`, {
      method: 'DELETE',
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBe('Invalid ID')
  })
})
