/**
 * Integration test for GET /version.
 * Focus: HTTP behavior & payload shape.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

describe('GET /version', () => {
  it('returns package version as a non-empty string', async () => {
    const res = await request(app).get('/version')
    expect(res.status).toBe(200)
    expect(typeof res.body.version).toBe('string')
    expect(res.body.version.length).toBeGreaterThan(0)
  })

  it('responds with JSON content-type', async () => {
    const res = await request(app).get('/version')
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

  it('returns exactly { version } matching package.json (x.y.z)', async () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))
    const res = await request(app).get('/version')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ version: pkg.version })
    expect(res.body.version).toMatch(/^\d+\.\d+\.\d+/)
  })
})
