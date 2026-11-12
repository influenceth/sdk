import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import Prospecting from '../lib/prospecting.js';

if (!process.argv[2]) throw new Error('Pass influence-starknet with compiled development proof assets');
const contracts = resolve(process.argv[2]);
const requireProof = createRequire(resolve(contracts, 'proofs/fieldwork/package.json'));
const snarkjs = requireProof('snarkjs');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const file = resolve(root, 'test/fixtures/prospecting/campaigns.json');
const fixtures = JSON.parse(await readFile(file, 'utf8'));
const proofRoot = resolve(contracts, 'proofs/fieldwork/target/proof');
const manifest = JSON.parse(await readFile(resolve(proofRoot, 'manifest.json'), 'utf8'));
for (const fixture of fixtures) {
  const input = fixture.input;
  const record = {
    ...Prospecting.createRecord({
      mode: 'local-simulation',
      context: input.context,
      identity: {
        chainId: '0x1',
        game: '0x2',
        owner: '0x3',
        asteroidId: 1,
        originIndex: Number(input.origin),
        resource: 1
      }
    }),
    claimIndex: Number(input.selected),
    actions: input.methods.map((method, i) => ({
      action: {
        method: Number(method),
        target: Number(input.targets[i]),
        source: Number(input.sources[i]),
        depth: Number(input.depths[i]),
        salt: String(input.salts[i])
      },
      meta: String(input.meta[i]),
      mask: String(input.blockedApproaches[i]),
      randomness: String(input.randomness[i])
    }))
  };
  const packet = Prospecting.getProofPacket(record);
  const result = await snarkjs.groth16.fullProve(packet.input, resolve(proofRoot, manifest.wasm.file),
    resolve(proofRoot, manifest.zkey.file), undefined, undefined, { singleThread: true });
  assert.deepEqual(result.publicSignals, fixture.publicSignals);
  const vk = JSON.parse(await readFile(resolve(proofRoot, manifest.vk.file), 'utf8'));
  assert(await snarkjs.groth16.verify(vk, result.publicSignals, result.proof));
  fixture.proof = result.proof;
  console.log(`Regenerated fixture ${fixture.n} using the single padded key`);
}
await writeFile(file, JSON.stringify(fixtures, null, 2) + '\n');
process.exit(0);
