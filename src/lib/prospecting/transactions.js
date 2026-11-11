import { getIdentity, replayCampaign } from './model.js';
import { actionHash, validateAction, unpackMeta } from './actions.js';
import { validatePending } from './pending.js';
import { field, uint } from './validation.js';
import { isSampleReady } from './lifecycle.js';
import { followError } from './followApproach.js';

export function prepareSample (record, { action, meta, blockedApproaches, preparedAt }) {
  const snapshot = replayCampaign(record);
  if (record.mode !== 'chain' || record.pending || record.claimIndex !== null || record.actions.length >= 10) throw new Error('Campaign cannot commit another sample');
  const normalized = validateAction(action); const index = record.actions.length;
  const { lot } = unpackMeta(meta);
  const mask = uint(blockedApproaches, index).toString();
  if (normalized.method === 0 && normalized.target !== index) throw new Error('Follow must target the next transcript index');
  if (normalized.method !== 0) {
    const cell = snapshot.cells[normalized.target];
    if (!cell[0] || !cell[3] || cell[1] !== lot || cell[2] !== normalized.depth || cell[normalized.method === 1 ? 7 : 8]) throw new Error('Invalid measurement target');
  } else {
    const error = followError(snapshot.cells, snapshot.history, getIdentity(record.identity).originIndex,
      snapshot.cells[normalized.source], lot, normalized.depth, ((BigInt(mask) >> BigInt(normalized.source)) & 1n) === 1n);
    if (error) throw new Error(error);
  }
  const pending = {
    stage: 'prepared',
    index,
    action: normalized,
    lot,
    preparedAt: Number(uint(preparedAt, 53)),
    commitment: actionHash(record.context, index, normalized),
    previewMeta: String(meta),
    previewMask: mask
  };
  return { ...record, pending };
}
export function markSubmitted (record, transactionHash) {
  if (record.pending?.stage !== 'prepared') throw new Error('Sample is not prepared');
  return { ...record, pending: { ...record.pending, stage: 'submitted', transactionHash: uint(transactionHash, 252).toString() } };
}
export function acceptSample (record, core) {
  if (!['prepared', 'submitted', 'accepted'].includes(record.pending?.stage)) throw new Error('No submitted sample to reconcile');
  if (field(core.commitment) !== record.pending.commitment || String(core.meta) !== record.pending.previewMeta || String(core.blockedApproaches) !== record.pending.previewMask) throw new Error('Accepted commitment or lot differs from the saved intent');
  const next = {
    ...record,
    pending: {
      ...record.pending,
      stage: 'accepted',
      meta: String(core.meta),
      mask: uint(core.blockedApproaches, record.actions.length).toString(),
      targetBlock: uint(core.target).toString(),
      readyAt: Number(uint(core.ready, 53))
    }
  };
  validatePending(next.pending, next);
  return next;
}
export function retryRejectedSample (record, { transactionHash, executionStatus }) {
  if (record.pending?.stage !== 'submitted' || uint(transactionHash, 252).toString() !== record.pending.transactionHash ||
      executionStatus !== 'REVERTED') throw new Error('A confirmed reverted transaction is required before retrying');
  const { transactionHash: ignored, ...pending } = record.pending;
  return { ...record, pending: { ...pending, stage: 'prepared' } };
}
export function resolveSample (record, randomness, { now, blockNumber }) {
  if (record.pending?.stage !== 'accepted' || !isSampleReady(record.pending, { now, blockNumber })) throw new Error('Accepted sample randomness or work is not ready');
  const p = record.pending;
  const next = {
    ...record,
    pending: null,
    actions: [...record.actions, {
      action: p.action,
      meta: p.meta,
      mask: p.mask,
      commitment: p.commitment,
      randomness: uint(randomness, 64).toString()
    }]
  };
  replayCampaign(next);
  return next;
}
