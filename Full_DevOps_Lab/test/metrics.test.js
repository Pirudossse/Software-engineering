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

  it('updates doctorsCount when a doctor is added', async () => {
    const before = await request(app).get('/api/metrics')

    const created = await request(app)
      .post('/api/doctors')
      .send({ name: 'Dr. Test', specialty: 'Cardiology' })

    expect(created.status).toBe(201)

    const after = await request(app).get('/api/metrics')
    const doctors = await request(app).get('/api/doctors')

    expect(after.status).toBe(200)
    expect(after.body.doctorsCount).toBe(before.body.doctorsCount + 1)
    expect(after.body.doctorsCount).toBe(doctors.body.length)
  })

  it('updates patientsCount when a patient is added', async () => {
    const before = await request(app).get('/api/metrics')

    const created = await request(app)
      .post('/api/patients')
      .send({ name: 'Test Patient', age: 25 })

    expect(created.status).toBe(201)

    const after = await request(app).get('/api/metrics')
    const patients = await request(app).get('/api/patients')

    expect(after.status).toBe(200)
    expect(after.body.patientsCount).toBe(before.body.patientsCount + 1)
    expect(after.body.patientsCount).toBe(patients.body.length)
  })

  it('updates appointmentsCount when an appointment is added', async () => {
    const before = await request(app).get('/api/metrics')

    const created = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Test', patient: 'Test Patient', date: '2026-12-01' })

    expect(created.status).toBe(201)

    const after = await request(app).get('/api/metrics')

    expect(after.status).toBe(200)
    expect(after.body.appointmentsCount).toBe(before.body.appointmentsCount + 1)
  })
})
