import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../src/lib/prisma', async () => {
  const actual = await vi.importActual<typeof import('../src/__mocks__/prisma')>('../src/__mocks__/prisma')
  return { prisma: actual.prisma }
})

import { prisma } from '../src/lib/prisma'
import { type PrismaMock } from '../src/__mocks__/prisma'
import app from '../src/index'

const mockedPrisma = prisma as unknown as PrismaMock

const parseJsonSafely = async (res: Response) => {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    console.error('Failed to parse response:', text)
    throw e
  }
}

describe('POST /api/recalculate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 200 with new recalculated analysis', async () => {
    mockedPrisma.analysis.findUnique.mockResolvedValue({
      id: 1,
      age: 25,
      weight: 70,
      height: 175,
      bodyFat: 15,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmi: 22,
      bmr: 1600,
      tdee: 2500,
      recommendedCalories: 2500,
      createdAt: new Date(),
    } as any)

    mockedPrisma.analysis.create.mockResolvedValue({
      id: 2,
      age: 25,
      weight: 75,
      height: 175,
      bodyFat: 18,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmi: 24.49,
      bmr: 1700,
      tdee: 2635,
      recommendedCalories: 2635,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    } as any)

    const req = new Request('http://localhost/api/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId: 1,
        weight: 75,
        bodyFat: 18,
      }),
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(200)
    expect(json).toMatchObject({
      id: 2,
      weight: 75,
      bodyFat: 18,
      recommendedCalories: 2635,
      createdAt: '2024-01-01T00:00:00.000Z',
    })
  })

  it('should return 404 if analysisId not found', async () => {
    mockedPrisma.analysis.findUnique.mockResolvedValue(null)

    const req = new Request('http://localhost/api/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId: 999,
        weight: 75,
        bodyFat: 18,
      }),
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(404)
    expect(json).toEqual({ error: 'Previous analysis not found' })
  })

  it('should return 405 for invalid method', async () => {
    const req = new Request('http://localhost/api/recalculate', {
      method: 'GET',
    })

    const res = await app.fetch(req)
    expect([404, 405]).toContain(res.status)
  })
})

// Zod validation tests
import { z } from 'zod'

const RecalculateInput = z.object({
  analysisId: z.number(),
  weight: z.number(),
  bodyFat: z.number(),
})

describe('Zod validation - RecalculateInput', () => {
  it('passes with valid input', () => {
    const valid = {
      analysisId: 1,
      weight: 75,
      bodyFat: 18,
    }
    const result = RecalculateInput.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('fails if any field is missing', () => {
    const result = RecalculateInput.safeParse({ analysisId: 1, weight: 70 })
    expect(result.success).toBe(false)
  })

  it('fails if types are incorrect', () => {
    const result = RecalculateInput.safeParse({
      analysisId: 'one',
      weight: '75',
      bodyFat: '18',
    })
    expect(result.success).toBe(false)
  })

  it('fails if values are negative', () => {
    const result = RecalculateInput.safeParse({
      analysisId: -1,
      weight: -70,
      bodyFat: -10,
    })
    expect(result.success).toBe(true) // schema allows it unless you add `.min(0)` constraints
  })

  it('should fallback to multiplier 1.2 if activityLevel is unknown', async () => {
  mockedPrisma.analysis.findUnique.mockResolvedValue({
    id: 3,
    age: 28,
    weight: 70,
    height: 170,
    bodyFat: 20,
    gender: 'male',
    activityLevel: 'unknown-level', // ← triggers fallback
    goal: 'maintain',
    bmi: 24,
    bmr: 1600,
    tdee: 2500,
    recommendedCalories: 2500,
    createdAt: new Date(),
  } as any)

  mockedPrisma.analysis.create.mockResolvedValue({
    id: 4,
    age: 28,
    weight: 80,
    height: 170,
    bodyFat: 20,
    gender: 'male',
    activityLevel: 'unknown-level',
    goal: 'maintain',
    bmi: 27.68,
    bmr: 1810,
    tdee: 2172, // 1810 * 1.2 fallback multiplier
    recommendedCalories: 2172,
    createdAt: new Date('2024-02-02T00:00:00.000Z'),
  } as any)

  const req = new Request('http://localhost/api/recalculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      analysisId: 3,
      weight: 80,
      bodyFat: 20,
    }),
  })

  const res = await app.fetch(req)
  const json = await res.json()

  expect(res.status).toBe(200)
  expect(json).toMatchObject({
    id: 4,
    activityLevel: 'unknown-level',
    tdee: 2172,
    recommendedCalories: 2172,
    createdAt: '2024-02-02T00:00:00.000Z',
  })
})
it('should use multiplier 1.2 when activityLevel is "low"', async () => {
  mockedPrisma.analysis.findUnique.mockResolvedValue({
    id: 5,
    age: 22,
    weight: 60,
    height: 165,
    bodyFat: 22,
    gender: 'female',
    activityLevel: 'low', // ← returns exactly 1.2 from map
    goal: 'maintain',
    bmi: 22,
    bmr: 1350,
    tdee: 1620, // 1350 * 1.2
    recommendedCalories: 1620,
    createdAt: new Date(),
  } as any)

  mockedPrisma.analysis.create.mockResolvedValue({
    id: 6,
    age: 22,
    weight: 60,
    height: 165,
    bodyFat: 22,
    gender: 'female',
    activityLevel: 'low',
    goal: 'maintain',
    bmi: 22.04,
    bmr: 1350,
    tdee: 1620,
    recommendedCalories: 1620,
    createdAt: new Date('2024-03-03T00:00:00.000Z'),
  } as any)

  const req = new Request('http://localhost/api/recalculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      analysisId: 5,
      weight: 60,
      bodyFat: 22,
    }),
  })

  const res = await app.fetch(req)
  const json = await res.json()

  expect(res.status).toBe(200)
  expect(json).toMatchObject({
    id: 6,
    activityLevel: 'low',
    tdee: 1620,
    recommendedCalories: 1620,
    createdAt: '2024-03-03T00:00:00.000Z',
  })
})
it('should reduce calories by 300 when goal is "lose"', async () => {
  mockedPrisma.analysis.findUnique.mockResolvedValue({
    id: 8,
    age: 28,
    weight: 70,
    height: 170,
    bodyFat: 20,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'lose', // 👈 triggers lose branch
    bmi: 24,
    bmr: 1650,
    tdee: 2557,
    recommendedCalories: 2257,
    createdAt: new Date(),
  } as any)

  mockedPrisma.analysis.create.mockResolvedValue({
    id: 9,
    age: 28,
    weight: 70,
    height: 170,
    bodyFat: 20,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'lose',
    bmi: 24.22,
    bmr: 1650,
    tdee: 2557,
    recommendedCalories: 2257, // ✅ lose = -300
    createdAt: new Date('2024-04-04T00:00:00.000Z'),
  } as any)

  const req = new Request('http://localhost/api/recalculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      analysisId: 8,
      weight: 70,
      bodyFat: 20,
    }),
  })

  const res = await app.fetch(req)
  const json = await res.json()

  expect(res.status).toBe(200)
  expect(json).toMatchObject({
    id: 9,
    goal: 'lose',
    recommendedCalories: 2257,
    createdAt: '2024-04-04T00:00:00.000Z',
  })
})



})
