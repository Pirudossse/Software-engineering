/**
 * GET /info → merges two small helpers for easy unit testing.
 * Returns: { name, version, node, uptime }
 */
import { Router } from 'express'
import { getPackageInfo, getRuntimeInfo } from '../../utils/appInfo.js'

const router = Router()

router.get('/info', (_req, res) => {
  const info = { ...getPackageInfo(), ...getRuntimeInfo() }
  // uptime changes on every call: never serve a cached copy
  res.set('Cache-Control', 'no-store')
  res.status(200).json(info)
})

export default router
