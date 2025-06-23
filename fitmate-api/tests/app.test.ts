// tests/app.test.ts
import { describe, it, expect } from 'vitest'
import app from '../src/index'

describe('Global app behavior', () => {
  it('should hit the global error handler', async () => {
    // Simulate a route that throws an error
    const errorRoute = app.get('/error', (c) => {
      throw new Error('Test error')
    })

    const req = new Request('http://localhost/error')
    const res = await errorRoute.fetch(req)
    const text = await res.text()

    expect(res.status).toBe(500)
    expect(text).toBe('Internal Server Error')
  })
})


