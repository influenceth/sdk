import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { StarterMission as esm } from '../../build/index.js';
import { readFileSync } from 'node:fs';

const vectors = JSON.parse(readFileSync(new URL('../../test/fixtures/starterMissionBindings/vectors.json', import.meta.url), 'utf8'));

const require = createRequire(import.meta.url);
const { StarterMission: cjs } = require('../../build/index.cjs');
for (const [format, api] of [['ESM', esm], ['CommonJS', cjs]]) {
  for (const vector of vectors) {
    assert.equal(typeof api[vector.helper], 'function', `${format} exports ${vector.helper}`);
    assert.equal(api[vector.helper](...vector.args), BigInt(vector.hash), `${format}: ${vector.name}`);
  }
}
console.log('ESM and CommonJS exports match all 19 Cairo binding fixtures.');
