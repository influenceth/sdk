import { shortString } from 'starknet';
import { generateKeyPairFromSeed } from '@libp2p/crypto/keys';
import Encryption from '../utils/encryption.js';
import { positive } from './prospecting/validation.js';

const PROTOCOL = '/influence/private-records/1.0.0';
const MAX_RECORD_BYTES = 256 * 1024;
const encoder = new TextEncoder();
const CIPHERTEXT_FIELDS = ['ephemeralPublicKey', 'iv', 'encryptedMessage'];
const bytesToHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
const hexToBytes = (hex) => Uint8Array.from(hex.match(/../g), (byte) => parseInt(byte, 16));
const sha256 = async (text) => bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text))));
const keySeed = async (privateKey) => hexToBytes(await sha256(`Influence private-data peer v1:${positive(privateKey, 252)}`));
const recordId = (privateKey, scope) => {
  if (typeof scope !== 'string' || !scope.length) throw new TypeError('A private record scope is required');
  return sha256(`Influence private-data record v1:${positive(privateKey, 252)}:${scope}`);
};
const contentHash = (record, id) => sha256(JSON.stringify(['Influence private-data envelope v1', id, record.revision,
  CIPHERTEXT_FIELDS.map((key) => record.ciphertext[key]), record.updatedAt]));
const validateRemoteRecord = (record) => {
  if (!record || !/^[a-f0-9]{128}$/.test(record.signature) || !Number.isSafeInteger(record.revision) || record.revision < 1 ||
      !record.ciphertext || !CIPHERTEXT_FIELDS.every((key) => typeof record.ciphertext[key] === 'string') ||
      !Number.isSafeInteger(record.updatedAt) || record.updatedAt < 0 ||
      encoder.encode(JSON.stringify(record)).length > MAX_RECORD_BYTES) throw new Error('Invalid encrypted private record');
};
const derivePeerPrivateKey = async (privateKey) => generateKeyPairFromSeed('Ed25519', await keySeed(privateKey));
const signRecord = async (privateKey, scope, record) => {
  const id = await recordId(privateKey, scope); const key = await derivePeerPrivateKey(privateKey);
  const signed = { revision: record.revision, ciphertext: record.ciphertext, updatedAt: record.updatedAt };
  signed.signature = bytesToHex(await key.sign(encoder.encode(await contentHash(signed, id))));
  validateRemoteRecord(signed);
  return { id, record: signed };
};
const verifySignedRecord = async (publicKey, id, record) => {
  validateRemoteRecord(record);
  if (!/^[a-f0-9]{64}$/.test(id) || !publicKey || typeof publicKey.verify !== 'function') throw new TypeError('A signing public key and opaque record ID are required');
  if (!await publicKey.verify(encoder.encode(await contentHash(record, id)), hexToBytes(record.signature))) throw new Error('Private record authentication failed');
  return true;
};
const verifyRecord = async (privateKey, scope, record) => {
  const id = await recordId(privateKey, scope); const key = await derivePeerPrivateKey(privateKey);
  return verifySignedRecord(key.publicKey, id, record);
};
const encryptRecord = (publicKey, value) => Encryption.encryptContent(publicKey, JSON.stringify(value));
const decryptRecord = async (privateKey, scope, record) => {
  await verifyRecord(privateKey, scope, record);
  return JSON.parse(await Encryption.decryptContent(privateKey, record.ciphertext));
};

const getUnlockMessage = ({ chainId, seed }) => {
  if (typeof seed !== 'string' || !seed.length) throw new TypeError('The existing encryption recovery seed is required');
  const chain = typeof chainId === 'string' && !/^(0x[0-9a-f]+|[0-9]+)$/i.test(chainId)
    ? shortString.encodeShortString(chainId)
    : `0x${positive(chainId, 252).toString(16)}`;
  return {
    domain: { name: 'Influence', chainId: chain, version: '1.1.0' },
    message: { message: 'Messaging Hash', nonce: seed.substring(0, 24) },
    primaryType: 'Message',
    types: {
      Message: [{ name: 'message', type: 'string' }, { name: 'nonce', type: 'string' }],
      StarkNetDomain: [{ name: 'name', type: 'felt' }, { name: 'chainId', type: 'felt' }, { name: 'version', type: 'felt' }]
    }
  };
};
const assertKey = (privateKey, publicKey) => {
  if (Encryption.getPublicKeyFromPrivateKey(privateKey).toLowerCase() !== publicKey.toLowerCase()) throw new Error('Wallet recovery did not match the published private-data key');
  return true;
};
const deriveKey = async ({ walletAccount, chainId, seed }) => {
  if (typeof walletAccount?.signMessage !== 'function') throw new TypeError('A Starknet wallet signer is required');
  const signature = await walletAccount.signMessage(getUnlockMessage({ chainId, seed }));
  if (!signature) throw new Error('Private-data unlock was not signed');
  // Preserve the original inbox derivation; changing signature encoding would strand records.
  return Encryption.generatePrivateKeyFromSeed(`${seed}${BigInt(signature.join('')).toString(16)}`);
};
const recoverKey = async (options) => {
  const key = await deriveKey(options);
  assertKey(key, options.publicKey);
  return key;
};

export default {
  getUnlockMessage,
  recoverKey,
  deriveKey,
  assertKey,
  PROTOCOL,
  MAX_RECORD_BYTES,
  sha256,
  keySeed,
  recordId,
  contentHash,
  validateRemoteRecord,
  derivePeerPrivateKey,
  signRecord,
  verifyRecord,
  verifySignedRecord,
  encryptRecord,
  decryptRecord
};
