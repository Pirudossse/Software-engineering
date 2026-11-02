/**
 * Integration tests for /api/users.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Users API', () => {
  it('GET /api/users should return an array', async () => {
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('POST /api/users should add a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Julie Roy', email: 'julie.roy@example.com' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Julie Roy')
    expect(res.body.email).toBe('julie.roy@example.com')
  })

  it('POST /api/users then GET returns the new user', async () => {
    await request(app).post('/api/users').send({ name: 'Paul Noel', email: 'paul.noel@example.com' })
    const res = await request(app).get('/api/users')
    expect(res.body.some(u => u.email === 'paul.noel@example.com')).toBe(true)
  })

  it('POST /api/users without email should return 400', async () => {
    const res = await request(app).post('/api/users').send({ name: 'No Email' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('POST /api/users without body should return 400', async () => {
    const res = await request(app).post('/api/users')
    expect(res.status).toBe(400)
  })

  it('POST /api/users with an invalid email should return 400', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Bad', email: 'not-an-email' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid email')
  })

  it('POST /api/users with an existing email should return 409', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice Bis', email: 'alice.martin@example.com' })
    expect(res.status).toBe(409)
  })
})
