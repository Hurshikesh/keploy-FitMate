import { describe, it, expect } from 'vitest'
import app from '../src/index'

describe('App Entry - Hono Server', () => {
  it('should return 404 for unknown route', async () => {
    const req = new Request('http://localhost/non-existent', {
      method: 'GET',
    })

    const res = await app.fetch(req)

    expect(res.status).toBe(404)

    const contentType = res.headers.get('content-type') || ''
    const text = await res.text()

    if (contentType.includes('application/json')) {
      const json = JSON.parse(text)
      expect(json).toHaveProperty('error')
    } else {
      // fallback: just check it returned a non-empty 404 body
      expect(text.length).toBeGreaterThan(0)
    }
  })

  it('should return correct CORS headers', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3002',
        'Access-Control-Request-Method': 'POST',
      },
    })

    const res = await app.fetch(req)

    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
    expect(res.headers.get('access-control-allow-methods')).toContain('POST')
  })
})
