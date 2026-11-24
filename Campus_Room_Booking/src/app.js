import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { errorHandler } from './utils/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(express.json())

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

const routesDir = path.join(__dirname, 'routes')
const routeFiles = fs.readdirSync(routesDir).filter((f) => f.endsWith('.route.js'))
for (const file of routeFiles) {
  const mod = await import(pathToFileURL(path.join(routesDir, file)).href)
  app.use('/', mod.default)
}

app.use(errorHandler)

export default app
