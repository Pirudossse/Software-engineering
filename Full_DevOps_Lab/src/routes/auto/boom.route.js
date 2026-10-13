/**
 * GET /boom → triggers an error to exercise the global error handler.
 * Disabled in production (falls through to 404): it is a test/demo tool only.
 */
import { Router } from 'express'

const router = Router()

router.get('/boom', (_req, _res, next) => {
  if (process.env.NODE_ENV === 'production') return next()
  const err = new Error('Boom!')
  err.status = 500
  next(err)
})

export default router
