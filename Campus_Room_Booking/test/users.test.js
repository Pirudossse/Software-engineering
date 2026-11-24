/**
 * Integration tests for CRUD /api/users (SCRUM-17).
 * Each test that changes data creates its own user, so the tests do not
 * depend on each other or on the order they run in.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

let counter = 0
const uniqueEmail = () => `test.user${++counter}.${Date.now()}@campus.fr`

function createUser (overrides = {}) {
  return request(app)
    .post('/api/users')
    .send({ name: 'Test User', email: uniqueEmail(), role: 'student', ...overrides })
}

describe('Users API', () => {
  describe('GET', () => {
    it('GET /api/users returns an array of users', async () => {
      const res = await request(app).get('/api/users')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })

    it('GET /api/users/:id returns one user', async () => {
      const res = await request(app).get('/api/users/1')
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(1)
      expect(res.body).toHaveProperty('email')
      expect(res.body).toHaveProperty('role')
    })

    it('GET /api/users/:id returns 404 for an unknown user', async () => {
      const res = await request(app).get('/api/users/999999')
      expect(res.status).toBe(404)
      expect(res.body).toEqual({ error: 'User not found' })
    })
  })

  describe('POST', () => {
    it('creates a user and returns 201 with an id', async () => {
      const email = uniqueEmail()
      const res = await createUser({ name: '  Clara Dupont ', email, role: 'teacher' })
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body).toMatchObject({ name: 'Clara Dupont', email, role: 'teacher' })
    })

    it('returns 400 when a field is missing', async () => {
      const res = await request(app).post('/api/users').send({ name: 'No email' })
      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Missing required fields' })
    })

    it('returns 400 when there is no body at all', async () => {
      const res = await request(app).post('/api/users')
      expect(res.status).toBe(400)
    })

    it('returns 400 for an invalid email', async () => {
      const res = await createUser({ email: 'not-an-email' })
      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Invalid email' })
    })

    it('returns 400 for an unknown role', async () => {
      const res = await createUser({ role: 'superhero' })
      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Invalid role' })
    })

    it('returns 400 for a name that is not a non-empty string', async () => {
      const res = await createUser({ name: 42 })
      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Invalid name' })
    })

    it('returns 409 when the email is already used, ignoring case', async () => {
      const email = uniqueEmail()
      expect((await createUser({ email })).status).toBe(201)
      const res = await createUser({ email: email.toUpperCase() })
      expect(res.status).toBe(409)
      expect(res.body).toEqual({ error: 'Email already in use' })
    })

    it('returns 400 for a malformed JSON body (error middleware)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('{"name": ')
      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Invalid JSON body' })
    })
  })

  describe('PUT', () => {
    it('updates the given fields and keeps the others and the id', async () => {
      const created = (await createUser({ name: 'Before', role: 'student' })).body
      const res = await request(app)
        .put(`/api/users/${created.id}`)
        .send({ name: 'After', role: 'admin', id: 12345 })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ id: created.id, name: 'After', email: created.email, role: 'admin' })
    })

    it('can change the email', async () => {
      const created = (await createUser()).body
      const email = uniqueEmail()
      const res = await request(app).put(`/api/users/${created.id}`).send({ email })
      expect(res.status).toBe(200)
      expect(res.body.email).toBe(email)
    })

    it('accepts re-sending the same email', async () => {
      const created = (await createUser()).body
      const res = await request(app).put(`/api/users/${created.id}`).send({ email: created.email })
      expect(res.status).toBe(200)
    })

    it('returns 404 for an unknown user', async () => {
      const res = await request(app).put('/api/users/999999').send({ name: 'Ghost' })
      expect(res.status).toBe(404)
      expect(res.body).toEqual({ error: 'User not found' })
    })

    it('returns 400 for an invalid value and does not change the user', async () => {
      const created = (await createUser()).body
      const res = await request(app).put(`/api/users/${created.id}`).send({ role: 'superhero' })
      expect(res.status).toBe(400)
      const check = await request(app).get(`/api/users/${created.id}`)
      expect(check.body.role).toBe('student')
    })

    it('returns 409 when the email belongs to another user', async () => {
      const first = (await createUser()).body
      const second = (await createUser()).body
      const res = await request(app).put(`/api/users/${second.id}`).send({ email: first.email })
      expect(res.status).toBe(409)
    })

    it('leaves the user unchanged when there is no body', async () => {
      const created = (await createUser()).body
      const res = await request(app).put(`/api/users/${created.id}`)
      expect(res.status).toBe(200)
      expect(res.body).toEqual(created)
    })
  })

  describe('DELETE', () => {
    it('deletes a user, then returns 404 when reading it', async () => {
      const created = (await createUser()).body
      const res = await request(app).delete(`/api/users/${created.id}`)
      expect(res.status).toBe(204)
      const check = await request(app).get(`/api/users/${created.id}`)
      expect(check.status).toBe(404)
    })

    it('returns 404 for an unknown user', async () => {
      const res = await request(app).delete('/api/users/999999')
      expect(res.status).toBe(404)
    })
  })
})
