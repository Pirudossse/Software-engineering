import express, { Router } from 'express'

const router = Router()

const doctors = [
  { id: 1, name: 'Dr. Sarah Lee', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Amir Khan', specialty: 'Pediatrics' }
]

router.get('/api/doctors', (_req, res) => {
  res.status(200).json(doctors)
})

router.post('/api/doctors', express.json(), (req, res) => {
  const { name, specialty } = req.body
  if (!name || !specialty) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const newDoctor = { id: doctors.length + 1, name, specialty }
  doctors.push(newDoctor)
  res.status(201).json(newDoctor)
})

export default router
