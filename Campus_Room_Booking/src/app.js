import express from 'express'
import usersRouter from './routes/users.routes.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l’API du Campus du Parc'
  })
})

app.use('/api/users', usersRouter)

// Error handling: keep last
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
