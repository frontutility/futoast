import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/futoast.js',
  
  output: [
    {
      file: 'dist/futoast.min.js',
      format: 'umd',
      name: 'FuToast',
      plugins: [terser()],
    },
    {
      file: 'dist/futoast.esm.js',
      format: 'esm',
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({ 
      babelHelpers: 'bundled', 
      exclude: 'node_modules/**',
      extensions: ['.js']
    }),
    cleanup(),
    copy({
      targets: [
        { src: 'src/futoast.d.ts', dest: 'dist' }
      ]
    })
  ]
};