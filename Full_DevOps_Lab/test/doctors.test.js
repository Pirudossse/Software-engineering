import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Doctors API', () => {
  it('GET /api/doctors should return an array', async () => {
    const res = await request(app).get('/api/doctors')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('POST /api/doctors should add a new doctor', async () => {
    const res = await request(app)
      .post('/api/doctors')
      .send({ name: 'Dr. Lee', specialty: 'Neurology' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.specialty).toBe('Neurology')
  })

  it('POST /api/doctors should return 400 when a field is missing', async () => {
    const res = await request(app)
      .post('/api/doctors')
      .send({ name: 'Dr. NoSpecialty' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Missing required fields')
  })
})
