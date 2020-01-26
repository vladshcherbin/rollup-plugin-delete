# rollup-plugin-delete

[![Build Status](https://travis-ci.org/vladshcherbin/rollup-plugin-delete.svg?branch=master)](https://travis-ci.org/vladshcherbin/rollup-plugin-delete)
[![Codecov](https://codecov.io/gh/vladshcherbin/rollup-plugin-delete/branch/master/graph/badge.svg)](https://codecov.io/gh/vladshcherbin/rollup-plugin-delete)

Delete files and folders using Rollup.

## About

This plugin is useful when you want to clean `dist` or other folders and files before bundling. It's using [del](https://github.com/sindresorhus/del) package inside, check it for pattern examples.

## Installation

```bash
npm install rollup-plugin-delete --save-dev

# or

yarn add rollup-plugin-delete -D
```

## Usage

```js
// rollup.config.js
import del from 'rollup-plugin-delete'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/app.js',
    format: 'cjs'
  },
  plugins: [
    del({ targets: 'dist/*' })
  ]
}
```

### Configuration

There are some useful options:

#### targets

A string or an array of patterns of files and folders to be deleted. Default is `[]`.

```js
del({
  targets: 'dist/*'
})

del({
  targets: ['dist/*', 'build/*']
})
```

#### verbose

Outputs removed files and folders to console. Default is `false`.

```js
del({
  targets: 'dist/*',
  verbose: true
})
```

> Note: use \* (wildcard character) to show removed files

#### hook

[Rollup hook](https://rollupjs.org/guide/en/#hooks) the plugin should use. Default is `buildStart`.

```js
del({
  targets: 'dist/*',
  hook: 'buildEnd'
})
```

#### runOnce

Type: `boolean` | Default: `false`

Delete items once. Useful in watch mode.

```js
del({
  targets: 'dist/*',
  runOnce: true
})
```

### Del package options

#### dryRun

Shows what would be deleted without actual delete. Default is `false`.

```js
del({
  targets: 'dist/*',
  dryRun: true
})
```

#### force

Allows deleting current working directory and outside. Default is `false`.

```js
del({
  targets: 'dist/*',
  force: true
})
```

#### concurrency

Concurrency limit. Default is `Infinity`.

```js
del({
  targets: 'dist/*',
  concurrency: 5
})
```

[`glob` options](https://github.com/isaacs/node-glob#options)

## License

MIT
