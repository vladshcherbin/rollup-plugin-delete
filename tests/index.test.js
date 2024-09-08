import { rollup, watch } from 'rollup'
import fs from 'fs-extra'
import replace from 'replace-in-file'
import del from '../src'

process.chdir(`${__dirname}/fixtures`)

function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms) })
}

async function build(options) {
  await rollup({
    input: 'src/index.js',
    plugins: [
      del(options)
    ]
  })
}

beforeEach(async () => {
  await fs.ensureFile('dist/public/app.js')
  await fs.ensureFile('dist/public/app.css')
})

afterEach(async () => {
  await fs.remove('dist')
})

describe('Targets', () => {
  test('Empty', async () => {
    await build()

    expect(await fs.pathExists('dist/public')).toBe(true)
    expect(await fs.pathExists('dist/public/app.js')).toBe(true)
    expect(await fs.pathExists('dist/public/app.css')).toBe(true)
  })

  test('Files', async () => {
    await build({
      targets: 'dist/public/*.{js,css}'
    })

    expect(await fs.pathExists('dist/public')).toBe(true)
    expect(await fs.pathExists('dist/public/app.js')).toBe(false)
    expect(await fs.pathExists('dist/public/app.css')).toBe(false)
  })

  test('Folders', async () => {
    await build({
      targets: 'dist'
    })

    expect(await fs.pathExists('dist/public')).toBe(false)
    expect(await fs.pathExists('dist')).toBe(false)
  })
})

describe('Options', () => {
  /* eslint-disable no-console */
  test('Verbose', async () => {
    console.log = jest.fn()

    await build({
      targets: 'dist',
      verbose: true
    })

    expect(await fs.pathExists('dist/public')).toBe(false)
    expect(await fs.pathExists('dist')).toBe(false)
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenCalledWith('Deleted files and folders: 1')
    expect(console.log).toHaveBeenCalledWith(`${__dirname}/fixtures/dist`)
  })

  test('Verbose, no targets', async () => {
    console.log = jest.fn()

    await build({
      targets: 'build',
      verbose: true
    })

    expect(await fs.pathExists('dist/public')).toBe(true)
    expect(await fs.pathExists('dist')).toBe(true)
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith('Deleted files and folders: 0')
  })

  test('DryRun', async () => {
    console.log = jest.fn()

    await build({
      targets: 'dist',
      dryRun: true
    })

    expect(await fs.pathExists('dist/public')).toBe(true)
    expect(await fs.pathExists('dist')).toBe(true)
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenCalledWith('Expected files and folders to be deleted: 1')
    expect(console.log).toHaveBeenCalledWith(`${__dirname}/fixtures/dist`)
  })
  /* eslint-enable no-console */

  test('Run once', async () => {
    expect(await fs.pathExists('dist/public/app.js')).toBe(true)

    const watcher = watch({
      input: 'src/index.js',
      output: {
        dir: 'dist',
        format: 'es'
      },
      plugins: [
        del({
          targets: 'dist',
          runOnce: true
        })
      ]
    })

    await sleep(1000)

    expect(await fs.pathExists('dist/public/app.js')).toBe(false)

    await fs.ensureFile('dist/public/app.js')

    expect(await fs.pathExists('dist/public/app.js')).toBe(true)

    await replace({
      files: 'src/index.js',
      from: 'hey',
      to: 'ho'
    })

    await sleep(1000)

    expect(await fs.pathExists('dist/public/app.js')).toBe(true)

    watcher.close()

    await replace({
      files: 'src/index.js',
      from: 'ho',
      to: 'hey'
    })
  })
})
