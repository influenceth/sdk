import { expect } from 'chai';
import Crew from '../../src/lib/crew.js';

describe.only('Crew library', function () {
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
    const details = Crew.getAbilityBonus(3, [
      { Crewmate: { collectionId: 4, class: 3, title: 65 } },
      { Crewmate: { collectionId: 4, class: 3, impactful: [ 47 ] } }
    ]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.0750');
  });

  it('should get bonus based on ability with class penalty', function () {
    const details = Crew.getAbilityBonus(1, [ { classId: 1 }, { collectionId: 4, classId: 2, traitIds: [ 31 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('0.5500');
  });

  it('should get current food', function () {
    const accel = 24;
    expect(Crew.getCurrentFood(0)).to.equal(1000);
    expect(Crew.getCurrentFood(262800 * accel)).to.equal(800);
    expect(Crew.getCurrentFood(657000 * accel)).to.equal(500);
    expect(Crew.getCurrentFood(919800 * accel)).to.equal(400);
    expect(Crew.getCurrentFood(1314000 * accel)).to.equal(250);
    expect(Crew.getCurrentFood(2828000 * accel)).to.equal(0);
  });

  it('should calculate the food multipler', function () {
    const accel = 24;
    expect(Crew.getFoodMultiplier(100000 * accel)).to.equal(1);
    expect(Crew.getFoodMultiplier(657000 * accel)).to.equal(1);
    expect(Crew.getFoodMultiplier(985500 * accel)).to.equal(0.75);
    expect(Crew.getFoodMultiplier(1314000 * accel)).to.equal(0.5);
    expect(Crew.getFoodMultiplier(1642500 * accel)).to.equal(0.25);
    expect(Crew.getFoodMultiplier(2628000 * accel)).to.equal(0.25);
  });
});
