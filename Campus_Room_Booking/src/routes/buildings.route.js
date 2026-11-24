import express from 'express'
import { buildings, campusName } from '../data/buildings.js'

const router = express.Router()

// GET /api/buildings : consulter les bâtiments du campus.
router.get('/api/buildings', (_req, res) => {
  res.status(200).json(buildings)
})

// POST /api/buildings : ajouter un bâtiment sans doublon.
router.post('/api/buildings', (req, res) => {
  const { name } = req.body ?? {}

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Building name is required' })
  }

  const buildingName = name.trim().toUpperCase()
  const alreadyExists = buildings.some(building => {
    return building.name === buildingName
  })

  if (alreadyExists) {
    return res.status(409).json({ error: 'Building already exists' })
  }

  const newBuilding = {
    id: Math.max(0, ...buildings.map(building => building.id)) + 1,
    name: buildingName,
    campus: campusName
  }

  buildings.push(newBuilding)
  return res.status(201).json(newBuilding)
})

router.put('/api/buildings/:id', (req, res) => {
  const building = buildings.find(item => item.id === Number(req.params.id))
  if (!building) {
    return res.status(404).json({ error: 'Building not found' })
  }

  const { name } = req.body ?? {}
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Building name is required' })
  }

  const buildingName = name.trim().toUpperCase()
  if (buildings.some(item => item.id !== building.id && item.name === buildingName)) {
    return res.status(409).json({ error: 'Building already exists' })
  }

  building.name = buildingName
  return res.status(200).json(building)
})

router.delete('/api/buildings/:id', (req, res) => {
  const index = buildings.findIndex(item => item.id === Number(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Building not found' })
  }

  buildings.splice(index, 1)
  return res.status(204).send()
})

export default router
