import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { hash } from 'starknet';
import { exportProspectingProof } from './exportProspectingProof.js';

const sdk = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = process.argv[2];
if (!source) throw new Error('Pass the compiled influence-starknet repository');
const contracts = resolve(source);
const exported = resolve(contracts, 'target/prospecting');
const readJSON = async (file) => JSON.parse(await readFile(file, 'utf8'));
const manifest = await readJSON(resolve(exported, 'manifest.json'));
if (manifest.version !== 2 || manifest.rules !== 'fieldwork-r7-volume150-v1' || manifest.deployment !== 'undeployed') {
  throw new Error('Unsupported prospecting artifact manifest');
}

const registries = {};
for (const kind of ['abis', 'systems', 'events', 'types', 'components']) {
  registries[kind] = await readJSON(resolve(sdk, `src/contracts/starknet_${kind}.json`));
}
const gameplay = {};
const flatten = (abi) => abi.flatMap((entry) => entry.type === 'interface' ? entry.items : [entry]);
const componentName = 'influence::components::claim::Claim';

// Validate every exported ABI against its compiled class before replacing any SDK files.
for (const [name, descriptor] of Object.entries(manifest.contracts)) {
  const file = descriptor.artifact;
  const bytes = await readFile(resolve(contracts, file));
  const artifact = JSON.parse(bytes);
  const abi = await readJSON(resolve(exported, descriptor.abi));
  if (createHash('sha256').update(bytes).digest('hex') !== descriptor.artifactSha256 ||
      hash.computeContractClassHash(artifact) !== descriptor.classHash || !isDeepStrictEqual(abi, artifact.abi)) {
    throw new Error(`Rebuild and export current contract artifacts: ${name} does not match its manifest`);
  }
  gameplay[name] = abi;
  const entries = flatten(abi);
  const run = entries.find((entry) => entry.type === 'function' && entry.name === 'run');
  if (run) {
    if (run.inputs.at(-1)?.type !== 'influence::common::types::context::Context') {
      throw new Error(`Unexpected Dispatcher Context in ${name}`);
    }
    registries.systems[name] = { ...run, name, inputs: run.inputs.slice(0, -1) };
  } else {
    registries.abis[name] = abi;
  }
  for (const entry of entries) {
    if (entry.type === 'struct') registries.types[entry.name] = entry;
    if (entry.type === 'event' && entry.kind === 'struct') {
      const eventName = entry.name.split('::').at(-1);
      registries.events[eventName] = { ...entry, name: eventName };
    }
  }
}
for (const entry of gameplay.TypeComponent) {
  if (entry.type === 'struct' && entry.name.startsWith('influence::components::')) {
    registries.components[entry.name] = entry;
  }
}
if (!registries.components[componentName]) throw new Error('Missing compiled Claim component');
const json = (value) => JSON.stringify(value, null, 2) + '\n';
for (const [kind, registry] of Object.entries(registries)) {
  await writeFile(resolve(sdk, `src/contracts/starknet_${kind}.json`), json(registry));
}
await writeFile(resolve(sdk, 'src/contracts/prospecting/gameplay.json'), json(gameplay));
await writeFile(resolve(sdk, 'src/contracts/prospecting/gameplay-manifest.json'), json(manifest));
await writeFile(resolve(sdk, 'src/contracts/prospecting/claim-component.json'), json(registries.components[componentName]));
console.log(`Exported ${Object.keys(gameplay).length} gameplay ABIs, schemas and class hashes; deployment addresses unchanged`);
await exportProspectingProof(contracts);
