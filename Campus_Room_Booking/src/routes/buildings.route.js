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
    id: buildings.length + 1,
    name: buildingName,
    campus: campusName
  }

  buildings.push(newBuilding)
  return res.status(201).json(newBuilding)
})

export default router
