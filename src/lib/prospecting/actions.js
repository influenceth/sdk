import { uint, integer, field } from './validation.js';
import * as Kernel from './kernel.js';

export function unpackMeta (value) {
  const meta = Kernel.unpackMeta(uint(value, 81));
  integer(meta.lot, 1, 2097151, 'lot index');
  integer(meta.abundance, 0, 1000000, 'local abundance');
  return meta;
}
export function packMeta (meta) {
  integer(meta.lot, 1, 2097151, 'lot index');
  integer(meta.x, 0, 1048575, 'metadata x');
  integer(meta.z, 0, 1048575, 'metadata z');
  integer(meta.abundance, 0, 1000000, 'local abundance');
  return Kernel.packMeta(meta);
}
export function validateAction (action) {
  return {
    method: integer(action.method, 0, 2, 'sample method'),
    target: integer(action.target, 0, 9, 'sample target'),
    source: integer(action.source, 0, 9, 'sample source'),
    depth: integer(action.depth, 0, 4, 'sample depth'),
    salt: field(action.salt)
  };
}
export function actionHash (context, index, action) {
  return Kernel.actionHash(field(context), integer(index, 0, 9, 'sample index'), validateAction(action));
}

export function generateSalt () {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return BigInt('0x' + Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')).toString();
}
