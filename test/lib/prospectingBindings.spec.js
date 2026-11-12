import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import Prospecting from '../../src/lib/prospecting.js';
const fixtures = JSON.parse(readFileSync(new URL('../fixtures/prospecting/campaigns.json', import.meta.url)));

describe('Generated prospecting protocol bindings', function () {
  this.timeout(30000);
  it('identifies all development artifacts and keeps them out of production deployments', function () {
    const { manifest, abi } = Prospecting.Contracts;
    expect(manifest.developmentOnly).to.equal(true);
    expect(manifest.productionSystemsAvailable).to.equal(false);
    expect(Object.keys(manifest.verifiers)).to.have.length(10);
    expect(abi.some((entry) => entry.name === 'fieldwork_campaign::IFieldwork')).to.equal(true);
    for (let n = 1; n <= 10; n++) {
      expect(Prospecting.Proof.getAssets(n).sampleCount).to.equal(n);
      expect(Prospecting.Proof.getAssets(n).developmentOnly).to.equal(true);
    }
    expect(() => Prospecting.Proof.getAssets(11)).to.throw();
    const first = Prospecting.Proof.getAssets(1);
    const last = Prospecting.Proof.getAssets(10);
    expect(first.maxSamples).to.equal(10);
    expect(first.zkey).to.deep.equal(last.zkey);
    expect(first.vk).to.deep.equal(last.vk);
  });
  it('requires an explicit expected sample index on commitment calls', function () {
    const call = Prospecting.Contracts.getCommitCall({ address: '0x1', campaignId: 7, lot: 14, index: 2, commitment: '123' });
    expect(call.entrypoint).to.equal('commit_checked');
    expect(call.contractAddress).to.equal('0x1');
    expect(call.calldata).to.deep.equal(['7', '14', '2', '123', '0']);
    expect(() => Prospecting.Contracts.getCommitCall({ address: '0x1', campaignId: 7, lot: 14, commitment: '123' })).to.throw();
  });
  it('encodes real Groth16 hints exactly once and builds ABI-decodable finalization calldata', async function () {
    const f = fixtures[4]; const input = f.input;
    const record = {
      ...Prospecting.createRecord({
        mode: 'local-simulation',
        context: input.context,
        identity: { chainId: '0x1', game: '0x2', owner: '0x3', asteroidId: 1, originIndex: Number(input.origin), resource: 1 }
      }),
      claimIndex: Number(input.selected),
      actions: input.methods.map((method, i) => ({
        action: { method: Number(method), target: Number(input.targets[i]), source: Number(input.sources[i]), depth: Number(input.depths[i]), salt: String(input.salts[i]) },
        meta: String(input.meta[i]),
        mask: String(input.blockedApproaches[i]),
        randomness: String(input.randomness[i])
      }))
    };
    const proofCalldata = await Prospecting.Proof.getVerifierCalldata({ record, proof: f.proof, publicSignals: f.publicSignals });
    expect(proofCalldata.length).to.equal(1935);
    const call = Prospecting.Contracts.getFinalizeCall({ address: '0x1', campaignId: 7, ...f.result, proofCalldata });
    expect(call.entrypoint).to.equal('finalize');
    expect(call.calldata).to.have.length(1940);
    expect(call.calldata.slice(0, 5)).to.deep.equal(['7', String(f.result.lot), String(f.result.quantity), String(f.result.rate), '1935']);
    expect(() => Prospecting.Proof.assertProofStatement(Prospecting.getProofPacket(record), ['1'])).to.throw();
  });
});
