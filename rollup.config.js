import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    babel({
      presets: [['@babel/preset-env', { targets: { node: 8 } }]]
    })
  ],
  external: ['del']
}
