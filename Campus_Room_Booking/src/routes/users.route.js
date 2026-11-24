/**
 * CRUD for /api/users (SCRUM-17): campus members who can book rooms.
 * A user has: id, name, email (unique, case-insensitive) and role.
 * Auto-mounted by app.js (every *.route.js file). Data is kept in memory.
 */
import { Router } from 'express'

const router = Router()

const ROLES = ['student', 'teacher', 'admin']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const users = [
  { id: 1, name: 'Alice Martin', email: 'alice.martin@campus.fr', role: 'student' },
  { id: 2, name: 'Bruno Leroy', email: 'bruno.leroy@campus.fr', role: 'teacher' }
]

const nextId = () => (users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1)

const emailTaken = (email, exceptId) =>
  users.some((u) => u.id !== exceptId && u.email.toLowerCase() === email.toLowerCase())

/** Returns an error message for a provided field, or null when it is valid. */
function invalidField (field, value) {
  if (field === 'name' && (typeof value !== 'string' || !value.trim())) return 'Invalid name'
  if (field === 'email' && (typeof value !== 'string' || !EMAIL_RE.test(value))) return 'Invalid email'
  if (field === 'role' && !ROLES.includes(value)) return 'Invalid role'
  return null
}

// GET all
router.get('/api/users', (_req, res) => {
  res.status(200).json(users)
})

// GET by ID
router.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id))
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.status(200).json(user)
})

// POST
router.post('/api/users', (req, res) => {
  const { name, email, role } = req.body ?? {}
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const problem = invalidField('name', name) ?? invalidField('email', email) ?? invalidField('role', role)
  if (problem) {
    return res.status(400).json({ error: problem })
  }
  if (emailTaken(email)) {
    return res.status(409).json({ error: 'Email already in use' })
  }
  const newUser = { id: nextId(), name: name.trim(), email, role }
  users.push(newUser)
  res.status(201).json(newUser)
})

// PUT
router.put('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  // Only these fields can change; the id never does.
  const updates = {}
  for (const field of ['name', 'email', 'role']) {
    if (req.body?.[field] === undefined) continue
    const problem = invalidField(field, req.body[field])
    if (problem) {
      return res.status(400).json({ error: problem })
    }
    updates[field] = field === 'name' ? req.body.name.trim() : req.body[field]
  }
  if (updates.email && emailTaken(updates.email, id)) {
    return res.status(409).json({ error: 'Email already in use' })
  }
  users[index] = { ...users[index], ...updates }
  res.status(200).json(users[index])
})

// DELETE
router.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === Number(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  users.splice(index, 1)
  res.status(204).end()
})

export default router
