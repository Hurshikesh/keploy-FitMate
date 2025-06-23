import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../src/index'
import { prisma } from '../src/lib/prisma'

vi.mock('../src/lib/prisma', async () => {
  const mod = await vi.importActual<typeof import('../src/__mocks__/prisma')>(
    '../src/__mocks__/prisma'
  )
  return { prisma: mod.prisma }
})

const mockedPrisma = prisma as unknown as {
  analysis: {
    findUnique: (args: any) => Promise<any>
  }
}

describe('GET /api/summary/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 200 and summary data for valid ID', async () => {
    mockedPrisma.analysis.findUnique = vi.fn().mockResolvedValue({
      id: 3,
      bmi: 22.5,
      bmr: 1600,
      tdee: 2400,
      recommendedCalories: 2200,
      weight: 70,
      goal: 'maintain'
    })

    const res = await app.fetch(new Request('http://localhost/api/summary/3'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual({
      id: 3,
      bmi: 22.5,
      bmr: 1600,
      tdee: 2400,
      recommendedCalories: 2200,
      weight: 70,
      goal: 'maintain'
    })
  })

  it('should return 400 if ID is not a number', async () => {
    const res = await app.fetch(new Request('http://localhost/api/summary/abc'))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json).toEqual({ error: 'Invalid ID' })
  })

  it('should return 404 if analysis not found', async () => {
    mockedPrisma.analysis.findUnique = vi.fn().mockResolvedValue(null)

    const res = await app.fetch(new Request('http://localhost/api/summary/999'))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json).toEqual({ error: 'Analysis not found' })
  })

  it('should return 405 if method is not GET', async () => {
    const res = await app.fetch(new Request('http://localhost/api/summary/3', {
      method: 'POST'
    }))

    expect([404, 405]).toContain(res.status)
  })
})
