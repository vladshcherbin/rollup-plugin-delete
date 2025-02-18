import { ensureFile, pathExists, remove } from 'fs-extra'
import { setTimeout } from 'node:timers/promises'
import { replaceInFile } from 'replace-in-file'
import { rollup, watch } from 'rollup'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import del, { type Options } from '../src/index.js'

process.chdir('tests/sample')

async function build(options?: Options) {
  await rollup({
    input: 'src/index.js',
    plugins: [
      del(options)
    ]
  })
}

beforeEach(async () => {
  await ensureFile('dist/app.js')
  await ensureFile('dist/app.css')
})

afterEach(async () => {
  await remove('dist')
})

describe('Targets', () => {
  test('Empty', async () => {
    await build()

    expect(await pathExists('dist/app.js')).toBe(true)
    expect(await pathExists('dist/app.css')).toBe(true)
  })

  test('Files', async () => {
    await build({
      targets: 'dist/*.{js,css}'
    })

    expect(await pathExists('dist')).toBe(true)
    expect(await pathExists('dist/app.js')).toBe(false)
    expect(await pathExists('dist/app.css')).toBe(false)
  })

  test('Folders', async () => {
    await build({
      targets: 'dist'
    })

    expect(await pathExists('dist')).toBe(false)
  })
})

describe('Options', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => null)

  afterEach(() => {
    vi.spyOn(console, 'log').mockClear()
  })

  test('Verbose', async () => {
    await build({
      targets: 'dist',
      verbose: true
    })

    expect(await pathExists('dist')).toBe(false)
    expect(log).toHaveBeenCalledTimes(2)
    expect(log).toHaveBeenCalledWith('Deleted files and folders: 1')
    expect(log).toHaveBeenCalledWith(`${__dirname}/sample/dist`)
  })

  test('Verbose, no targets', async () => {
    await build({
      targets: 'build',
      verbose: true
    })

    expect(await pathExists('dist')).toBe(true)
    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith('Deleted files and folders: 0')
  })

  test('DryRun', async () => {
    await build({
      dryRun: true,
      targets: 'dist'
    })

    expect(await pathExists('dist')).toBe(true)
    expect(log).toHaveBeenCalledTimes(2)
    expect(log).toHaveBeenCalledWith('Expected files and folders to be deleted: 1')
    expect(log).toHaveBeenCalledWith(`${__dirname}/sample/dist`)
  })

  test('Run once', async () => {
    expect(await pathExists('dist/app.js')).toBe(true)

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

    expect(await pathExists('dist/app.js')).toBe(false)
    expect(await pathExists('dist/index.js')).toBe(true)

    await ensureFile('dist/app.js')

    expect(await pathExists('dist/app.js')).toBe(true)

    await replaceInFile({
      files: 'src/index.js',
      from: /hey/g,
      to: 'ho'
    })

    await setTimeout(100)

    expect(await pathExists('dist/app.js')).toBe(true)
    expect(await pathExists('dist/index.js')).toBe(true)

    await watcher.close()

    await replaceInFile({
      files: 'src/index.js',
      from: /ho/g,
      to: 'hey'
    })
  })
})
