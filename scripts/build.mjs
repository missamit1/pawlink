import { copyFileSync, mkdirSync } from 'node:fs'
import { build } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { marketingRootPlugin } from '../marketingRootPlugin.js'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(rootDir, '..')
const assetsDir = path.resolve(projectRoot, 'dist/assets')

await build({
  configFile: path.resolve(projectRoot, 'vite.config.js'),
})

await build({
  configFile: false,
  root: projectRoot,
  envDir: process.env.PAWLINK_ENV_DIR || projectRoot,
  plugins: [react(), marketingRootPlugin()],
  optimizeDeps: { exclude: ['maplibre-gl'] },
  worker: { format: 'es' },
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'safe-zone': path.resolve(projectRoot, 'safe-zone.html'),
      },
    },
  },
})

// MapLibre worker imports this sibling by relative path; Vite does not emit it.
mkdirSync(assetsDir, { recursive: true })
copyFileSync(
  path.resolve(
    projectRoot,
    'node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs',
  ),
  path.resolve(assetsDir, 'maplibre-gl-shared.mjs'),
)

console.log('[PawLink] build complete: app + safe-zone map')
