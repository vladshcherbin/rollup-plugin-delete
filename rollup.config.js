import babel from 'rollup-plugin-babel'
import autoExternal from 'rollup-plugin-auto-external'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.es.js',
      format: 'es'
    }
  ],
  plugins: [
    babel({
      presets: [['@babel/preset-env', { targets: { node: '8.3' } }]],
      comments: false
    }),
    autoExternal()
  ]
}
