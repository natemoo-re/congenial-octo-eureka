import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { handleRequest } from './server.mjs'

async function request(url, method = 'GET') {
  const result = {}
  await handleRequest({ url, method }, {
    writeHead(status, headers) { Object.assign(result, { status, headers }) },
    end(body) { result.body = body },
  })
  return result
}

test('serves the bundled candidate page, including query strings', async () => {
  const page = await readFile(new URL('./candidate-workspace.html', import.meta.url))
  for (const url of ['/', '/candidate-workspace.html', '/?session=pilot']) {
    const result = await request(url)
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, page)
    assert.equal(result.headers['Content-Type'], 'text/html; charset=utf-8')
    assert.equal(result.headers['Content-Length'], page.length)
    assert.equal(result.headers['Cache-Control'], 'no-store')
  }
})

test('serves the separate stage 3 page', async () => {
  const page = await readFile(new URL('./regression.html', import.meta.url))
  for (const url of ['/regression', '/regression.html']) {
    const result = await request(url)
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, page)
  }
})

test('HEAD returns page headers without a response body', async () => {
  const get = await request('/')
  const head = await request('/', 'HEAD')
  assert.equal(head.status, 200)
  assert.deepEqual(head.headers, get.headers)
  assert.equal(head.body, undefined)
})

test('does not expose source, interviewer notes, or other files', async () => {
  for (const url of ['/README.md', '/server.mjs', '/src/App.tsx', '/../README.md', '/%2e%2e/README.md', '/unknown']) {
    const result = await request(url)
    assert.equal(result.status, 404, url)
    assert.equal(result.body, 'Not found')
  }
  assert.equal((await request('/README.md', 'HEAD')).body, undefined)
})

test('rejects writes and malformed URLs', async () => {
  const post = await request('/', 'POST')
  assert.equal(post.status, 405)
  assert.equal(post.headers.Allow, 'GET, HEAD')
  assert.equal((await request('http://[')).status, 400)
  assert.equal((await request(undefined)).status, 400)
})

test('rejects invalid port configuration before listening', () => {
  for (const port of ['0', '65536', 'invalid']) {
    const result = spawnSync(process.execPath, ['server.mjs'], {
      cwd: new URL('.', import.meta.url),
      env: { ...process.env, PORT: port },
      encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /PORT must be an integer/)
  }
})
