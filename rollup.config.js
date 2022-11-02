import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { importAssertionsPlugin } from 'rollup-plugin-import-assert';
import { importAssertions } from 'acorn-import-assertions';

const input = './src/index.js';

const output = [
  { file: './build/index.cjs', format: 'cjs' },
  { file: './build/index.js', format: 'es' }
];

const plugins = [
  cleanup({
    comments: 'none',
    extensions: ['*']
  }),
  getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
  importAssertionsPlugin()
];

if (['test', 'development'].includes(process.env.NODE_ENV)) {
  // During development include a source map. We don't ship this to npm,
  // because it significantly increases the module size:
  output.sourcemap = true;
} else {
  // Minify code when publishing, this significantly decreases the module
  // size increased introduced by shipping both ESM and CJS:
  plugins.push(terser());
}

export default {
  acornInjectPlugins: [importAssertions],
  input,
  output,
  plugins
};
