import { expect } from 'chai';
import { Encryption } from '../../src/index.js';

const sampleSeed = '2a1ded6e8f66bc48e5872bf9105e80046300308962fe51f0b611f2af6bab60ea';
const samplePrivateKey = '0x0550aeb48829403d98e3ba904acc0217e6dfbd009f0b5ad98569c4b61e373309';
const samplePublicKey = '0404fa8d30182b0f62618a481bf4afb14b815057570a028355fae8da22969840f6042a3c380981faa3ae8e95406ab898b91f124f7f7aced5f3ec4746b99e529c95';
const sampleMessageKeys = {
  message_key_x: 2251937603385208024268746691711293108925510072271936097377258983003822506230n,
  message_key_y: 1883874586592859398548265238594790780856956796067331763265145999321206004885n
};
const sampleDecryptedMessage = 'Hello, world!';
const sampleEncryptedMessage = 'eyJlcGhlbWVyYWxQdWJsaWNLZXkiOiIwNDA3MDU4YzFkZmM4N2NhZDIwMjkxZDQ3OWY2OWZhMDQwZWY2NjMzOGYwZjQ4OWE4OTNmNDM0NzhmZGY2YTQ2ZTIwNjkwODM4MDUzYjcxNTkxYTU0ZGM0MjU3MmExNjc1YWU5NjI3ZDE5MGQ3MjNiZGE0ZmI0MzU0MGU4ZTFhYmQzIiwiaXYiOiJhMzA4NTY1ZmM3NTFlMDRlOWE5YTU1YmYiLCJlbmNyeXB0ZWRNZXNzYWdlIjoiYTc4OTBmZjY0M2M2MjhjYTUwNmQ5NzY3MDViYjVlMDAzMzJmOTY0NzZkMzFjZmM5MTdjMDhmZjlmYSJ9';

describe('Encryption library', function () {
  describe('generateSeed', function () {
    it ('should generate a seed', function () {
      const seed = Encryption.generateSeed();
      expect(seed).to.be.a('string').with.lengthOf(64);
    });
  });

  describe('publicKeyToMessageKeys', function () {
    it ('should convert a public key to message keys', function () {
      const messageKeys = Encryption.publicKeyToMessageKeys(samplePublicKey);
      expect(messageKeys).to.be.an('object').with.keys('message_key_x', 'message_key_y');
      expect(messageKeys.message_key_x).to.be.a('bigint');
      expect(messageKeys.message_key_y).to.be.a('bigint');
      expect(messageKeys).to.deep.equal(sampleMessageKeys);
    });
  });

  describe('messageKeysToPublicKey', function () {
    it ('should convert message keys to a public key', function () {
      const publicKey = Encryption.messageKeysToPublicKey(sampleMessageKeys);
      expect(publicKey).to.be.a('string').with.lengthOf(130);
      expect(publicKey.slice(0, 2)).to.equal('04');
      expect(publicKey).to.equal(samplePublicKey);
    });
  });

  describe('getPublicKeyFromPrivateKey', function () {
    it('should get a public key (buffer) from a private key', function () {
      const publicKey = Encryption.getPublicKeyFromPrivateKey(samplePrivateKey, false);
      expect(publicKey).to.be.a('Uint8Array').with.lengthOf(65);
      expect(publicKey[0]).to.equal(4);
    });

    it('should get a public key (hex string) from a private key', function () {
      const publicKey = Encryption.getPublicKeyFromPrivateKey(samplePrivateKey);
      expect(publicKey).to.be.a('string').with.lengthOf(130);
      expect(publicKey.slice(0, 2)).to.equal('04');
      expect(publicKey).to.equal(samplePublicKey);
    });
  });

  describe('generatePrivateKeyFromSeed', function () {
    it ('should generate a private key from a seed', async function () {
      const privateKey = await Encryption.generatePrivateKeyFromSeed(sampleSeed);
      expect(privateKey).to.be.a('string').with.lengthOf(66);
      expect(privateKey).to.equal(samplePrivateKey);
    });
  });

  describe('encrypt + decrypt', function () {
    it ('should encrypt a message', async function () {
      const encryptedMessage = await Encryption.encryptContent(samplePublicKey, sampleDecryptedMessage);
      expect(encryptedMessage).to.be.a('string');
    });

    it ('should decrypt a message', async function () {
      const decryptedMessage = await Encryption.decryptContent(samplePrivateKey, sampleEncryptedMessage);
      expect(decryptedMessage).to.equal(sampleDecryptedMessage);
    });

    it ('should encrypt and decrypt a unique message', async function () {
      const message = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
        eiusmod tempor incididunt ut labore et dolore magna aliqua.

        ${Date.now()}
      `;

      const encryptedMessage = await Encryption.encryptContent(samplePublicKey, message);
      expect(encryptedMessage).to.not.equal(message);
      const decryptedMessage = await Encryption.decryptContent(samplePrivateKey, encryptedMessage);
      expect(decryptedMessage).to.equal(message);
    });
  });

});