import request from 'supertest'
import { it, expect } from 'vitest'
import app from '../src/app.js'

it('returns the Campus du Parc welcome message', async () => {
  const res = await request(app).get('/')
  expect(res.status).toBe(200)
  expect(res.body.message).toBe('Bienvenue sur l’API du Campus du Parc')
})
