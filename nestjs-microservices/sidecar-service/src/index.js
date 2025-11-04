import express from 'express'
import morgan from 'morgan'
import { register, collectDefaultMetrics } from 'prom-client'
import { setupLogger } from './logger.js'
import { setupProxy } from './proxy.js'
import { setupTracing } from './tracing.js'
import { verifyCert } from './security.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(morgan('combined'))

// Inicializar módulos
const logger = setupLogger()
setupTracing()
setupProxy(app)
collectDefaultMetrics()

// Logging Centralizado
app.post('/log', (req, res) => {
  const { service, level, message } = req.body
  logger[level || 'info'](`[${service}] ${message}`)
  res.status(200).send({ status: 'logged' })
})

// Health Check
app.get('/health', (_, res) => res.send({ status: 'healthy' }))

// Métricas Prometheus
app.get('/metrics', async (_, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

// Verificación de certificados SSL
app.get('/verify-ssl', async (req, res) => {
  const { host } = req.query
  try {
    const valid = await verifyCert(host)
    res.send({ host, valid })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

app.listen(9100, () => console.log('🧩 Sidecar running on port 9100'))
