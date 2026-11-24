import express from 'express'
import buildingsRouter from './routes/buildings.route.js'

const app = express()

app.use(express.json())
app.use('/api/buildings', buildingsRouter)

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l’API du Campus du Parc'
  })
})

export default app
