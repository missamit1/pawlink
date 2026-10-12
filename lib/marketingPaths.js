import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const APP_PREFIXES = [
  '/login',
  '/signup',
  '/dashboard',
  '/my-dogs',
  '/welcome-dog',
  '/safe-zone',
  '/src',
  '/@',
  '/node_modules',
  '/api',
  '/digital-twin',
  '/dogs',
  '/models',
  '/safe-zone-membrane',
  '/auth-stage.jpg',
  '/icons.svg',
  '/site',
]

export function isAppPath(urlPath) {
  if (urlPath.startsWith('/@vite') || urlPath.startsWith('/__vite')) return true
  if (urlPath.startsWith('/@id') || urlPath.startsWith('/@fs')) return true
  return APP_PREFIXES.some(
    (prefix) => urlPath === prefix || urlPath.startsWith(`${prefix}/`),
  )
}

export function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8'
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
    return 'text/javascript; charset=utf-8'
  }
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8'
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8'
  if (filePath.endsWith('.svg')) return 'image/svg+xml'
  if (filePath.endsWith('.webp')) return 'image/webp'
  if (filePath.endsWith('.png')) return 'image/png'
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg'
  if (filePath.endsWith('.gif')) return 'image/gif'
  if (filePath.endsWith('.mp4')) return 'video/mp4'
  if (filePath.endsWith('.webm')) return 'video/webm'
  if (filePath.endsWith('.glb')) return 'model/gltf-binary'
  if (filePath.endsWith('.woff2')) return 'font/woff2'
  if (filePath.endsWith('.woff')) return 'font/woff'
  if (filePath.endsWith('.ttf')) return 'font/ttf'
  return 'application/octet-stream'
}

export function resolveSiteFile(siteRoot, urlPath) {
  let relative
  if (urlPath === '/') relative = 'prototype-03.html'
  else if (urlPath === '/story' || urlPath === '/index.html') relative = 'index.html'
  else relative = urlPath.replace(/^\//, '')
  const candidate = path.normalize(path.join(siteRoot, relative))
  if (!candidate.startsWith(siteRoot)) return null
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  const asIndex = path.join(candidate, 'index.html')
  if (fs.existsSync(asIndex) && fs.statSync(asIndex).isFile()) return asIndex
  return null
}

export function defaultSiteRoot() {
  return path.resolve(__dirname, '../public/site')
}

export function distSiteRoot(projectRoot) {
  return path.resolve(projectRoot, 'dist/site')
}
