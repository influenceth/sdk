import { expect } from 'chai';
import Claim from '../../src/lib/claim.js';
import Mining from '../../src/lib/mining.js';
import Extractor from '../../src/lib/extractor.js';
import Lot from '../../src/lib/lot.js';
const lotId = Lot.toId(1, 14);
const legacy = () => ({
  id: 42,
  label: 7,
  Deposit: { status: 3, resource: 1, initialYield: 1000000, remainingYield: 500000, yieldEff: 1 },
  Location: { location: { label: 4, id: lotId } },
  Control: { controller: { label: 1, id: 9 } },
  PrivateSale: { amount: 100 }
});
describe('Unified claims and mining', function () {
  it('keeps old identities, reserves, ownership and sale data and resolves stable mid-grade parameters', function () {
    const entity = legacy(); const before = JSON.stringify(entity);
    const claim = Claim.fromEntity(entity, { localAbundancePpm: 600000 });
    expect(claim).to.include({ id: 42, kind: 'legacy', rateBps: 12000, initialYield: '1000000', remainingYield: '500000', lotId });
    expect(JSON.stringify(entity)).to.equal(before);
    const options = { mode: 'claim', claim, resource: 1, lotId, quantity: 10000, timeAcceleration: 24 };
    const first = Mining.quote(options); const second = Mining.quote({ ...options, claim: { ...claim, remainingYield: '10000' } });
    expect(first.gameSeconds).to.equal(second.gameSeconds);
    expect(first.remainingYield).to.equal('490000');
    expect(() => Mining.quote({ ...options, lotId: Lot.toId(1, 15) })).to.throw('claim lot');
    expect(() => Mining.quote({ ...options, quantity: 500001 })).to.throw();
  });
  it('matches the single-felt Cairo metadata layout without changing Deposit storage', function () {
    const metadata = { rulesVersion: 1, rateBps: 20000, referenceAbundancePpm: 1000000, campaignId: '18446744073709551615' };
    const word = 83076749736557242056279310246871041n;
    expect(Claim.packMetadata(metadata)).to.equal(word);
    expect(Claim.unpackMetadata(word)).to.deep.equal(metadata);
    expect(Claim.unpackMetadata(0)).to.equal(null);
    expect(() => Claim.unpackMetadata(1n << 116n)).to.throw();
    expect(Claim.fromContractMetadata(Claim.toContractMetadata(metadata))).to.deep.equal(metadata);
  });
  it('resolves explicit proven claims and rejects incomplete/unsupported metadata', function () {
    const entity = {
      ...legacy(),
      ...Claim.getComponents({
        quantity: 3000000,
        rateBps: 9000,
        resource: 1,
        referenceAbundancePpm: 600000,
        campaignId: 4
      })
    };
    const claim = Claim.fromEntity(entity);
    expect(claim).to.include({ kind: 'prospected', rateBps: 9000, remainingYield: '3000000', campaignId: '4' });
    expect(() => Claim.fromEntity({ ...entity, Claim: {} })).to.throw();
    expect(() => Claim.fromEntity({ ...entity, Claim: { ...entity.Claim, rulesVersion: 2 } })).to.throw();
    expect(() => Claim.fromEntity({ ...legacy(), Deposit: { ...legacy().Deposit, remainingYield: 1000001 } }, { localAbundancePpm: 600000 })).to.throw();
  });
  it('applies the global baseline cutoff inclusively and keeps all positive trace claims usable', function () {
    expect(Mining.canBaselineMine(49999)).to.equal(false);
    expect(Mining.canBaselineMine(50000)).to.equal(true);
    expect(Mining.getGlobalAbundancePpm(50n, 1)).to.equal(50000);
    expect(Mining.getGlobalAbundancePpm(50n << 128n, 12)).to.equal(50000);
    const options = { mode: 'baseline', resource: 1, globalAbundancePpm: 50000, localAbundancePpm: 600000, quantity: 1000 };
    expect(Mining.quote(options).remainingYield).to.equal(null);
    expect(Mining.quote(options).rateBps).to.equal(2500);
    expect(() => Mining.quote({ ...options, globalAbundancePpm: 49999 })).to.throw('requires a claim');
    const claim = Claim.fromEntity(legacy(), { localAbundancePpm: 10000 });
    expect(Mining.quote({ ...options, mode: 'claim', claim, lotId, globalAbundancePpm: 1 }).quantity).to.equal(1000);
    expect(Mining.isSamplingBlocked([{ status: Extractor.STATUSES.RUNNING, finishTime: 0 }])).to.equal(true);
  });
  it('preserves running-job quotes, including finished jobs awaiting collection', function () {
    const job = { status: 1, outputProduct: 1, yield: 1000, destination: { label: 5, id: 8 }, destinationSlot: 2, finishTime: 500 };
    const before = JSON.stringify(job);
    expect(Mining.getRunningJob(job, 400)).to.include({ quantity: '1000', finishTime: 500, readyToCollect: false });
    expect(Mining.getRunningJob(job, 500).readyToCollect).to.equal(true);
    expect(Mining.isSamplingBlocked([job])).to.equal(true);
    expect(JSON.stringify(job)).to.equal(before);
  });
  it('conservatively rounds jobs, applies bonuses once and respects quantity/time caps', function () {
    const options = { mode: 'baseline', resource: 1, globalAbundancePpm: 600000, localAbundancePpm: 600000, quantity: 1000, timeAcceleration: 24 };
    const whole = Mining.quote(options); const part = Mining.quote({ ...options, quantity: 500 });
    expect(part.gameSeconds * 2).to.be.at.least(whole.gameSeconds);
    const faster = Mining.quote({ ...options, bonusBps: 20000 });
    expect(faster.rateNano).to.equal(whole.rateNano * 2n);
    expect(Mining.quote({ ...options, bonusFixed64: 2n << 32n }).rateNano).to.equal(faster.rateNano);
    expect(() => Mining.quote({ ...options, bonusFixed64: 1n << 32n, bonusBps: 10000 })).to.throw('once');
    expect(faster.gameSeconds).to.be.at.most(whole.gameSeconds);
    const max = Mining.getMaxQuantity(options);
    expect(max).to.equal(10000000);
    expect(Mining.quote({ ...options, quantity: max }).gameSeconds).to.be.greaterThan(31536000);
    expect(() => Mining.quote({ ...options, quantity: max + 1 })).to.throw();
    const limited = { ...options, maxGameSeconds: 31536000 };
    expect(Mining.quote({ ...limited, quantity: Mining.getMaxQuantity(limited) }).gameSeconds).to.be.at.most(31536000);
    expect(() => Mining.quote({ ...options, quantity: 1.5 })).to.throw();
    expect(() => Mining.quote({ ...options, bonusBps: 0 })).to.throw();
  });
});
