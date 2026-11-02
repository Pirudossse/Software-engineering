import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('POST /api/appointments', () => {
  it('creates an appointment with valid data', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        doctor: 'Dr. Lee',
        patient: 'Alice',
        date: '2026-11-10T14:00:00Z'
      })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      doctor: 'Dr. Lee',
      patient: 'Alice',
      date: '2026-11-10T14:00:00Z'
    })
    expect(res.body.id).toEqual(expect.any(Number))
  })

  it('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('rejects a blank field', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        doctor: '   ',
        patient: 'Alice',
        date: '2026-11-10'
      })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('rejects an invalid date', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        doctor: 'Dr. Lee',
        patient: 'Alice',
        date: 'invalid-date'
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid date')
  })
})
