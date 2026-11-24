import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'

const booking = {
  userId: 1,
  roomId: 1,
  startTime: '2026-12-01T09:00:00Z',
  endTime: '2026-12-01T11:00:00Z'
}

describe('Bookings API', () => {
  let id

  beforeEach(async () => {
    const res = await request(app).get('/api/bookings')

    for (const b of res.body) {
      await request(app).delete(`/api/bookings/${b.id}`)
    }

    const created = await request(app)
      .post('/api/bookings')
      .send(booking)

    id = created.body.id
  })

  it('GET returns all bookings', async () => {
    const res = await request(app).get('/api/bookings')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(1)
  })

  it('GET returns a booking by ID', async () => {
    const res = await request(app)
      .get(`/api/bookings/${id}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(id)
  })

  it('GET returns 404 for an unknown booking', async () => {
    const res = await request(app)
      .get('/api/bookings/999999')

    expect(res.status).toBe(404)
  })

  it('POST creates a booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...booking, roomId: 2 })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
  })

  it('POST rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ userId: 1 })

    expect(res.status).toBe(400)
  })

  it('POST rejects invalid dates', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ ...booking, startTime: 'invalid' })

    expect(res.status).toBe(400)
  })

  it('POST rejects incorrect time order', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        ...booking,
        endTime: '2026-12-01T08:00:00Z'
      })

    expect(res.status).toBe(400)
  })

  it('POST rejects overlapping bookings', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send(booking)

    expect(res.status).toBe(409)
  })

  it('POST accepts consecutive bookings', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        ...booking,
        startTime: '2026-12-01T11:00:00Z',
        endTime: '2026-12-01T12:00:00Z'
      })

    expect(res.status).toBe(201)
  })

  it('PUT updates a booking', async () => {
    const res = await request(app)
      .put(`/api/bookings/${id}`)
      .send({ userId: 2 })

    expect(res.status).toBe(200)
    expect(res.body.userId).toBe(2)
    expect(res.body.id).toBe(id)
  })

  it('PUT rejects invalid data', async () => {
    const res = await request(app)
      .put(`/api/bookings/${id}`)
      .send({ roomId: -1 })

    expect(res.status).toBe(400)
  })

  it('PUT rejects overlapping bookings', async () => {
    const created = await request(app)
      .post('/api/bookings')
      .send({ ...booking, roomId: 2 })

    const res = await request(app)
      .put(`/api/bookings/${created.body.id}`)
      .send({ roomId: 1 })

    expect(res.status).toBe(409)
  })

  it('PUT returns 404 for an unknown booking', async () => {
    const res = await request(app)
      .put('/api/bookings/999999')
      .send({ userId: 2 })

    expect(res.status).toBe(404)
  })

  it('DELETE removes a booking', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${id}`)

    expect(res.status).toBe(204)

    const check = await request(app)
      .get(`/api/bookings/${id}`)

    expect(check.status).toBe(404)
  })

  it('DELETE returns 404 for an unknown booking', async () => {
    const res = await request(app)
      .delete('/api/bookings/999999')

    expect(res.status).toBe(404)
  })
})
