/**
 * Users routes (in-memory data).
 *  - GET  /api/users → list all users
 *  - POST /api/users → add a user ({ name, email })
 */
import { Router } from 'express'

const router = Router()

const users = [
  { id: 1, name: 'Alice Martin', email: 'alice.martin@example.com' },
  { id: 2, name: 'John Doe', email: 'john.doe@example.com' }
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.get('/api/users', (_req, res) => res.status(200).json(users))

router.post('/api/users', (req, res) => {
  const { name, email } = req.body ?? {}
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already used' })
  }
  const newUser = { id: users.length + 1, name, email }
  users.push(newUser)
  res.status(201).json(newUser)
})

export default router
