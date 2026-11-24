import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Rooms API', () => {
  it('GET /api/rooms returns an array of rooms', async () => {
    const res = await request(app).get('/api/rooms')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('GET /api/rooms/:id returns one room', async () => {
    const res = await request(app).get('/api/rooms/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
  })

  it('GET /api/rooms/:id returns 404 for an unknown room', async () => {
    const res = await request(app).get('/api/rooms/999')
    expect(res.status).toBe(404)
  })

  it('POST /api/rooms creates a room', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ name: 'C301', building: 'Building C', capacity: 25 })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('C301')
  })

  it('POST /api/rooms returns 400 when a field is missing', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ name: 'No building' })
    expect(res.status).toBe(400)
  })

  it('PUT /api/rooms/:id updates a room', async () => {
    const res = await request(app)
      .put('/api/rooms/1')
      .send({ capacity: 40 })
    expect(res.status).toBe(200)
    expect(res.body.capacity).toBe(40)
    expect(res.body.name).toBe('A101')
  })

  it('PUT /api/rooms/:id returns 404 for an unknown room', async () => {
    const res = await request(app)
      .put('/api/rooms/999')
      .send({ capacity: 40 })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/rooms/:id deletes a room', async () => {
    const res = await request(app).delete('/api/rooms/2')
    expect(res.status).toBe(204)
    const check = await request(app).get('/api/rooms/2')
    expect(check.status).toBe(404)
  })

  it('DELETE /api/rooms/:id returns 404 for an unknown room', async () => {
    const res = await request(app).delete('/api/rooms/999')
    expect(res.status).toBe(404)
  })
})
