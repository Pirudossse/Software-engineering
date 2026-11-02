import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'

describe('GET /api/metrics', () => {
  it('returns status 200 and JSON', async () => {
    const res = await request(app).get('/api/metrics')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/json')
  })

  it('returns a valid uptime', async () => {
    const res = await request(app).get('/api/metrics')

    expect(typeof res.body.uptime).toBe('number')
    expect(res.body.uptime).toBeGreaterThanOrEqual(0)
  })

  it('returns a valid memory usage', async () => {
    const res = await request(app).get('/api/metrics')

    expect(typeof res.body.memoryUsage).toBe('number')
    expect(res.body.memoryUsage).toBeGreaterThan(0)
  })
})
