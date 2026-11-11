import { actionHash, validateAction, unpackMeta } from './actions.js';
import { integer, uint } from './validation.js';

export function validatePending (pending, record) {
  if (!pending || !['prepared', 'submitted', 'accepted'].includes(pending.stage)) throw new Error('Invalid pending sample stage');
  const action = validateAction(pending.action); const index = record.actions.length;
  if (pending.index !== index || actionHash(record.context, index, action) !== pending.commitment) throw new Error('Pending commitment does not match its action');
  integer(pending.lot, 1, 2097151, 'pending target lot');
  uint(pending.preparedAt, 53);
  if (unpackMeta(pending.previewMeta).lot !== pending.lot) throw new Error('Pending metadata target changed');
  uint(pending.previewMask, index);
  if (pending.stage === 'submitted' || pending.transactionHash !== undefined) uint(pending.transactionHash, 252);
  if (pending.stage === 'accepted') {
    if (unpackMeta(pending.meta).lot !== pending.lot) throw new Error('Accepted sample target changed');
    uint(pending.mask, index); uint(pending.targetBlock); uint(pending.readyAt, 53);
  }
  return true;
}
