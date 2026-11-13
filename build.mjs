import { writeFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = dirname(fileURLToPath(import.meta.url))
const result = await build({
  absWorkingDir: root,
  entryPoints: ['src/main.tsx'],
  outfile: 'bundle.js',
  bundle: true,
  write: false,
  minify: true,
  jsx: 'automatic',
  format: 'iife',
  platform: 'browser',
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: Object.fromEntries(['react', 'react-dom', '@emotion/react'].map(name => [name, join(root, 'node_modules', name)])),
})
const files = Object.fromEntries(result.outputFiles.map(file => [extname(file.path), file.text]))
const script = files['.js'].replace(/<\/script/gi, '<\\/script')
const css = files['.css'].replace(/<\/style/gi, '<\\/style')
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Responsive layouts · Candidate workspace</title><style>${css}</style></head><body><div id="root"></div><script>${script}</script></body></html>`
await Promise.all(['candidate-workspace.html', 'regression.html'].map(name => writeFile(join(root, name), html)))
console.log('Built candidate-workspace.html and regression.html')
