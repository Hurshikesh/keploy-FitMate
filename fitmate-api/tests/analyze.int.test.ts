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
      await prisma.recommendation.deleteMany({ where: { analysisId: createdId } })
      await prisma.analysis.deleteMany({ where: { id: createdId } }) // ✅ safe
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
    expect(data).toHaveProperty('id')

    createdId = data.id

    const record = await prisma.analysis.findUnique({ where: { id: data.id } })
    expect(record).not.toBeNull()
    expect(record?.weight).toBe(70)
    expect(record?.goal).toBe('maintain')
  })
})
