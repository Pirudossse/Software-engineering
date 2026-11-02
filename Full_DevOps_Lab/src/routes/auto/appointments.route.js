import { Router } from 'express'

const router = Router()
const appointments = []

router.post('/api/appointments', (req, res) => {
  const { doctor, patient, date } = req.body ?? {}

  // Vérifier que les trois champs sont des textes non vides
  const fields = [doctor, patient, date]
  const validFields = fields.every(
    field => typeof field === 'string' && field.trim() !== ''
  )

  if (!validFields) {
    return res.status(400).json({
      error: 'Doctor, patient and date are required'
    })
  }

  // Vérifier que la date est interprétable
  if (Number.isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: 'Invalid date'
    })
  }

  const appointment = {
    id: appointments.length + 1,
    doctor: doctor.trim(),
    patient: patient.trim(),
    date: date.trim()
  }

  appointments.push(appointment)

  return res.status(201).json(appointment)
})

export default router
