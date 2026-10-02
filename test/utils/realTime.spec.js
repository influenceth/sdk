import { expect } from 'chai';
import Time from '../../src/utils/Time.js';
import Asteroid from '../../src/lib/asteroid.js';
import Process from '../../src/lib/process.js';
import Extractor from '../../src/lib/extractor.js';
import Authorization from '../../src/lib/authorization.js';
import Permission from '../../src/lib/permission.js';

// Expectations follow contracts/common/position and systems/production rounding order.
describe('Whole real-time durations', function () {
  it('rounds each 340.208-second leg before summing, yielding 682 rather than 681', function () {
    expect(Time.toRealDuration(8165, 24)).to.be.closeTo(340.208333333, 1e-9);
    expect(Math.ceil(2 * Time.toRealDuration(8165, 24))).to.equal(681);
    expect(2 * Time.toRealDurationCeil(8165, 24)).to.equal(682);
  });

  it('preserves zero and exact boundaries and rounds fractional seconds up', function () {
    expect(Time.toRealDurationCeil(0)).to.equal(0);
    expect(Time.toRealDurationCeil(24)).to.equal(1);
    expect(Time.toRealDurationCeil(24.001)).to.equal(2);
    expect(Time.toRealDurationCeil(23.999)).to.equal(1);
    expect(Time.toRealDurationCeil(240, 240)).to.equal(1);
    expect(() => Time.toRealDurationCeil(24, 0)).to.throw('Invalid time acceleration');
    expect(() => Time.toRealDurationCeil(24, 1.5)).to.throw('Invalid time acceleration');
  });

  it('rounds actual nonfree travel legs individually without applying speed twice', function () {
    const distance = Asteroid.getLotDistance(1, 1602262, 1613996);
    const expected = Math.ceil(distance / (3 * Asteroid.HOPPER_SPEED * 24));
    expect(expected).to.equal(341);
    expect(Asteroid.getLotTravelTimeReal(1, 1602262, 1613996, 3, 1, 24)).to.equal(341);
    expect(Asteroid.getLotTravelTimeReal(1, 1613996, 1602262, 3, 1, 24)).to.equal(341);
    expect(Asteroid.getLotTravelTimeReal(1, 1602262, 1602262)).to.equal(0);
    expect(Asteroid.getLotTravelTimeReal(1, 1602262, 1613996, 2, 2, 24)).to.equal(0);
  });

  it('matches the contract production helper vectors for separate setup and variable phases', function () {
    for (const [recipes, bonus, setup, variable] of [[2, 1, 1000, 2000], [2.5, 1, 1000, 2500], [3, 1, 1000, 3000], [2.5, 1.5, 667, 1667]]) {
      expect(Time.toRealDurationCeil(24000 / bonus, 24)).to.equal(setup);
      expect(Time.toRealDurationCeil(recipes * 24000 / bonus, 24)).to.equal(variable);
    }
  });

  it('rounds setup and processing independently, retaining batch rounding', function () {
    // Water Electrolysis: setup 7200 seconds; recipe 56.16 seconds, not batched.
    expect(Process.getSetupTimeReal(23, 7, 24)).to.equal(43);
    expect(Process.getProcessingTimeReal(23, 0.1, 7, 24)).to.equal(1);
    expect(Math.ceil((7200 + 56.16 * 0.1) / (7 * 24))).to.equal(43); // Incorrect combined rounding loses a second.
    // Fungal Soilbuilding: 2.5 recipes requires three complete batches.
    expect(Process.getProcessingTimeReal(45, 2.5, 1, 24)).to.equal(1296000);
    expect(Process.getProcessingTimeReal(45, 0, 1, 24)).to.equal(0);
  });

  it('rounds extraction independently and crew labor after combining production phases', function () {
    const yieldAmount = 1e6;
    const remaining = 1e8;
    const expected = Math.ceil((Math.sqrt(remaining / 1e10) - Math.sqrt((remaining - yieldAmount) / 1e10)) * 31536000 / (1.5 * 24));
    expect(Extractor.getExtractionTimeReal(yieldAmount, remaining, 1.5, 24)).to.equal(expected);
    expect(Extractor.getExtractionTimeReal(0, remaining, 1.5, 24)).to.equal(0);
    expect(Time.getCrewLaborDuration(43 + 1)).to.equal(6);
    expect(Time.getCrewLaborDuration(8)).to.equal(1);
    expect(Time.getCrewLaborDuration(0)).to.equal(0);
  });

  it('combines integer phases after positioning and refuses a fractional completion estimate', function () {
    const positioning = Math.max(341, 340);
    expect(Time.getProductionCompletionTime(100, 120, positioning + 43 + 1 + 341)).to.equal(846);
    expect(Time.getProductionCompletionTime(120, 100, 682)).to.equal(802);
    expect(() => Time.getProductionCompletionTime(100, 0, 680.416)).to.throw('whole real-time seconds');
  });

  it('rejects lease coverage one second short of individually rounded travel completion', function () {
    const crew = { label: 1, id: 1, Crew: { delegatedTo: '0x1' } };
    const permission = Permission.IDS.RUN_PROCESS;
    const target = {
      label: 5, id: 1, Control: null, PublicPolicies: [], WhitelistAgreements: [],
      WhitelistAccountAgreements: [], ContractAgreements: [],
      PrepaidAgreements: [{ permission, permitted: crew, endTime: 781, noticeTime: 0, noticePeriod: 0 }]
    };
    const duration = 2 * Time.toRealDurationCeil(8165, 24);
    const completion = Time.getProductionCompletionTime(100, 0, duration);
    expect(completion).to.equal(782);
    const auth = Authorization.create({ entities: [crew, target], evaluationTime: 100 });
    expect(auth.canUntil(crew, target, permission, 781).status).to.equal('allowed');
    expect(auth.canUntil(crew, target, permission, completion).status).to.equal('denied');
    target.PrepaidAgreements[0].endTime = 782;
    expect(Authorization.create({ entities: [crew, target], evaluationTime: 100 }).canUntil(crew, target, permission, completion).status).to.equal('allowed');
  });
});
