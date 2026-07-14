import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

const { env: { NODE_ENV } } = process;

const input = './src/index.js';

const output = [
  { file: './build/index.cjs', format: 'cjs', sourcemap: (NODE_ENV !== 'production'), importAttributesKey: 'with' },
  { file: './build/index.js', format: 'es', sourcemap: (NODE_ENV !== 'production'), importAttributesKey: 'with' }
];

const plugins = [
  cleanup({
    comments: 'none',
    extensions: ['*']
  }),
  json(),
  getBabelOutputPlugin({ presets: ['@babel/preset-env'] })
];

// Minify code when publishing, this significantly decreases the module
// size increased introduced by shipping both ESM and CJS:
if (process.env.NODE_ENV === 'production') plugins.push(terser());

export default {
  input,
  output,
  plugins
};
