import express from 'express'

const router = express.Router()

router.get('/api/metrics', (req, res) => {
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss
  }

  res.status(200).json(metrics)
})

export default router
