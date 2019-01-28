import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      presets: [['@babel/preset-env', { targets: { node: 8 } }]]
    })
  ],
  external: ['del']
}
