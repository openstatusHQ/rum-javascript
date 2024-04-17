/// <reference types='bun-types' />
import dts from 'bun-plugin-dts'

import pkg from './package.json';


 Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    dts()
  ]
})