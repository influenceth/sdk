import Address from '../../utils/address.js';
import { uint, integer, field } from './validation.js';
import * as Config from './config.js';
import * as Kernel from './kernel.js';
import { validatePending } from './pending.js';
import { unpackMeta, validateAction } from './actions.js';

export { unpackMeta, packMeta, validateAction, actionHash, generateSalt } from './actions.js';

export function getIdentity (identity) {
  const chainId = `0x${uint(identity.chainId, 252).toString(16)}`;
  for (const name of ['game', 'owner']) if (!uint(identity[name], 251)) throw new RangeError(`Missing ${name}`);
  return {
    chainId,
    game: Address.toStandard(identity.game),
    owner: Address.toStandard(identity.owner),
    asteroidId: integer(identity.asteroidId, 1, 4294967295, 'asteroid ID'),
    originIndex: integer(identity.originIndex, 1, 2097151, 'origin index'),
    resource: integer(identity.resource, 1, 22, 'resource')
  };
}
export const getScopeKey = (identity) => JSON.stringify(getIdentity(identity));
export function getOriginKey (identity) {
  const { chainId, game, asteroidId, originIndex } = getIdentity(identity);
  return JSON.stringify({ chainId, game, asteroidId, originIndex });
}
export function createRecord ({ identity, context, campaignId, mode = 'chain', qualityBps = 10000 }) {
  if (!['chain', 'local-simulation'].includes(mode)) throw new RangeError('Unsupported campaign mode');
  const record = {
    schema: mode === 'chain' ? 2 : 1,
    rules: Config.RULES_VERSION,
    mode,
    quantityMultiplierBps: Config.QUANTITY_MULTIPLIER_BPS,
    identity: getIdentity(identity),
    context: field(context),
    actions: [],
    pending: null,
    selected: null,
    claimIndex: null
  };
  if (mode === 'chain') {
    if (!uint(campaignId, 64)) throw new RangeError('A chain campaign ID is required');
    record.campaignId = String(campaignId);
  }
  if (qualityBps !== 10000) record.qualityBps = integer(qualityBps, 1, 15000, 'sampling quality');
  return record;
}
export function getClaim (cell, abundance) {
  const raw = Kernel.claim(cell, integer(abundance, 0, 1000000, 'local abundance'));
  const quantity = Number(BigInt(raw.quantity) * 3n / 2n);
  integer(quantity, 1, 4294967295, 'claim quantity');
  return { ...raw, quantity, rateBps: raw.rate * 100, depth: cell[2] };
}
export function replayCampaign (record, identity = record.identity) {
  if (record.schema !== (record.mode === 'chain' ? 2 : 1) || record.rules !== Config.RULES_VERSION ||
      record.quantityMultiplierBps !== Config.QUANTITY_MULTIPLIER_BPS ||
      !['local-simulation', 'chain'].includes(record.mode) ||
      getScopeKey(record.identity) !== getScopeKey(identity) || !Array.isArray(record.actions) || record.actions.length > 10) {
    throw new Error('Incompatible campaign identity or rules version');
  }
  if (record.mode === 'chain' && !uint(record.campaignId, 64)) throw new RangeError('Missing chain campaign ID');
  const context = field(record.context); const origin = getIdentity(identity).originIndex;
  const quality = record.qualityBps === undefined ? 10000 : integer(record.qualityBps, 1, 15000, 'sampling quality');
  if (record.mode === 'chain' && record.pending) validatePending(record.pending, record);
  const entries = [...record.actions, ...(record.mode === 'local-simulation' && record.pending ? [record.pending] : [])];
  if (entries.length > 10) throw new RangeError('Campaign exceeds ten samples');
  let cells = Array.from({ length: 10 }, Kernel.zero);
  const history = [];
  for (const [index, entry] of entries.entries()) {
    const action = validateAction(entry.action);
    unpackMeta(entry.meta);
    const meta = uint(entry.meta, 81).toString();
    const mask = uint(entry.mask, index).toString();
    const randomness = uint(entry.randomness, 64).toString();
    cells.origin = origin;
    const result = Kernel.transition(cells, history, context, index, action, meta, mask, randomness, quality);
    if (entry.commitment !== undefined && field(entry.commitment) !== result.commitment) throw new Error('Sample commitment mismatch');
    cells = result.state;
    history.push({ ...result, action, meta, mask, randomness });
  }
  let finalized = null;
  if (record.claimIndex !== null) {
    const index = integer(record.claimIndex, 0, entries.length - 1, 'claim index');
    const cell = cells[index];
    finalized = getClaim(cell, unpackMeta(history[index].meta).abundance);
  }
  return {
    context,
    cells,
    history,
    finalized,
    pending: record.mode === 'chain' ? record.pending : null,
    selected: record.selected,
    depth: record.selected?.depth || 0
  };
}
export function appendSample (record, entry) {
  if (record.mode !== 'local-simulation' || record.pending || record.claimIndex !== null) throw new Error('Use the transaction lifecycle for chain samples');
  const next = { ...record, actions: [...record.actions, entry] };
  replayCampaign(next);
  return next;
}
export function finalizeRecord (record, claimIndex) {
  if (record.pending || record.claimIndex !== null) throw new Error('Campaign is pending or already finalized');
  const next = { ...record, claimIndex };
  replayCampaign(next);
  return next;
}
export function getProofPacket (record, identity = record.identity) {
  if (record.pending || record.claimIndex === null || !record.actions.length) throw new Error('Finalize a fully resolved campaign before proving');
  const state = replayCampaign(record, identity);
  const input = {
    context: state.context,
    origin: String(identity.originIndex),
    quality: String(record.qualityBps ?? 10000),
    meta: state.history.map((entry) => entry.meta),
    blockedApproaches: state.history.map((entry) => entry.mask),
    commitments: state.history.map((entry) => entry.commitment),
    randomness: state.history.map((entry) => entry.randomness),
    methods: state.history.map(({ action }) => String(action.method)),
    targets: state.history.map(({ action }) => String(action.target)),
    sources: state.history.map(({ action }) => String(action.source)),
    depths: state.history.map(({ action }) => String(action.depth)),
    salts: state.history.map(({ action }) => action.salt),
    selected: String(record.claimIndex)
  };
  return {
    circuit: Config.CIRCUIT,
    mode: record.mode,
    sampleCount: record.actions.length,
    input,
    expectedPublicSignals: [Kernel.digest(input.context, input.quality, input.origin, input.meta,
      input.blockedApproaches, input.commitments, input.randomness, state.finalized)]
  };
}
export function assertChainTranscript (record, campaign, cores, { pendingRandomness } = {}) {
  const packet = getProofPacket(record);
  if (record.mode !== 'chain' || String(record.campaignId) !== String(campaign.id) || field(campaign.context) !== packet.input.context ||
      campaign.closed || Number(campaign.count) + (campaign.pending ? 1 : 0) !== cores.length || cores.length !== record.actions.length ||
      Number(campaign.origin) !== record.identity.originIndex || Number(campaign.resource) !== record.identity.resource ||
      !Address.areEqual(campaign.owner, record.identity.owner)) throw new Error('Chain campaign does not match the private transcript');
  for (const [i, core] of cores.entries()) {
    if (field(core.commitment) !== packet.input.commitments[i] || uint(core.meta, 81).toString() !== packet.input.meta[i] ||
        uint(core.blockedApproaches, i).toString() !== packet.input.blockedApproaches[i] ||
        uint(campaign.pending && i === cores.length - 1 ? pendingRandomness : core.random, 64).toString() !== packet.input.randomness[i]) throw new Error(`Chain sample ${i} differs from the private transcript`);
  }
  return packet;
}
