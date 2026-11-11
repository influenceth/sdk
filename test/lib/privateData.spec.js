import { expect } from 'chai';
import PrivateData from '../../src/lib/privateData.js';
import Encryption from '../../src/utils/encryption.js';

describe('Shared private-data records', function () {
  it('preserves peer identity and opaque record IDs across key recovery', async function () {
    const key = await Encryption.generatePrivateKeyFromSeed('sdk-private-records');
    const a = await PrivateData.derivePeerPrivateKey(key); const b = await PrivateData.derivePeerPrivateKey(BigInt(key).toString());
    expect(Array.from(a.publicKey.raw)).to.deep.equal(Array.from(b.publicKey.raw));
    expect(await PrivateData.recordId(key, 'scope')).to.equal(await PrivateData.recordId(key, 'scope'));
    expect(await PrivateData.recordId(key, 'scope')).not.to.equal(await PrivateData.recordId(key, 'other scope'));
  });
  it('keeps the existing inbox typed message and wallet derivation byte-compatible', async function () {
    const seed = '012345678901234567890123456789'; const chainId = '0x534e5f5345504f4c4941';
    const message = PrivateData.getUnlockMessage({ chainId: 'SN_SEPOLIA', seed });
    expect(message.domain).to.deep.equal({ name: 'Influence', chainId, version: '1.1.0' });
    expect(message.message).to.deep.equal({ message: 'Messaging Hash', nonce: seed.slice(0, 24) });
    let signed;
    const walletAccount = { signMessage: async (data) => { signed = data; return ['123', '456']; } };
    const expected = await Encryption.generatePrivateKeyFromSeed(seed + BigInt('123456').toString(16));
    const options = { walletAccount, chainId, seed, publicKey: Encryption.getPublicKeyFromPrivateKey(expected) };
    expect(await PrivateData.recoverKey(options)).to.equal(expected);
    expect(signed).to.deep.equal(message);
    let error;
    try { await PrivateData.recoverKey({ ...options, publicKey: 'wrong' }); } catch (e) { error = e; }
    expect(error).to.be.instanceOf(Error);
  });
  it('encrypts, authenticates and recovers while rejecting altered data and other accounts', async function () {
    const key = await Encryption.generatePrivateKeyFromSeed('sdk-private-records');
    const publicKey = Encryption.getPublicKeyFromPrivateKey(key);
    const privateRecord = { actions: [{ salt: 'keep-secret' }], schema: 1 };
    const ciphertext = await PrivateData.encryptRecord(publicKey, privateRecord);
    const envelope = await PrivateData.signRecord(key, 'scope', { revision: 1, updatedAt: 100, ciphertext });
    expect(JSON.stringify(envelope)).not.to.include('keep-secret');
    const signingKey = await PrivateData.derivePeerPrivateKey(key);
    expect(await PrivateData.verifySignedRecord(signingKey.publicKey, envelope.id, envelope.record)).to.equal(true);
    expect(await PrivateData.decryptRecord(key, 'scope', envelope.record)).to.deep.equal(privateRecord);
    for (const [scope, value] of [['wrong scope', envelope.record], ['scope', { ...envelope.record, revision: 2 }]]) {
      let error;
      try { await PrivateData.decryptRecord(key, scope, value); } catch (e) { error = e; }
      expect(error).to.be.instanceOf(Error);
    }
    const wrong = await Encryption.generatePrivateKeyFromSeed('wrong key');
    let error;
    try { await PrivateData.decryptRecord(wrong, 'scope', envelope.record); } catch (e) { error = e; }
    expect(error).to.be.instanceOf(Error);
  });
});
