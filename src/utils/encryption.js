import { ec } from 'starknet';

// Helper functions
function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => ('00' + byte.toString(16)).slice(-2))
    .join('');
}

function hexToBytes(hexStr) {
  const bytes = new Uint8Array(hexStr.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function generateSeed() {
  const array = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function publicKeyToMessagingKeys(publicKey) {
  if (publicKey?.length === 130) {
    return {
      messaging_key_x: BigInt(`0x${publicKey.substr(2, 64)}`),
      messaging_key_y: BigInt(`0x${publicKey.substr(66)}`),
    };
  }
}

export function messagingKeysToPublicKey({ messaging_key_x, messaging_key_y }) {
  if (messaging_key_x && messaging_key_y) {
    return `04${BigInt(messaging_key_x).toString(16).padStart(64, '0')}${BigInt(messaging_key_y).toString(16).padStart(64, '0')}`;
  }
  return null;
}

// Function to generate private key from seed
export async function generatePrivateKeyFromSeed(seed) {
  // Convert seed to bytes
  const encoder = new TextEncoder();
  const seedBytes = encoder.encode(seed);
  // Hash the seed using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', seedBytes);
  const hashArray = new Uint8Array(hashBuffer);
  // Convert hash to BigInt
  const hashHex = bytesToHex(hashArray);
  const hashBigInt = BigInt('0x' + hashHex);
  // Reduce modulo curve order n to get a valid private key
  const privateKey = hashBigInt % ec.starkCurve.CURVE.n;
  // Ensure privateKey != 0
  if (privateKey === 0n) {
    throw new Error('Invalid seed resulting in zero private key');
  }
  return `0x${privateKey.toString(16).padStart(64, '0')}`;
}

// Function to get public key from private key
export function getPublicKeyFromPrivateKey(privateKey, returnHex = true) {
  const publicKey = ec.starkCurve.getPublicKey(privateKey, false); // Uint8Array
  return returnHex ? bytesToHex(publicKey) : publicKey;
}

// Function to encrypt message
export async function encryptContent(recipientPublicKeyHex, message) {
  // Convert recipientPublicKeyHex to Uint8Array
  const recipientPublicKeyBytes = hexToBytes(recipientPublicKeyHex);

  // Generate ephemeral keypair
  const ephemeralPrivateKey = ec.starkCurve.utils.randomPrivateKey();
  const ephemeralPublicKey = ec.starkCurve.getPublicKey(ephemeralPrivateKey, false); // Uint8Array

  // Compute shared secret
  const sharedSecret = ec.starkCurve.getSharedSecret(ephemeralPrivateKey, recipientPublicKeyBytes); // Uint8Array

  // Derive symmetric key
  const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecret);

  // Import symmetric key
  const symmetricKey = await crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Generate IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the message using AES-256-GCM
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    symmetricKey,
    messageBytes
  );

  // The encrypted data is an ArrayBuffer
  const encryptedBytes = new Uint8Array(encryptedBuffer);

  // Return encrypted data: ephemeralPublicKey, iv, encryptedMessage
  return {
    ephemeralPublicKey: bytesToHex(ephemeralPublicKey),
    iv: bytesToHex(iv),
    encryptedMessage: bytesToHex(encryptedBytes),
  };
}

// Function to decrypt message
export async function decryptContent(privateKey, encryptedData) {
  const { ephemeralPublicKey, iv, encryptedMessage } = encryptedData;

  // Convert data from hex to Uint8Array
  const ephemeralPublicKeyBytes = hexToBytes(ephemeralPublicKey);
  const ivBytes = hexToBytes(iv);
  const encryptedBytes = hexToBytes(encryptedMessage);

  // Compute shared secret
  const sharedSecret = ec.starkCurve.getSharedSecret(privateKey, ephemeralPublicKeyBytes); // Uint8Array

  // Derive symmetric key
  const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecret);

  // Import symmetric key
  const symmetricKey = await crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // Decrypt the message using AES-256-GCM
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    symmetricKey,
    encryptedBytes
  );

  // Convert decryptedBuffer to string
  const decoder = new TextDecoder();
  const decryptedMessage = decoder.decode(decryptedBuffer);

  return decryptedMessage;
}

export default {
  generateSeed,
  generatePrivateKeyFromSeed,
  getPublicKeyFromPrivateKey,
  publicKeyToMessagingKeys,
  messagingKeysToPublicKey,
  encryptContent,
  decryptContent,
}