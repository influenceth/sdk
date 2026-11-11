import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fixtures = JSON.parse(await readFile(new URL('../../test/fixtures/prospecting/campaigns.json', import.meta.url)));
const builds = [await import('../../build/index.js'), require('../../build/index.cjs')];
for (const [i, sdk] of builds.entries()) {
  for (const fixture of fixtures) {
    const input = fixture.input;
    const record = { ...sdk.Prospecting.createRecord({ mode: 'local-simulation', context: input.context,
      identity: { chainId: '0x1', game: '0x2', owner: '0x3', asteroidId: 1, originIndex: Number(input.origin), resource: 1 } }),
    claimIndex: Number(input.selected), actions: input.methods.map((method, n) => ({ action: { method: Number(method), target: Number(input.targets[n]),
      source: Number(input.sources[n]), depth: Number(input.depths[n]), salt: String(input.salts[n]) },
    meta: String(input.meta[n]), mask: String(input.blockedApproaches[n]), randomness: String(input.randomness[n]) })) };
    assert.deepEqual(sdk.Prospecting.getProofPacket(record).expectedPublicSignals, fixture.publicSignals);
    if (fixture.n === 5) {
      const calldata = await sdk.Prospecting.Proof.getVerifierCalldata({ record, proof: fixture.proof, publicSignals: fixture.publicSignals });
      assert.equal(calldata.length, 1935);
    }
  }
  const key = await sdk.Encryption.generatePrivateKeyFromSeed('sdk-build-record');
  const ciphertext = await sdk.PrivateData.encryptRecord(sdk.Encryption.getPublicKeyFromPrivateKey(key), { secret: 'build recovery' });
  const { record } = await sdk.PrivateData.signRecord(key, 'build-scope', { revision: 1, ciphertext, updatedAt: 1 });
  assert.deepEqual(await sdk.PrivateData.decryptRecord(key, 'build-scope', record), { secret: 'build recovery' });
  assert.equal(sdk.Mining.isSamplingBlocked([{ status: 1, finishTime: 0 }]), true);
  assert.equal(sdk.Prospecting.Contracts.manifest.claimComponent.storageFelts, 1);
  console.log(`${i === 0 ? 'ESM' : 'CommonJS'}: ten proof statements, Garaga calldata, encrypted recovery and claim artifacts passed`);
}
