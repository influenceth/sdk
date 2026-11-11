import { CallData, Contract, hash } from 'starknet';
import { field, integer, positive, uint } from './validation.js';
import { RULES_VERSION, RANDOMNESS_BLOCK_DELAY, BLOCK_HASH_AVAILABILITY_DELAY } from './config.js';
import { getIdentity, unpackMeta, replayCampaign, assertChainTranscript } from './model.js';
import { STATUSES } from './lifecycle.js';
import Proof from './proof.js';
import abi from '../../contracts/prospecting/fieldwork.json' with { type: 'json' };
import manifest from '../../contracts/prospecting/manifest.json' with { type: 'json' };

const coder = new CallData(abi);
const felt = (value) => {
  const n = uint(value, 252);
  if (n >= (1n << 251n) + 17n * (1n << 192n) + 1n) throw new RangeError('Invalid Starknet felt');
  return n.toString();
};
const contractAddress = (value) => `0x${positive(felt(value), 252).toString(16)}`;
export function getCampaignContext ({ domain, identity, campaignId }) {
  const i = getIdentity(identity);
  return hash.computePoseidonHashOnElements([7000, felt(domain), i.chainId, i.game, positive(campaignId),
    i.owner, i.originIndex, i.asteroidId, i.resource, RULES_VERSION]);
}
export function getBlockRandomness ({ domain, game, campaignId, sampleIndex, blockHash }) {
  return (BigInt(hash.computePoseidonHashOnElements([felt(domain), felt(game), positive(campaignId),
    integer(sampleIndex, 0, 9, 'sample index'), felt(blockHash)])) & ((1n << 64n) - 1n)).toString();
}
export function getCreateCall ({ address, origin, resource }) {
  return {
    contractAddress: contractAddress(address),
    entrypoint: 'create',
    calldata: coder.compile('create', { origin: integer(origin, 1, 2097151, 'origin'), resource: integer(resource, 1, 22, 'resource') })
  };
}
export function getCommitCall ({ address, campaignId, lot, index, commitment }) {
  return {
    contractAddress: contractAddress(address),
    entrypoint: 'commit_checked',
    calldata: coder.compile('commit_checked', { id: positive(campaignId), lot: integer(lot, 1, 2097151, 'target lot'), expected_index: integer(index, 0, 9, 'sample index'), commitment: field(commitment) })
  };
}
export function getFinalizeCall ({ address, campaignId, lot, quantity, rate, proofCalldata }) {
  if (!Array.isArray(proofCalldata) || !proofCalldata.length) throw new TypeError('A verifier proof span is required');
  return {
    contractAddress: contractAddress(address),
    entrypoint: 'finalize',
    calldata: coder.compile('finalize', {
      id: positive(campaignId),
      lot: integer(lot, 1, 2097151, 'claim lot'),
      quantity: integer(quantity, 1, 4294967295, 'claim quantity'),
      multiplier: integer(rate, 90, 200, 'claim rate'),
      proof: proofCalldata.map(felt)
    })
  };
}
export function getAbandonCall ({ address, campaignId }) {
  return { contractAddress: contractAddress(address), entrypoint: 'abandon', calldata: coder.compile('abandon', { id: positive(campaignId) }) };
}
export function createSandboxClient ({ address, providerOrAccount }) {
  const contract = new Contract({ abi, address: contractAddress(address), providerOrAccount });
  return {
    contract,
    async metadata (origin, lot, resource, options) {
      const value = await contract.call('metadata', [origin, lot, resource], options);
      unpackMeta(value);
      return String(value);
    },
    async campaign (id, options) {
      const result = await contract.call('get_campaign', [positive(id)], options);
      return {
        ...result,
        id: String(id),
        sampleCount: Number(result.count),
        replaceableAt: Number(result.replaceable),
        status: result.closed
          ? (result.quantity > 0n ? STATUSES.FINALIZED : STATUSES.CANCELLED)
          : result.pending ? STATUSES.SAMPLE_PENDING : STATUSES.ACTIVE_READY
      };
    },
    previewSample: (id, lot, options) => contract.call('preview_sample', [positive(id), integer(lot, 1, 2097151, 'sample lot')], options),
    core: (id, index, options) => contract.call('get_core', [positive(id), integer(index, 0, 9, 'sample index')], options),
    randomness: (id, options) => contract.call('preview_randomness', [positive(id)], options),
    ratePreview: (abundancePpm, multiplier, options) => contract.call('rate_preview', [abundancePpm, multiplier], options)
  };
}
export async function prepareFinalizeCall ({ client, record, proof, publicSignals, blockIdentifier }) {
  if (record.mode !== 'chain' || (record.qualityBps ?? 10000) !== 10000) throw new Error('Sandbox finalization requires a chain record with neutral sampling quality');
  const options = blockIdentifier === undefined ? undefined : { blockIdentifier };
  const campaign = await client.campaign(record.campaignId, options);
  const count = Number(campaign.count) + (campaign.pending ? 1 : 0);
  const cores = await Promise.all(Array.from({ length: count }, (_, i) => client.core(record.campaignId, i, options)));
  const pendingRandomness = campaign.pending ? await client.randomness(record.campaignId, options) : undefined;
  assertChainTranscript(record, campaign, cores, { pendingRandomness });
  const result = replayCampaign(record).finalized;
  const proofCalldata = await Proof.getVerifierCalldata({ record, proof, publicSignals });
  return getFinalizeCall({
    address: client.contract.address,
    campaignId: record.campaignId,
    lot: result.lot,
    quantity: result.quantity,
    rate: result.rate,
    proofCalldata
  });
}
export default {
  abi,
  manifest,
  developmentOnly: true,
  RANDOMNESS_BLOCK_DELAY,
  BLOCK_HASH_AVAILABILITY_DELAY,
  getCampaignContext,
  getBlockRandomness,
  getCreateCall,
  getCommitCall,
  getFinalizeCall,
  getAbandonCall,
  createSandboxClient,
  prepareFinalizeCall
};
