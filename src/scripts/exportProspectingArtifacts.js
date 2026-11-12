import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash } from 'starknet';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = process.argv[2] || process.env.PROSPECTING_SANDBOX;
if (!source) throw new Error('Pass the mining-prototype directory; only compiled sandbox artifacts are supported');
const sandbox = resolve(source); const destination = resolve(root, 'src/contracts/prospecting');
await mkdir(destination, { recursive: true });
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
async function artifact (relative) {
  const bytes = await readFile(resolve(sandbox, relative));
  const contract = JSON.parse(bytes);
  return { source: relative, sha256: digest(bytes), classHash: hash.computeContractClassHash(contract), abi: contract.abi };
}
const fieldwork = await artifact('optimization/fieldwork-contracts/target/dev/fieldwork_campaign_FieldworkCampaign.contract_class.json');
const interfaces = fieldwork.abi.flatMap((item) => item.items || [item]);
if (!interfaces.some((item) => item.name === 'commit_checked') || !interfaces.some((item) => item.name === 'rate_preview') ||
    !interfaces.find((item) => item.name === 'set_extraction')?.inputs.some((item) => item.name === 'status')) {
  throw new Error('Compile the updated RUNNING-status sandbox protocol before exporting');
}
const contractsRoot = process.argv[3] || process.env.INFLUENCE_CONTRACTS_ROOT;
if (!contractsRoot) throw new Error('Pass influence-starknet as the second directory to export the genuine Claim component ABI');
const typesClass = JSON.parse(await readFile(resolve(contractsRoot, 'target/dev/contract_TypeComponent.contract_class.json'), 'utf8'));
const claimType = typesClass.abi.find((entry) => entry.type === 'struct' && entry.name === 'influence::components::claim::Claim');
if (!claimType) throw new Error('Compile the additive Cairo Claim component before exporting SDK artifacts');
const componentsFile = resolve(root, 'src/contracts/starknet_components.json');
const components = JSON.parse(await readFile(componentsFile, 'utf8'));
components[claimType.name] = claimType;
await writeFile(componentsFile, JSON.stringify(components, null, 2) + '\n');
await writeFile(resolve(destination, 'claim-component.json'), JSON.stringify(claimType, null, 2) + '\n');
const claimSource = await readFile(resolve(contractsRoot, 'src/components/claim.cairo'));
const manifest = {
  protocol: 'fieldwork-sandbox-v1',
  circuit: 'fieldwork-r7-volume150-v1',
  developmentOnly: true,
  checkedCommitments: true,
  rulesVersion: 7,
  quantityMultiplierBps: 15000,
  fieldwork: { file: 'fieldwork.json', source: fieldwork.source, classHash: fieldwork.classHash, sha256: fieldwork.sha256 },
  verifiers: {},
  claimComponent: {
    file: 'claim-component.json',
    type: claimType.name,
    source: 'src/components/claim.cairo',
    sourceSha256: digest(claimSource),
    typeComponentClassHash: hash.computeContractClassHash(typesClass),
    storageFelts: 1,
    storageBits: 116
  },
  productionSystemsAvailable: false
};
await writeFile(resolve(destination, 'fieldwork.json'), JSON.stringify(fieldwork.abi, null, 2) + '\n');
// This exporter retains the historical standalone sandbox ABI only. Current
// gameplay proof assets are exported by exportProspectingProof.js.
for (let n = 1; n <= 10; n++) {
  const verifier = await artifact(`optimization/fieldwork/volume150/verifier${n}/target/dev/verifier${n}_Groth16VerifierBN254.contract_class.json`);
  manifest.verifiers[n] = { classHash: verifier.classHash, sha256: verifier.sha256, source: verifier.source };
}
await writeFile(resolve(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Exported development-only protocol ABI and ten verifiers to ${destination}`);
