import { CallData, hash } from 'starknet';
import Entity from '../entity.js';
import Lot from '../lot.js';
import System from '../system.js';
import Address from '../../utils/address.js';
import dispatcherAbis from '../../contracts/starknet_abis.json' with { type: 'json' };
import abis from '../../contracts/prospecting/gameplay.json' with { type: 'json' };
import manifest from '../../contracts/prospecting/gameplay-manifest.json' with { type: 'json' };
import { integer, positive, uint, field } from './validation.js';
import { RULES_VERSION, MAX_QUANTITY_PER_RUN } from './config.js';
import { getIdentity, assertChainTranscript, replayCampaign } from './model.js';
import { STATUSES } from './lifecycle.js';
import Proof from './proof.js';

const CHAIN_STATUSES = Object.freeze({ ACTIVE: 1, CANCELLED: 2, REPLACED: 3, FINALIZED: 4 });
const closedStatuses = { 2: STATUSES.CANCELLED, 3: STATUSES.REPLACED, 4: STATUSES.FINALIZED };
const address = (value) => `0x${positive(value, 251).toString(16)}`;
const felt = (value) => {
  const n = uint(value, 252);
  if (n >= (1n << 251n) + 17n * (1n << 192n) + 1n) throw new RangeError('Invalid Starknet felt');
  return n.toString();
};
const entity = (value, labels, empty = false) => {
  const label = integer(value?.label, 0, 65535, 'entity label');
  const id = uint(value?.id);
  if (!(empty && label === 0 && id === 0n) && (!labels.includes(label) || !id)) {
    throw new RangeError('Unexpected entity');
  }
  return { label, id: id.toString() };
};
const crewEntity = (value) => entity(value, [Entity.IDS.CREW]);
const lotEntity = (value) => {
  const lot = entity(value, [Entity.IDS.LOT]);
  const id = uint(lot.id, 53);
  const position = Lot.toPosition(Number(id));
  integer(position.asteroidId, 1, 4294967295, 'asteroid ID');
  integer(position.lotIndex, 1, 2097151, 'lot index');
  return lot;
};
const coders = new Map();
function coder (system) {
  if (!abis[system] || !System.Systems[system]) throw new Error(`Unknown gameplay system: ${system}`);
  if (!coders.has(system)) coders.set(system, new CallData(abis[system]));
  return coders.get(system);
}
function getCall ({ dispatcher, system, input }) {
  coder(system);
  return System.getRunSystemCall(system, input, address(dispatcher));
}
function getStartCall ({ dispatcher, origin, resource, crew }) {
  return getCall({
    dispatcher,
    system: 'ProspectingStart',
    input: {
      origin: lotEntity(origin), resource: integer(resource, 1, 22, 'resource'), caller_crew: crewEntity(crew)
    }
  });
}
function getSampleCall ({ dispatcher, campaignId, lot, index, commitment, inventoryOrigin, originSlot, crew }) {
  const origin = entity(inventoryOrigin, [Entity.IDS.BUILDING, Entity.IDS.SHIP], true);
  return getCall({
    dispatcher,
    system: 'ProspectingSample',
    input: {
      campaign_id: positive(campaignId),
      lot: lotEntity(lot),
      expected_index: integer(index, 0, 9, 'sample index'),
      commitment: field(commitment),
      origin,
      origin_slot: origin.label ? positive(originSlot) : uint(originSlot),
      caller_crew: crewEntity(crew)
    }
  });
}
function getFinalizeCall ({ dispatcher, campaignId, lot, quantity, rateBps, proofCalldata, crew }) {
  if (!Array.isArray(proofCalldata) || !proofCalldata.length) throw new TypeError('A verifier proof span is required');
  const rate = integer(rateBps, 9000, 20000, 'claim rate BPS');
  if (rate % 100) throw new RangeError('Claim rate must be a whole percentage');
  return getCall({
    dispatcher,
    system: 'ProspectingFinalize',
    input: {
      campaign_id: positive(campaignId),
      lot: lotEntity(lot),
      quantity: integer(quantity, 1, 4294967295, 'claim quantity'),
      rate_bps: rate,
      proof: proofCalldata.map(felt),
      caller_crew: crewEntity(crew)
    }
  });
}
function getAbandonCall ({ dispatcher, campaignId, crew }) {
  return getCall({
    dispatcher,
    system: 'ProspectingAbandon',
    input: {
      campaign_id: positive(campaignId), caller_crew: crewEntity(crew)
    }
  });
}
function extractionInput ({ quantity, extractor, extractorSlot, destination, destinationSlot, crew }) {
  return {
    yield: integer(quantity, 1, MAX_QUANTITY_PER_RUN, 'extraction quantity'),
    extractor: entity(extractor, [Entity.IDS.BUILDING]),
    extractor_slot: positive(extractorSlot),
    destination: entity(destination, [Entity.IDS.BUILDING, Entity.IDS.SHIP]),
    destination_slot: positive(destinationSlot),
    caller_crew: crewEntity(crew)
  };
}
function getBaselineExtractionCall ({ dispatcher, resource, ...options }) {
  return getCall({
    dispatcher,
    system: 'BaselineExtractResourceStart',
    input: {
      resource: integer(resource, 1, 22, 'resource'), ...extractionInput(options)
    }
  });
}
function getClaimExtractionCall ({ dispatcher, deposit, ...options }) {
  return getCall({
    dispatcher,
    system: 'ExtractResourceStart',
    input: {
      deposit: entity(deposit, [Entity.IDS.DEPOSIT]), ...extractionInput(options)
    }
  });
}
function getExtractionFinishCall ({ dispatcher, extractor, extractorSlot, crew }) {
  return getCall({
    dispatcher,
    system: 'ExtractResourceFinish',
    input: {
      extractor: entity(extractor, [Entity.IDS.BUILDING]), extractor_slot: positive(extractorSlot), caller_crew: crewEntity(crew)
    }
  });
}
function getCampaignContext ({ identity, campaignId, crew, verifier }) {
  const i = getIdentity(identity);
  return hash.computePoseidonHashOnElements([
    7000, i.chainId, i.game, positive(campaignId), Entity.packEntity(crewEntity(crew), false), i.owner,
    Entity.packEntity({ label: Entity.IDS.LOT, id: Lot.toId(i.asteroidId, i.originIndex) }, false),
    i.resource, RULES_VERSION, manifest.samplingQualityBps, address(verifier)
  ]);
}
function getBlockRandomness ({ chainId, dispatcher, campaignId, sampleIndex, blockHash }) {
  return (BigInt(hash.computePoseidonHashOnElements([
    7004, felt(chainId), address(dispatcher), positive(campaignId), integer(sampleIndex, 0, 9, 'sample index'), felt(blockHash)
  ])) & ((1n << 64n) - 1n)).toString();
}
function normalizeCampaign (id, raw) {
  const chainStatus = integer(raw.status, 1, 4, 'campaign status');
  const originLot = lotEntity(raw.origin);
  const { asteroidId, lotIndex } = Lot.toPosition(Number(originLot.id));
  const count = integer(raw.count, 0, 10, 'resolved sample count');
  const sampleCount = count + (raw.pending ? 1 : 0);
  if (sampleCount > 10) throw new RangeError('Invalid campaign sample count');
  return {
    id: positive(id).toString(),
    crew: crewEntity(raw.crew),
    owner: address(raw.creator),
    originLot,
    origin: lotIndex,
    asteroidId,
    resource: integer(raw.resource, 1, 22, 'resource'),
    context: field(raw.context),
    qualityBps: integer(raw.quality_bps, 1, 15000, 'sampling quality'),
    verifier: address(raw.verifier),
    count,
    pending: raw.pending,
    sampleCount,
    chainStatus,
    closed: chainStatus !== CHAIN_STATUSES.ACTIVE,
    status: closedStatuses[chainStatus] || (raw.pending ? STATUSES.SAMPLE_PENDING : STATUSES.ACTIVE_READY),
    replaceableAt: integer(raw.replaceable_at, 0, Number.MAX_SAFE_INTEGER, 'replacement time'),
    claim: entity(raw.claim, [Entity.IDS.DEPOSIT], true)
  };
}
function normalizeCore (raw) {
  return {
    commitment: field(raw.commitment),
    meta: uint(raw.meta, 81).toString(),
    blockedApproaches: uint(raw.blocked_approaches, 10).toString(),
    random: uint(raw.randomness).toString(),
    target: uint(raw.target_block).toString(),
    ready: integer(raw.ready_at, 0, Number.MAX_SAFE_INTEGER, 'sample ready time')
  };
}
function createClient ({ dispatcher, provider }) {
  if (typeof provider?.callContract !== 'function' || typeof provider?.getChainId !== 'function') {
    throw new TypeError('A Starknet RPC provider is required');
  }
  const gameAddress = address(dispatcher);
  const dispatcherCoder = new CallData(dispatcherAbis.Dispatcher);
  const read = async (system, input, options) => {
    const decoder = coder(system);
    if (!System.Systems[system].isGetter) throw new Error(`Not a gameplay read system: ${system}`);
    // run_system is an external entry point even when the selected system is a view.
    const response = await provider.callContract(getCall({ dispatcher: gameAddress, system, input }), options?.blockIdentifier);
    const result = dispatcherCoder.parse('run_system', response);
    return decoder.parse('run', result);
  };
  return {
    dispatcher: gameAddress,
    chainId: () => provider.getChainId(),
    campaign: async (id, options) => normalizeCampaign(id, await read('ReadProspectingCampaign', { campaign_id: positive(id) }, options)),
    core: async (id, index, options) => normalizeCore(await read('ReadProspectingSample', {
      campaign_id: positive(id), index: integer(index, 0, 9, 'sample index')
    }, options)),
    randomness: async (id, options) => uint(await read('ReadProspectingRandomness', { campaign_id: positive(id) }, options)).toString(),
    origin: async (origin, options) => uint(await read('ReadProspectingOrigin', { origin: lotEntity(origin) }, options)).toString(),
    async previewSample (id, lot, options) {
      const result = await read('PreviewProspectingSample', { campaign_id: positive(id), lot: lotEntity(lot) }, options);
      return { meta: uint(result[0], 81).toString(), blockedApproaches: uint(result[1], 10).toString() };
    }
  };
}
async function prepareFinalizeCall ({ client, record, proof, publicSignals, blockIdentifier }) {
  if (record.mode !== 'chain' || (record.qualityBps ?? 10000) !== 10000) {
    throw new Error('Game finalization requires a chain record with neutral sampling quality');
  }
  const options = blockIdentifier === undefined ? undefined : { blockIdentifier };
  const campaign = await client.campaign(record.campaignId, options);
  if (!Address.areEqual(record.identity.game, client.dispatcher) ||
      uint(record.identity.chainId, 252) !== uint(await client.chainId(), 252) ||
      record.identity.asteroidId !== campaign.asteroidId || campaign.qualityBps !== 10000) {
    throw new Error('Private record belongs to another game, chain or rules context');
  }
  const count = campaign.count + (campaign.pending ? 1 : 0);
  const cores = await Promise.all(Array.from({ length: count }, (_, i) => client.core(record.campaignId, i, options)));
  const pendingRandomness = campaign.pending ? await client.randomness(record.campaignId, options) : undefined;
  assertChainTranscript(record, campaign, cores, { pendingRandomness });
  const result = replayCampaign(record).finalized;
  const proofCalldata = await Proof.getVerifierCalldata({ record, proof, publicSignals });
  return getFinalizeCall({
    dispatcher: client.dispatcher,
    campaignId: record.campaignId,
    lot: { label: Entity.IDS.LOT, id: Lot.toId(campaign.asteroidId, result.lot) },
    quantity: result.quantity,
    rateBps: result.rateBps,
    proofCalldata,
    crew: campaign.crew
  });
}

export default {
  abis,
  manifest,
  CHAIN_STATUSES,
  getCall,
  getStartCall,
  getSampleCall,
  getFinalizeCall,
  getAbandonCall,
  getBaselineExtractionCall,
  getClaimExtractionCall,
  getExtractionFinishCall,
  getCampaignContext,
  getBlockRandomness,
  normalizeCampaign,
  normalizeCore,
  createClient,
  prepareFinalizeCall
};
