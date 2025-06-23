// tests/analyze.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// 👇 mock prisma deeply before all other imports
vi.mock('../src/lib/prisma', async () => {
  const mod = await vi.importActual<typeof import('../src/__mocks__/prisma')>(
    '../src/__mocks__/prisma'
  )
  return { prisma: mod.prisma }
})

import { prisma } from '../src/lib/prisma'
import { type PrismaMock } from '../src/__mocks__/prisma'
import app from '../src/index'

// 👇 Inline Zod schema from analyze route
import { z } from 'zod'

const analyzeInputSchema = z.object({
  age: z.number().min(1),
  weight: z.number().positive(),
  height: z.number().positive(),
  bodyFat: z.number().min(0).max(100),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['low', 'moderate', 'high']),
  goal: z.enum(['lose', 'maintain', 'gain']),
})

const mockedPrisma = prisma as unknown as PrismaMock

describe('POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return analysis result for valid input', async () => {
    mockedPrisma.analysis.create.mockResolvedValue({
      id: 1,
      age: 25,
      weight: 70,
      height: 175,
      bodyFat: 15,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmi: 22.86,
      bmr: 1655.2,
      tdee: 2565.56,
      recommendedCalories: 2566,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    })

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: 25,
        weight: 70,
        height: 175,
        bodyFat: 15,
        gender: 'male',
        activityLevel: 'moderate',
        goal: 'maintain',
      }),
    })

    const res = await app.fetch(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toMatchObject({
      id: 1,
      bmi: 22.86,
      bmr: 1655.2,
      tdee: 2565.56,
      recommendedCalories: 2566,
      createdAt: '2024-01-01T00:00:00.000Z',
    })
  })

  it('should return 400 for missing required fields', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
    expect(typeof json.error).toBe('object')
  })

  it('should return 400 for invalid enums', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: 25,
        weight: 70,
        height: 175,
        bodyFat: 15,
        gender: 'non-binary',
        activityLevel: 'ultra-active',
        goal: 'bulk-like-hulk',
      }),
    })

    const res = await app.fetch(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
    expect(typeof json.error).toBe('object')
  })

  it('should return 405 for GET request', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'GET',
    })

    const res = await app.fetch(req)
    expect([404, 405]).toContain(res.status)
  })

  it('should return 400 for empty body', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    })

    const res = await app.fetch(req)
    expect([400, 422]).toContain(res.status)
  })

  it('should return 400 for partially invalid body', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: -5,
        weight: 0,
        height: 'invalid',
        gender: 'male',
        activityLevel: 'moderate',
        goal: 'maintain',
      }),
    })

    const res = await app.fetch(req)
    expect(res.status).toBe(400)
  })

  it('should return 400 for valid JSON but schema mismatch', async () => {
  const req = new Request('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 'twenty' }), // valid JSON, fails Zod
  })

  const res = await app.fetch(req)
  const json = await res.json()

  expect(res.status).toBe(400)
  expect(json.error).toBeDefined()
  expect(typeof json.error).toBe('object')
  })

  it('should return 400 when JSON is valid but Zod validation fails (safeParse branch)', async () => {
  const req = new Request('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Missing required fields like age, etc.
      age: 'twenty-five', // invalid type, triggers safeParse failure
      weight: 70,
      height: 175,
      bodyFat: 15,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
    }),
  })

  const res = await app.fetch(req)
  const json = await res.json()

  expect(res.status).toBe(400)
  expect(json.error).toBeDefined()
})

})

describe('Zod validation for analyze input schema', () => {
  it('should fail for missing fields', () => {
    const result = analyzeInputSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('should fail for invalid gender', () => {
    const result = analyzeInputSchema.safeParse({
      age: 25,
      weight: 70,
      height: 175,
      bodyFat: 15,
      gender: 'alien',
      activityLevel: 'moderate',
      goal: 'maintain',
    })
    expect(result.success).toBe(false)
  })

  it('should pass for valid input', () => {
    const result = analyzeInputSchema.safeParse({
      age: 30,
      weight: 65,
      height: 160,
      bodyFat: 20,
      gender: 'female',
      activityLevel: 'low',
      goal: 'lose',
    })
    expect(result.success).toBe(true)
  })
})
