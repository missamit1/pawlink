import fs from 'node:fs'
import {
  contentType,
  defaultSiteRoot,
  isAppPath,
  resolveSiteFile,
} from './lib/marketingPaths.js'

const siteRoot = defaultSiteRoot()

function marketingMiddleware(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()

  const rawUrl = req.url || '/'
  const urlPath = decodeURIComponent(rawUrl.split('?')[0] || '/')

  if (isAppPath(urlPath)) return next()

  const filePath = resolveSiteFile(siteRoot, urlPath)
  if (!filePath) return next()

  res.setHeader('Content-Type', contentType(filePath))
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  fs.createReadStream(filePath).pipe(res)
}

export function marketingRootPlugin() {
  return {
    name: 'pawlink-marketing-root',
    configureServer(server) {
      server.middlewares.use(marketingMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(marketingMiddleware)
    },
  }
}
