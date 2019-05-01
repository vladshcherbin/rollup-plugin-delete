import { rollup } from 'rollup'
import fs from 'fs-extra'
import del from '../src'

process.chdir(`${__dirname}/fixtures`)

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
})
