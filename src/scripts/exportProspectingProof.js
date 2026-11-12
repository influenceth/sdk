import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hash } from 'starknet';
import { CIRCUIT, MAX_SAMPLES } from '../lib/prospecting/config.js';

export async function exportProspectingProof (source) {
  const root = resolve(source);
  const output = resolve(dirname(fileURLToPath(import.meta.url)), '../contracts/prospecting');
  const readJSON = async file => JSON.parse(await readFile(file, 'utf8'));
  const manifest = await readJSON(resolve(root, 'target/prospecting/manifest.json'));
  const proof = manifest.proof;
  if (manifest.version !== 2 || proof?.circuit !== CIRCUIT || proof.maxSamples !== MAX_SAMPLES || !proof.developmentOnly) {
    throw new Error('Expected a compiled single padded development circuit');
  }
  const descriptor = proof.verifier;
  const bytes = await readFile(resolve(root, descriptor.artifact));
  const verifier = JSON.parse(bytes);
  if (hash.computeContractClassHash(verifier) !== descriptor.classHash ||
      createHash('sha256').update(bytes).digest('hex') !== descriptor.artifactSha256) {
    throw new Error('Compiled Groth16 verifier differs from the exported manifest');
  }
  const assets = await readJSON(resolve(root, 'proofs/fieldwork/target/proof/manifest.json'));
  if (JSON.stringify(assets) !== JSON.stringify(Object.fromEntries(Object.entries(proof)
    .filter(([key]) => !['verifier', 'ecip'].includes(key))))) throw new Error('Proof asset manifests differ');
  for (const name of ['library', 'wasm', 'zkey', 'vk']) {
    const data = await readFile(resolve(root, 'proofs/fieldwork/target/proof', assets[name].file));
    if (data.length !== assets[name].bytes || createHash('sha256').update(data).digest('hex') !== assets[name].sha256) {
      throw new Error(`Proof asset differs from its descriptor: ${name}`);
    }
  }
  const verificationKey = await readJSON(resolve(root, 'proofs/fieldwork/target/proof', assets.vk.file));
  if (verificationKey.nPublic !== 1) throw new Error('Expected one public transcript digest');
  await writeFile(resolve(output, 'verifiers.json'), JSON.stringify({ abi: verifier.abi, verificationKey }, null, 2) + '\n');
  await writeFile(resolve(output, 'proof-assets.json'), JSON.stringify(assets, null, 2) + '\n');
  console.log('Exported one shared verification key and asset manifest for 1–10 samples');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error('Pass the compiled influence-starknet repository');
  await exportProspectingProof(process.argv[2]);
}
