# rollup-plugin-delete

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

**targets**

A string or an array of patterns of files and folders to be deleted. Default is `[]`.

```js
del({
  targets: 'dist/*'
})

del({
  targets: ['dist/*', 'build/*']
})
```

**verbose**

If set to `true`, will output removed files and folders to console. Default is `false`.

```js
del({
  verbose: true
})
```

## License

MIT
