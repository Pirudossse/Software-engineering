import { Router } from 'express'

const router = Router()
const bookings = []
let nextId = 1

function validateBooking (booking) {
  const { userId, roomId, startTime, endTime } = booking

  if (!Number.isInteger(userId) || userId <= 0 ||
      !Number.isInteger(roomId) || roomId <= 0) {
    return 'Invalid userId or roomId'
  }

  if (typeof startTime !== 'string' ||
      typeof endTime !== 'string' ||
      !Number.isFinite(Date.parse(startTime)) ||
      !Number.isFinite(Date.parse(endTime))) {
    return 'Invalid booking dates'
  }

  if (Date.parse(startTime) >= Date.parse(endTime)) {
    return 'End time must be after start time'
  }

  return null
}

function hasConflict (booking, exceptId) {
  return bookings.some(b =>
    b.id !== exceptId &&
    b.roomId === booking.roomId &&
    Date.parse(booking.startTime) < Date.parse(b.endTime) &&
    Date.parse(booking.endTime) > Date.parse(b.startTime)
  )
}

// GET all
router.get('/api/bookings', (_req, res) => {
  res.status(200).json(bookings)
})

// GET by ID
router.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(
    b => b.id === Number(req.params.id)
  )

  if (!booking) {
    return res.status(404).json({
      error: 'Booking not found'
    })
  }

  res.status(200).json(booking)
})

// POST
router.post('/api/bookings', (req, res) => {
  const {
    userId, roomId, startTime, endTime
  } = req.body ?? {}

  const booking = {
    userId, roomId, startTime, endTime
  }

  const error = validateBooking(booking)

  if (error) {
    return res.status(400).json({ error })
  }

  if (hasConflict(booking)) {
    return res.status(409).json({
      error: 'Room already booked for this time'
    })
  }

  const newBooking = {
    id: nextId++,
    ...booking
  }

  bookings.push(newBooking)
  res.status(201).json(newBooking)
})

// PUT
router.put('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = bookings.findIndex(b => b.id === id)

  if (index === -1) {
    return res.status(404).json({
      error: 'Booking not found'
    })
  }

  const updated = { ...bookings[index] }

  for (const field of [
    'userId', 'roomId', 'startTime', 'endTime'
  ]) {
    if (req.body?.[field] !== undefined) {
      updated[field] = req.body[field]
    }
  }

  const error = validateBooking(updated)

  if (error) {
    return res.status(400).json({ error })
  }

  if (hasConflict(updated, id)) {
    return res.status(409).json({
      error: 'Room already booked for this time'
    })
  }

  bookings[index] = updated
  res.status(200).json(updated)
})

// DELETE
router.delete('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(
    b => b.id === Number(req.params.id)
  )

  if (index === -1) {
    return res.status(404).json({
      error: 'Booking not found'
    })
  }

  bookings.splice(index, 1)
  res.status(204).end()
})

export default router
