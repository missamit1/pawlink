import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = dirname(fileURLToPath(import.meta.url))
const node = process.execPath
const children = []

function run(args) {
  const child = spawn(node, args, {
    cwd: projectDir,
    stdio: 'inherit',
    env: process.env,
  })
  children.push(child)
}

run(['server/server.js'])
run(['node_modules/vite/bin/vite.js'])

function stop() {
  for (const child of children) {
    if (!child.killed) child.kill()
  }
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
