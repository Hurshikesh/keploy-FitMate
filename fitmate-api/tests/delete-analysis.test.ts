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

describe('DELETE /api/delete/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete analysis and return 200 for valid ID', async () => {
    mockedPrisma.recommendation.deleteMany.mockResolvedValue({ count: 1 })
    mockedPrisma.analysis.delete.mockResolvedValue({ id: 1 } as any)

    const req = new Request('http://localhost/api/delete/1', {
      method: 'DELETE'
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(200)
    expect(json).toEqual({ success: true })
  })

  it('should return 400 if ID is not a number', async () => {
    const req = new Request('http://localhost/api/delete/abc', {
      method: 'DELETE'
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(400)
    expect(json).toEqual({ error: 'Invalid ID' })
  })

  it('should return 404 if prisma throws error (not found)', async () => {
    mockedPrisma.recommendation.deleteMany.mockResolvedValue({ count: 0 })
    mockedPrisma.analysis.delete.mockRejectedValue(new Error('Not Found'))

    const req = new Request('http://localhost/api/delete/999', {
      method: 'DELETE'
    })

    const res = await app.fetch(req)
    const json = await parseJsonSafely(res)

    expect(res.status).toBe(404)
    expect(json).toEqual({ error: 'Not Found or already deleted' })
  })

  it('should return 405 if method is not DELETE', async () => {
    const req = new Request('http://localhost/api/delete/1', {
      method: 'GET'
    })

    const res = await app.fetch(req)
    expect([404, 405]).toContain(res.status)
  })
})

