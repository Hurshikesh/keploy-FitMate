import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import app from '../src/index'
import { prisma } from '../src/lib/prisma'

describe('Integration: POST /api/analyze', () => {
  const validPayload = {
    age: 30,
    weight: 70,
    height: 175,
    bodyFat: 15,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  }

  let createdId: number

  // Clean up before/after to avoid test pollution
  beforeAll(async () => {
    await prisma.analysis.deleteMany({
      where: {
        age: 30,
        weight: 70,
        height: 175,
        bodyFat: 15,
      },
    })
  })

  afterAll(async () => {
    if (createdId) {
      await prisma.analysis.delete({ where: { id: createdId } })
    }
    await prisma.$disconnect()
  })

  it('should create analysis and return expected response', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })

    const res = await app.fetch(req)
    const data = await res.json()

    expect(res.status).toBe(200)

    // Check fields
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('bmi')
    expect(data).toHaveProperty('bmr')
    expect(data).toHaveProperty('tdee')
    expect(data).toHaveProperty('recommendedCalories')
    expect(data).toHaveProperty('createdAt')

    createdId = data.id

    // Validate DB record actually exists
    const record = await prisma.analysis.findUnique({ where: { id: data.id } })
    expect(record).not.toBeNull()
    expect(record?.weight).toBe(70)
    expect(record?.goal).toBe('maintain')
  })
})
