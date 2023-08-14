import { expect } from 'chai';
import Crew from '../../src/lib/crew.js';

describe('Crew library', function () {
  it('should get bonus based on ability', function () {
    const details = Crew.getAbilityBonus(1, [ { classId: 3 }, { classId: 3, traitIds: [ 31 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.3750');
  });

  it('should get bonus based on ability with title', function () {
    const details = Crew.getAbilityBonus(1, [ { classId: 3, titleId: 65 }, { classId: 3, traitIds: [ 31 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.4375');
  });

  it('should get bonus based on ability with no class affinity', function () {
    const details = Crew.getAbilityBonus(3, [ { classId: 3, titleId: 65 }, { classId: 3, traitIds: [ 47 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.1500');
  });

  it('should get bonus based on ability with class penalty', function () {
    const details = Crew.getAbilityBonus(1, [ { classId: 1 }, { classId: 2, traitIds: [ 31 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('0.5500');
  });

  it ('should accept alternative property names for crewmate attributes', function () {
    const details = Crew.getAbilityBonus(3, [ { class: 3, title: 65 }, { class: 3, impactful: [ 47 ]}]);
    expect(details.totalBonus.toFixed(4)).to.equal('1.1500');
  });
});
