import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'

const pages = new Map([
  ['/', 'candidate-workspace.html'],
  ['/candidate-workspace.html', 'candidate-workspace.html'],
  ['/regression', 'regression.html'],
  ['/regression.html', 'regression.html'],
])

export async function handleRequest(request, response) {
  let status = 200
  let body
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    status = 405
    body = 'Method not allowed'
    headers.Allow = 'GET, HEAD'
  } else {
    let pathname
    try {
      if (typeof request.url !== 'string') throw new Error('Missing URL')
      pathname = new URL(request.url, 'http://localhost').pathname
    } catch {
      status = 400
      body = 'Bad request'
    }

    if (status === 200) {
      const filename = pages.get(pathname)
      if (!filename) {
        status = 404
        body = 'Not found'
      } else {
        try {
          body = await readFile(new URL(filename, import.meta.url))
        } catch (error) {
          console.error('Unable to read candidate page:', error.message)
          status = 500
          body = 'Unable to load workspace'
        }
      }
    }
  }

  if (status !== 200) headers['Content-Type'] = 'text/plain; charset=utf-8'
  headers['Content-Length'] = Buffer.byteLength(body)
  response.writeHead(status, headers)
  response.end(request.method === 'HEAD' ? undefined : body)
}

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 5173)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT must be an integer between 1 and 65535.')
    process.exitCode = 1
  } else {
    const server = createServer(handleRequest)
    server.on('error', error => {
      console.error(`Cannot start candidate workspace: ${error.message}`)
      process.exitCode = 1
    })
    server.listen(port, '127.0.0.1', () => {
      console.log(`Candidate workspace: http://127.0.0.1:${port}`)
      console.log(`Stage 3 reveal: http://127.0.0.1:${port}/regression`)
    })
  }
}
