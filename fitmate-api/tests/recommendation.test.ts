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

describe('GET /api/recommendation/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a recommendation for a valid analysis ID', async () => {
    mockedPrisma.analysis.findUnique.mockResolvedValue({
      id: 1,
      recommendedCalories: 2000,
      goal: 'maintain',
      weight: 70
    } as any)

    mockedPrisma.recommendation.upsert.mockResolvedValue({
      id: 1,
      analysisId: 1,
      meals: [{ name: 'Paneer wrap', calories: 450 }],
      workouts: ['Jogging', 'Strength & flexibility'],
      proteinGrams: 112,
      fatGrams: 56,
      carbGrams: 200
    } as any)

    const res = await app.fetch(new Request('http://localhost/api/recommendation/1'))
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(200)
    expect(json).toHaveProperty('analysisId', 1)
    expect(Array.isArray(json.meals)).toBe(true)
    expect(Array.isArray(json.workouts)).toBe(true)
    expect(typeof json.proteinGrams).toBe('number')
    expect(typeof json.fatGrams).toBe('number')
    expect(typeof json.carbGrams).toBe('number')
  })

  it('should return 400 if ID is not a number', async () => {
    const res = await app.fetch(new Request('http://localhost/api/recommendation/abc'))
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(400)
    expect(json).toEqual({ error: 'Invalid ID' })
  })

  it('should return 404 if analysis not found', async () => {
    mockedPrisma.analysis.findUnique.mockResolvedValue(null)

    const res = await app.fetch(new Request('http://localhost/api/recommendation/999'))
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(404)
    expect(json).toEqual({ error: 'Analysis not found' })
  })

  it('should return 400 for invalid goal in analysis', async () => {
    mockedPrisma.analysis.findUnique.mockResolvedValue({
      id: 1,
      recommendedCalories: 1800,
      goal: 'bulkyboi',
      weight: 70
    } as any)

    const res = await app.fetch(new Request('http://localhost/api/recommendation/1'))
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(400)
    expect(json).toEqual({ error: 'Invalid goal in analysis' })
  })
})
