import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as esmSdk from '../../build/index.js';
import { readFileSync } from 'node:fs';

const vectors = JSON.parse(readFileSync(new URL('../../test/fixtures/starterMissionBindings/vectors.json', import.meta.url), 'utf8'));

const require = createRequire(import.meta.url);
const cjsSdk = require('../../build/index.cjs');
const esm = esmSdk.StarterMission;
const cjs = cjsSdk.StarterMission;
for (const [format, api] of [['ESM', esm], ['CommonJS', cjs]]) {
  for (const vector of vectors) {
    assert.equal(typeof api[vector.helper], 'function', `${format} exports ${vector.helper}`);
    assert.equal(api[vector.helper](...vector.args), BigInt(vector.hash), `${format}: ${vector.name}`);
  }
}
console.log('ESM and CommonJS exports match all 19 Cairo binding fixtures.');

for (const sdk of [esmSdk, cjsSdk]) {
  const assignment = sdk.ColonizationMission.getAssignment({ campaign: 123, asteroidId: 42, missionId: 1 });
  assert.equal(sdk.ColonizationMission.getRewardAmount(1), 250000000000n);
  assert.equal(sdk.MissionObservation.encodeMissionTargets([assignment]).length, 2);
  const calls = sdk.MissionObservation.getObservedSystemCalls({
    dispatcher: '0x123',
    account: '0x456',
    system: 'ConstructionStart',
    input: { building: { label: 5, id: 42 }, caller_crew: { label: 1, id: 77 } },
    candidates: [assignment]
  });
  assert.deepEqual(calls.map(({ entrypoint }) => entrypoint), ['begin_observation', 'run_system', 'end_observation']);
  assert.equal(sdk.System.Systems.MissionAction, undefined);
}
console.log('ESM and CommonJS observation and colonization exports pass smoke checks.');
