import { describe, it, expect, vi } from 'vitest'

// ✅ Declare mock at top-level due to hoisting
const serveMock = vi.fn()

// ✅ Mock before import!
vi.mock('@hono/node-server', async () => {
  const actual = await vi.importActual<typeof import('@hono/node-server')>('@hono/node-server')
  return {
    ...actual,
    serve: serveMock,
  }
})

describe('index.ts - branch coverage', () => {
  it('should NOT call serve() when NODE_ENV is "test"', async () => {
    process.env.NODE_ENV = 'test'
    serveMock.mockClear()

    const mod = await import('../src/index')
    mod.serveIfNotTest()

    expect(serveMock).not.toHaveBeenCalled()
  })

  it('should call serve() when NODE_ENV is NOT "test"', async () => {
    process.env.NODE_ENV = 'production'
    serveMock.mockClear()

    const mod = await import('../src/index')
    mod.serveIfNotTest()

    expect(serveMock).toHaveBeenCalled()
  })
})
