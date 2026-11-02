/**
 * Integration tests for /api/patients.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Patients API', () => {
  it('GET /api/patients should return an array', async () => {
    const res = await request(app).get('/api/patients')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('POST /api/patients should add a new patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'Marie', age: 29 })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Marie')
    expect(res.body.age).toBe(29)
  })

  it('POST /api/patients then GET returns the new patient', async () => {
    await request(app).post('/api/patients').send({ name: 'Paul', age: 52 })
    const res = await request(app).get('/api/patients')
    expect(res.body.some(p => p.name === 'Paul')).toBe(true)
  })

  it('POST /api/patients accepts age 0 (newborn)', async () => {
    const res = await request(app).post('/api/patients').send({ name: 'Baby', age: 0 })
    expect(res.status).toBe(201)
  })

  it('POST /api/patients without age should return 400', async () => {
    const res = await request(app).post('/api/patients').send({ name: 'No Age' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('POST /api/patients without body should return 400', async () => {
    const res = await request(app).post('/api/patients')
    expect(res.status).toBe(400)
  })

  it('POST /api/patients with a non-numeric age should return 400', async () => {
    const res = await request(app).post('/api/patients').send({ name: 'Bad', age: 'thirty' })
    expect(res.status).toBe(400)
  })

  it('POST /api/patients with a negative age should return 400', async () => {
    const res = await request(app).post('/api/patients').send({ name: 'Bad', age: -3 })
    expect(res.status).toBe(400)
  })
})
