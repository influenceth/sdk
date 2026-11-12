import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import Prospecting from '../../src/lib/prospecting.js';
const fixtures = JSON.parse(readFileSync(new URL('../fixtures/prospecting/campaigns.json', import.meta.url)));
const identity = (input) => ({ chainId: '0x1', game: '0x2', owner: '0x3', asteroidId: 1, originIndex: Number(input.origin), resource: 1 });
const recordFor = ({ input }) => ({
  ...Prospecting.createRecord({ identity: identity(input), context: input.context, mode: 'local-simulation' }),
  actions: input.methods.map((method, i) => ({
    action: {
      method: Number(method),
      target: Number(input.targets[i]),
      source: Number(input.sources[i]),
      depth: Number(input.depths[i]),
      salt: String(input.salts[i])
    },
    meta: String(input.meta[i]),
    mask: String(input.blockedApproaches[i]),
    randomness: String(input.randomness[i])
  })),
  claimIndex: Number(input.selected)
});

describe('Prospecting SDK', function () {
  for (const fixture of fixtures) {
    it(`replays the real ${fixture.n}-sample browser proof statement exactly`, function () {
      const record = recordFor(fixture); const packet = Prospecting.getProofPacket(record);
      expect(packet.expectedPublicSignals).to.deep.equal(fixture.publicSignals);
      expect(packet.input.count).to.equal(String(fixture.n));
      expect(packet.input.commitments.slice(0, fixture.n)).to.deep.equal(fixture.input.commitments.map(String));
      for (const key of ['meta', 'blockedApproaches', 'commitments', 'randomness', 'methods', 'targets', 'sources', 'depths', 'salts']) {
        expect(packet.input[key]).to.have.length(10);
        expect(packet.input[key].slice(fixture.n).every(value => value === '0')).to.equal(true);
      }
      const result = Prospecting.replayCampaign(record).finalized;
      expect(result.quantity).to.equal(fixture.result.quantity);
      expect(result.rate).to.equal(fixture.result.rate);
      expect(packet.sampleCount).to.equal(fixture.n);
    });
  }
  it('rejects tampering, unsupported versions, overflow and account substitution', function () {
    const record = recordFor(fixtures[4]);
    expect(() => Prospecting.getProofPacket({ ...record, rules: 6 })).to.throw();
    expect(() => Prospecting.getProofPacket({ ...record, quantityMultiplierBps: 10000 })).to.throw();
    expect(() => Prospecting.replayCampaign(record, { ...record.identity, owner: '0x99' })).to.throw();
    expect(() => Prospecting.packMeta({ lot: 1, x: 2 ** 20, z: 1, abundance: 1 })).to.throw();
    expect(() => Prospecting.unpackMeta(1n << 81n)).to.throw();
    const actions = record.actions.map((entry) => ({ ...entry }));
    actions[0].mask = '1';
    expect(() => Prospecting.replayCampaign({ ...record, actions })).to.throw();
    actions[0] = { ...record.actions[0], commitment: '1' };
    expect(() => Prospecting.replayCampaign({ ...record, actions })).to.throw('commitment');
  });
  it('isolates origin exclusivity from resource and account, but scopes private records by both', function () {
    const one = identity(fixtures[0].input); const two = { ...one, resource: 2, owner: '0x99' };
    expect(Prospecting.getOriginKey(one)).to.equal(Prospecting.getOriginKey(two));
    expect(Prospecting.getScopeKey(one)).not.to.equal(Prospecting.getScopeKey(two));
  });
  it('persists chain intents without entropy, reconciles receipts and preserves action salts on retry', function () {
    const { input } = fixtures[0];
    let record = Prospecting.createRecord({ identity: identity(input), context: input.context, campaignId: 7 });
    const action = { method: 0, target: 0, source: 0, depth: 0, salt: input.salts[0] };
    record = Prospecting.prepareSample(record, { action, meta: input.meta[0], blockedApproaches: '0', preparedAt: 100 });
    const commitment = record.pending.commitment;
    const acceptedWithoutHash = Prospecting.acceptSample(record, { commitment, meta: input.meta[0], blockedApproaches: '0', target: 102, ready: 500 });
    expect(Prospecting.replayCampaign(acceptedWithoutHash).pending.stage).to.equal('accepted');
    expect(Prospecting.replayCampaign(JSON.parse(JSON.stringify(record))).history).to.have.length(0);
    expect(() => Prospecting.getProofPacket(record)).to.throw();
    record = Prospecting.markSubmitted(record, '0x123');
    expect(() => Prospecting.retryRejectedSample(record, { transactionHash: '0x123', executionStatus: 'UNKNOWN' })).to.throw();
    record = Prospecting.retryRejectedSample(record, { transactionHash: '0x123', executionStatus: 'REVERTED' });
    expect(record.pending.commitment).to.equal(commitment);
    record = Prospecting.markSubmitted(record, '0x124');
    const core = { commitment, meta: input.meta[0], blockedApproaches: '0', target: 102, ready: 500 };
    expect(() => Prospecting.acceptSample(record, { ...core, meta: BigInt(core.meta) + 1n })).to.throw();
    record = Prospecting.acceptSample(record, core);
    expect(() => Prospecting.resolveSample(record, input.randomness[0], { now: 500, blockNumber: 111 })).to.throw();
    record = Prospecting.resolveSample(record, input.randomness[0], { now: 500, blockNumber: 112 });
    expect(record.pending).to.equal(null);
    expect(record.actions).to.have.length(1);
    record = Prospecting.finalizeRecord(record, 0);
    expect(Prospecting.getProofPacket(record).expectedPublicSignals).to.deep.equal(fixtures[0].publicSignals);
    const campaign = {
      id: '7',
      context: record.context,
      owner: record.identity.owner,
      origin: record.identity.originIndex,
      resource: 1,
      count: 0,
      pending: true,
      closed: false
    };
    expect(Prospecting.assertChainTranscript(record, campaign, [{ ...core, random: 0 }], { pendingRandomness: input.randomness[0] }).sampleCount).to.equal(1);
    expect(() => Prospecting.assertChainTranscript(record, campaign, [{ ...core, random: 0 }])).to.throw();
  });
  it('uses real-time inactivity, lazy replacement and RUNNING slots regardless of collection time', function () {
    const schedule = Prospecting.getSampleSchedule({ now: 100, crewReadyAt: 200, commitBlock: 300, outboundSeconds: 10, timeAcceleration: 24 });
    expect(schedule.readyAt).to.equal(3810);
    expect(schedule.crewReadyAt).to.equal(3820);
    expect(schedule.replaceableAt).to.equal(90210);
    expect(schedule.randomnessAvailableBlock).to.equal('312');
    const stored = { id: 1, count: 0, pending: true, closed: false };
    expect(Prospecting.getCampaignReadiness({ campaign: stored, pendingCore: { ready: 3810, target: 302 }, now: 3810, blockNumber: 312 }).status).to.equal('ACTIVE_READY');
    const campaign = { id: 1, status: 'ACTIVE_READY', sampleCount: 1, replaceableAt: 90210 };
    expect(Prospecting.canReplace(campaign, 90209)).to.equal(false);
    expect(Prospecting.canReplace(campaign, 90210)).to.equal(true);
    expect(Prospecting.getFinalizeDisabledReason({ campaign, activeCampaignId: 1, productiveSection: true })).to.equal(null);
    expect(Prospecting.getFinalizeDisabledReason({ campaign, activeCampaignId: 2, productiveSection: true })).to.include('replaced');
    expect(Prospecting.getSampleDisabledReason({
      campaign,
      activeCampaignId: 1,
      hasOriginPermission: true,
      crewReady: true,
      availableDrills: 1,
      extractors: [{ status: 0 }, { status: 1, finishTime: 0 }]
    })).to.include('Extraction');
  });
  it('preserves the quantity/rate separation and exposes conditional measurement odds', function () {
    const state = Prospecting.replayCampaign(recordFor(fixtures[4]));
    const cell = state.cells[Number(fixtures[4].input.selected)];
    const width = Prospecting.getMeasurementOutcomes(cell, Prospecting.METHODS.CROSS_CUT);
    const hardness = Prospecting.getMeasurementOutcomes(cell, Prospecting.METHODS.CHARACTERIZE);
    expect(width.reduce((sum, row) => sum + row.chancePercent, 0)).to.equal(100);
    expect(hardness.reduce((sum, row) => sum + row.chancePercent, 0)).to.equal(100);
    expect(Prospecting.ACCIDENTS.stuck).to.equal(5);
    expect(Prospecting.getFollowOreChance({ meta: { lot: 14, x: 500000, z: 500000, abundance: 600000 }, depth: 0 })).to.be.closeTo(0.418, 1e-12);
  });
});
