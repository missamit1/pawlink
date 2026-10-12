import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app } from './server.js'
import { loadRootEnv } from '../lib/loadRootEnv.js'
import {
  contentType,
  isAppPath,
  resolveSiteFile,
} from '../lib/marketingPaths.js'
import { startLiveCollar } from '../simulator/simulator.js'

loadRootEnv(import.meta.url)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distRoot = path.resolve(projectRoot, 'dist')
const siteRoot = path.resolve(distRoot, 'site')
const spaIndex = path.resolve(distRoot, 'index.html')

const PORT = Number(process.env.PORT) || 3001
const enableLiveCollar = process.env.ENABLE_LIVE_COLLAR !== '0'

const SPA_ROUTES = [
  '/login',
  '/signup',
  '/dashboard',
  '/my-dogs',
  '/welcome-dog',
  '/safe-zone',
]

function sendFile(res, filePath) {
  res.setHeader('Content-Type', contentType(filePath))
  fs.createReadStream(filePath).pipe(res)
}

function isSpaRoute(urlPath) {
  return SPA_ROUTES.some(
    (prefix) => urlPath === prefix || urlPath.startsWith(`${prefix}/`),
  )
}

if (!fs.existsSync(spaIndex)) {
  console.error(
    '[PawLink] dist/ missing. Run: npm run build  (from project/)',
  )
  process.exit(1)
}

// Marketing site first so /index.html is the story — not the empty React shell.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()

  const urlPath = decodeURIComponent((req.path || '/').split('?')[0] || '/')

  if (urlPath.startsWith('/api')) return next()
  if (isSpaRoute(urlPath)) {
    return sendFile(res, spaIndex)
  }
  if (isAppPath(urlPath)) return next()

  const siteFile = resolveSiteFile(siteRoot, urlPath)
  if (siteFile) {
    if (req.method === 'HEAD') {
      res.setHeader('Content-Type', contentType(siteFile))
      return res.end()
    }
    return sendFile(res, siteFile)
  }

  return next()
})

// Product assets from Vite build (digital-twin, hashed /assets, …)
app.use(
  express.static(distRoot, {
    index: false,
    fallthrough: true,
    maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
  }),
)

// Deep links / unknown non-file paths → SPA
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()

  const urlPath = decodeURIComponent((req.path || '/').split('?')[0] || '/')
  if (urlPath.startsWith('/api')) return next()
  if (urlPath.includes('.')) {
    return res.status(404).send('Not found')
  }
  return sendFile(res, spaIndex)
})

app.listen(PORT, () => {
  console.log(`[PawLink] production on :${PORT}`)
  console.log(`[PawLink] marketing + SPA + API (same origin)`)
  if (enableLiveCollar) {
    startLiveCollar()
  } else {
    console.log('[PawLink] live collar off (ENABLE_LIVE_COLLAR=0)')
  }
})
