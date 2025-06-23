import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../src/lib/prisma', async () => {
  const mod = await vi.importActual<typeof import('../src/__mocks__/prisma')>(
    '../src/__mocks__/prisma'
  )
  return { prisma: mod.prisma }
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

describe('GET /api/history', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return history entries with recommendations', async () => {
    mockedPrisma.analysis.findMany.mockResolvedValue([
      {
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
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        recommendation: {
          id: 101,
          analysisId: 1,
          meals: [
            { name: 'Oats with banana', calories: 350 },
            { name: 'Rice & dal', calories: 500 }
          ],
          workouts: ['Jogging', 'Strength training'],
          proteinGrams: 120,
          fatGrams: 60,
          carbGrams: 280
        }
      } as any,
      {
        id: 2,
        age: 30,
        weight: 80,
        height: 180,
        bodyFat: 20,
        gender: 'female',
        activityLevel: 'high',
        goal: 'lose',
        bmi: 24,
        bmr: 1500,
        tdee: 2200,
        recommendedCalories: 1900,
        createdAt: new Date('2024-02-01T00:00:00.000Z'),
        recommendation: null
      } as any
    ])

    const req = new Request('http://localhost/api/history', {
      method: 'GET'
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(200)
    expect(Array.isArray(json)).toBe(true)
    expect(json).toHaveLength(2)

    expect(json[0]).toMatchObject({
      id: 1,
      recommendation: {
        meals: expect.any(Array),
        workouts: expect.any(Array)
      }
    })

    expect(json[1].recommendation).toBeNull()
  })

  it('should return 200 and empty array if no entries found', async () => {
    mockedPrisma.analysis.findMany.mockResolvedValue([])

    const req = new Request('http://localhost/api/history', {
      method: 'GET'
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(200)
    expect(json).toEqual([])
  })
})

// ✅ Zod schema validation for output format
import { z } from 'zod'

const recommendationSchema = z.object({
  id: z.number(),
  meals: z.array(z.object({ name: z.string(), calories: z.number() })),
  workouts: z.array(z.string()),
  proteinGrams: z.number(),
  fatGrams: z.number(),
  carbGrams: z.number(),
  analysisId: z.number()
})

const analysisSchema = z.object({
  id: z.number(),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  bodyFat: z.number(),
  gender: z.string(),
  activityLevel: z.string(),
  goal: z.string(),
  bmi: z.number(),
  bmr: z.number(),
  tdee: z.number(),
  recommendedCalories: z.number(),
  createdAt: z.string(),
  recommendation: recommendationSchema.nullable().optional()
})

describe('Zod validation - /api/history', () => {
  it('should pass for valid item with recommendation', () => {
    const result = analysisSchema.safeParse({
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
      createdAt: '2024-01-01T00:00:00.000Z',
      recommendation: {
        id: 101,
        analysisId: 1,
        meals: [
          { name: 'Oats with banana', calories: 350 },
          { name: 'Rice & dal', calories: 500 }
        ],
        workouts: ['Jogging', 'Strength training'],
        proteinGrams: 120,
        fatGrams: 60,
        carbGrams: 280
      }
    })
    expect(result.success).toBe(true)
  })

  it('should pass for valid item without recommendation', () => {
    const result = analysisSchema.safeParse({
      id: 2,
      age: 30,
      weight: 80,
      height: 180,
      bodyFat: 20,
      gender: 'female',
      activityLevel: 'high',
      goal: 'lose',
      bmi: 24,
      bmr: 1500,
      tdee: 2200,
      recommendedCalories: 1900,
      createdAt: '2024-02-01T00:00:00.000Z',
      recommendation: null
    })
    expect(result.success).toBe(true)
  })

  it('should fail for invalid meals', () => {
    const result = analysisSchema.safeParse({
      id: 3,
      age: 30,
      weight: 75,
      height: 170,
      bodyFat: 19,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'gain',
      bmi: 25,
      bmr: 1700,
      tdee: 2600,
      recommendedCalories: 2900,
      createdAt: '2024-01-01T00:00:00.000Z',
      recommendation: {
        id: 102,
        analysisId: 3,
        meals: [{ name: 'No Calories Field' }],
        workouts: ['Pushups'],
        proteinGrams: 130,
        fatGrams: 70,
        carbGrams: 310
      }
    })
    expect(result.success).toBe(false)
  })
})
