import request from 'supertest'
import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import app from '../src/app.js'
import { buildings } from '../src/data/buildings.js'

const initialBuildings = structuredClone(buildings)

function resetBuildings () {
  buildings.splice(0, buildings.length, ...structuredClone(initialBuildings))
}

beforeEach(resetBuildings)
afterEach(resetBuildings)

describe('Buildings API', () => {
  it('returns buildings A, B and C as JSON', async () => {
    const res = await request(app).get('/api/buildings')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/json')
    expect(res.body).toEqual([
      { id: 1, name: 'A', campus: 'Campus du Parc' },
      { id: 2, name: 'B', campus: 'Campus du Parc' },
      { id: 3, name: 'C', campus: 'Campus du Parc' }
    ])
  })

  it('normalizes a new name and makes the building available in GET', async () => {
    const created = await request(app)
      .post('/api/buildings')
      .send({ name: ' d ', id: 99, campus: 'Other campus' })

    expect(created.status).toBe(201)
    expect(created.body).toEqual({ id: 4, name: 'D', campus: 'Campus du Parc' })

    const list = await request(app).get('/api/buildings')
    expect(list.body).toHaveLength(4)
    expect(list.body).toContainEqual(created.body)
  })

  it('assigns distinct IDs to successive creations', async () => {
    const first = await request(app).post('/api/buildings').send({ name: 'D' })
    const second = await request(app).post('/api/buildings').send({ name: 'E' })

    expect(first.status).toBe(201)
    expect(second.status).toBe(201)
    expect(first.body.id).toBe(4)
    expect(second.body.id).toBe(5)
  })

  it.each([{}, { name: '' }, { name: '   ' }, { name: 123 }, { name: null }, { name: [] }])(
    'rejects invalid input %j without changing the list', async body => {
      const res = await request(app).post('/api/buildings').send(body)

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Building name is required')
      expect(buildings).toEqual(initialBuildings)
    }
  )

  it('rejects a request without a body', async () => {
    const res = await request(app).post('/api/buildings')
    expect(res.status).toBe(400)
    expect(buildings).toEqual(initialBuildings)
  })

  it.each(['A', ' a '])('rejects duplicate name %s', async name => {
    const res = await request(app).post('/api/buildings').send({ name })

    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Building already exists')
    expect(buildings).toEqual(initialBuildings)
  })
})
