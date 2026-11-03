import express from 'express'
import { doctors } from './doctors.route.js'
import { patients } from './patients.route.js'
import { appointments } from './appointments.route.js'

const router = express.Router()

router.get('/api/metrics', (req, res) => {
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss,
    doctorsCount: doctors.length,
    patientsCount: patients.length,
    appointmentsCount: appointments.length
  }

  res.status(200).json(metrics)
})

export default router
