import { createProxyMiddleware } from 'http-proxy-middleware'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 }) // cache de 30s

export function setupProxy(app) {
  app.use('/proxy', (req, res, next) => {
    const key = req.originalUrl
    const cached = cache.get(key)
    if (cached) return res.send(cached)
    next()
  })

  app.use('/proxy', createProxyMiddleware({
    target: 'http://bw-post-service:9002',
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      let data = ''
      proxyRes.on('data', chunk => (data += chunk))
      proxyRes.on('end', () => {
        cache.set(req.originalUrl, data)
      })
    }
  }))
}
