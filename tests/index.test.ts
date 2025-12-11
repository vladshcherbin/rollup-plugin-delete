import { ensureFile, pathExists, remove } from 'fs-extra'
import assert from 'node:assert/strict'
import { after, afterEach, before, beforeEach, describe, mock, test } from 'node:test'
import { setTimeout } from 'node:timers/promises'
import { replaceInFile } from 'replace-in-file'
import { rollup, watch } from 'rollup'
import del, { type Options } from '../src/index.ts'

async function build(options?: Options) {
  await rollup({
    input: 'src/index.js',
    plugins: [
      del(options)
    ]
  })
}

before(() => {
  process.chdir(`${import.meta.dirname}/sample`)
})

beforeEach(async () => {
  await ensureFile('dist/app.js')
  await ensureFile('dist/app.css')
})

afterEach(async () => {
  await remove('dist')
})

await describe('Targets', async () => {
  await test('Empty', async () => {
    await build()

    assert.strictEqual(await pathExists('dist/app.js'), true)
    assert.strictEqual(await pathExists('dist/app.css'), true)
  })

  await test('Files', async () => {
    await build({
      targets: 'dist/*.{js,css}'
    })

    assert.strictEqual(await pathExists('dist'), true)
    assert.strictEqual(await pathExists('dist/app.js'), false)
    assert.strictEqual(await pathExists('dist/app.css'), false)
  })

  await test('Folders', async () => {
    await build({
      targets: 'dist'
    })

    assert.strictEqual(await pathExists('dist'), false)
  })
})

await describe('Options', async () => {
  const log = mock.method(console, 'log', () => null)

  afterEach(() => {
    log.mock.resetCalls()
  })

  after(() => {
    mock.reset()
  })

  await test('Verbose', async () => {
    await build({
      targets: 'dist',
      verbose: true
    })

    assert.strictEqual(await pathExists('dist'), false)
    assert.strictEqual(log.mock.callCount(), 2)
    assert.strictEqual(log.mock.calls[0].arguments[0], 'Deleted: 1')
    assert.strictEqual(log.mock.calls[1].arguments[0], `${import.meta.dirname}/sample/dist`)
  })

  await test('Verbose, no targets', async () => {
    await build({
      targets: 'build',
      verbose: true
    })

    assert.strictEqual(await pathExists('dist'), true)
    assert.strictEqual(log.mock.callCount(), 1)
    assert.strictEqual(log.mock.calls[0].arguments[0], 'Deleted: 0')
  })

  await test('DryRun', async () => {
    await build({
      dryRun: true,
      targets: 'dist'
    })

    assert.strictEqual(await pathExists('dist'), true)
    assert.strictEqual(log.mock.callCount(), 2)
    assert.strictEqual(log.mock.calls[0].arguments[0], 'Expected to be deleted: 1')
    assert.strictEqual(log.mock.calls[1].arguments[0], `${import.meta.dirname}/sample/dist`)
  })

  await test('Run once', async () => {
    assert.strictEqual(await pathExists('dist/app.js'), true)

    const watcher = watch({
      input: 'src/index.js',
      output: {
        dir: 'dist',
        format: 'es'
      },
      plugins: [
        del({
          runOnce: true,
          targets: 'dist'
        })
      ]
    })

    await setTimeout(100)

    assert.strictEqual(await pathExists('dist/app.js'), false)
    assert.strictEqual(await pathExists('dist/index.js'), true)

    await ensureFile('dist/app.js')

    assert.strictEqual(await pathExists('dist/app.js'), true)

    await replaceInFile({
      files: 'src/index.js',
      from: /hey/g,
      to: 'ho'
    })

    await setTimeout(100)

    assert.strictEqual(await pathExists('dist/app.js'), true)
    assert.strictEqual(await pathExists('dist/index.js'), true)

    await watcher.close()

    await replaceInFile({
      files: 'src/index.js',
      from: /ho/g,
      to: 'hey'
    })
  })
})
