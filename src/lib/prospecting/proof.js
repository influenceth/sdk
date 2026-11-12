import { integer, field } from './validation.js';
import { CIRCUIT } from './config.js';
import { getProofPacket } from './model.js';
import assets from '../../contracts/prospecting/proof-assets.json' with { type: 'json' };
import verifiers from '../../contracts/prospecting/verifiers.json' with { type: 'json' };

let garaga;
export function getAssets (sampleCount) {
  const n = integer(sampleCount, 1, 10, 'sample count');
  if (assets.circuit !== CIRCUIT || assets.maxSamples !== 10) throw new Error('Incompatible padded proof assets');
  return { ...assets, sampleCount: n };
}
export function assertProofStatement (packet, publicSignals) {
  if (packet.circuit !== CIRCUIT || !Array.isArray(publicSignals) || publicSignals.length !== 1 ||
      field(publicSignals[0]) !== field(packet.expectedPublicSignals[0])) throw new Error('Proof does not match the selected claim');
  integer(packet.sampleCount, 1, 10, 'sample count');
  return true;
}
export async function getVerifierCalldata ({ record, proof, publicSignals }) {
  const packet = getProofPacket(record);
  assertProofStatement(packet, publicSignals);
  garaga ||= import('garaga').then(async (module) => { await module.init(); return module; });
  const module = await garaga;
  const data = module.getGroth16CallData(
    module.parseGroth16ProofFromObject(proof, publicSignals),
    module.parseGroth16VerifyingKeyFromObject(verifiers.verificationKey),
    module.CurveId.BN254
  ).map(String);
  if (Number(data[0]) !== data.length - 1) throw new Error('Invalid verifier span encoding');
  // The compiled ABI adds the Span length. Keep it exactly once on the wire.
  return data.slice(1);
}
export default { getAssets, assertProofStatement, getVerifierCalldata };
