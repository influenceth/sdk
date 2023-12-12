import { expect } from 'chai';
import Crew from '../../src/lib/crew.js';

describe('Crew library', function () {
  it('should get bonus based on ability', function () {
    const details = Crew.getAbilityBonus(1, [ { classId: 3 }, { collectionId: 4, classId: 3, traitIds: [ 31 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.3750');
  });

  it('should get bonus based on ability with title', function () {
    const details = Crew.getAbilityBonus(
      1, [{ classId: 3, titleId: 65 }, { collectionId: 4, classId: 3, traitIds: [ 31 ]}]
    );
    expect(details.totalBonus.toFixed(4)).to.equal('1.4063');
  });

  it('should get bonus based on ability with no class affinity', function () {
    const details = Crew.getAbilityBonus(
      3, [{ classId: 3, titleId: 65 }, { collectionId: 4, classId: 3, traitIds: [ 47 ]}]
    );
    expect(details.totalBonus.toFixed(4)).to.equal('1.0750');
  });

  it('should accept entity structure for crewmate attributes', function () {
    let details = Crew.getAbilityBonus(3, [
      { Crewmate: { coll: 4, class: 3, title: 65 } },
      { Crewmate: { coll: 4, class: 3, impactful: [ 47 ] } }
    ]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.0750');

    details = Crew.getAbilityBonus(1, [
      { Crewmate: { coll: 1, class: 3, title: 13, impactful: [ 31 ] } },
      { Crewmate: { coll: 2, class: 3, title: 13, impactful: [ 31 ] } }
    ]);

    expect(details.totalBonus.toFixed(4)).to.equal('1.5156');
  });

  it('should get bonus based on ability with class penalty', function () {
    const details = Crew.getAbilityBonus(1, [ { classId: 1 }, { collectionId: 4, classId: 2, traitIds: [ 31 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('0.5500');
  });

  it('should get current food', function () {
    const accel = 24;
    expect(Crew.getCurrentFoodRatio(0)).to.equal(1);
    expect(Crew.getCurrentFoodRatio(262800 * accel)).to.equal(0.8);
    expect(Crew.getCurrentFoodRatio(657000 * accel)).to.equal(0.5);
    expect(Crew.getCurrentFoodRatio(919800 * accel)).to.equal(0.4);
    expect(Crew.getCurrentFoodRatio(1314000 * accel)).to.equal(0.25);
    expect(Crew.getCurrentFoodRatio(2828000 * accel)).to.equal(0);

    // Test with consumption modifier
    expect(Crew.getCurrentFoodRatio(1314000 * accel, 1.25)).to.equal(0.35);
    expect(Crew.getCurrentFoodRatio(2463749 * accel, 1.25) > 0).to.be.true;
  });

  it('should calculate the food multipler', function () {
    const accel = 24;
    expect(Crew.getFoodMultiplier(100000 * accel)).to.equal(1);
    expect(Crew.getFoodMultiplier(657000 * accel)).to.equal(1);
    expect(Crew.getFoodMultiplier(985500 * accel)).to.equal(0.75);
    expect(Crew.getFoodMultiplier(1314000 * accel)).to.equal(0.5);
    expect(Crew.getFoodMultiplier(1642500 * accel)).to.equal(0.25);
    expect(Crew.getFoodMultiplier(2628000 * accel)).to.equal(0.25);

    // Test with ratio modifier
    expect(Crew.getFoodMultiplier(1314000 * accel, 1, 1.25)).to.equal(0.6);
    expect(Crew.getFoodMultiplier(1642500 * accel, 1, 1.25)).to.equal(0.4);
  });

  it('should return the correct time since fed', function () {
    const accel = 24;
    expect(Math.round(Crew.getTimeSinceFed(0) / accel)).to.equal(1971000);
    expect(Math.round(Crew.getTimeSinceFed(0.25) / accel)).to.equal(1314000);
    expect(Math.round(Crew.getTimeSinceFed(0.4) / accel)).to.equal(919800);
    expect(Math.round(Crew.getTimeSinceFed(0.5) / accel)).to.equal(657000);
    expect(Math.round(Crew.getTimeSinceFed(0.8) / accel)).to.equal(262800);
    expect(Math.round(Crew.getTimeSinceFed(1) / accel)).to.equal(0);

    // Test with consumption modifier
    expect(Math.round(Crew.getTimeSinceFed(0.35, 1.25) / accel)).to.equal(1314000);
    expect(Math.round(Crew.getTimeSinceFed(0, 1.25) / accel)).to.equal(2463750);
  });
});
