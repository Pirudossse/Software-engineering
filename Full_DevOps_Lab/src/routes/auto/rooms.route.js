import express, { Router } from 'express'

const router = Router()

const rooms = [
  { id: 1, name: 'A101', building: 'Building A', capacity: 30, equipment: ['projector'], available: true },
  { id: 2, name: 'B201', building: 'Building B', capacity: 50, equipment: ['projector', 'whiteboard'], available: true }
]

const nextId = () => (rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1)

router.get('/api/rooms', (_req, res) => {
  res.status(200).json(rooms)
})

router.get('/api/rooms/:id', (req, res) => {
  const room = rooms.find((r) => r.id === Number(req.params.id))
  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }
  res.status(200).json(room)
})

router.post('/api/rooms', express.json(), (req, res) => {
  const { name, building, capacity, equipment = [], available = true } = req.body
  if (!name || !building || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const newRoom = { id: nextId(), name, building, capacity, equipment, available }
  rooms.push(newRoom)
  res.status(201).json(newRoom)
})

router.put('/api/rooms/:id', express.json(), (req, res) => {
  const id = Number(req.params.id)
  const index = rooms.findIndex((r) => r.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Room not found' })
  }
  rooms[index] = { ...rooms[index], ...req.body, id }
  res.status(200).json(rooms[index])
})

router.delete('/api/rooms/:id', (req, res) => {
  const index = rooms.findIndex((r) => r.id === Number(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Room not found' })
  }
  rooms.splice(index, 1)
  res.status(204).end()
})

export default router
