import { expect } from 'chai';
import crewmate from '../../src/lib/crewmate.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Crewmate library', function () {
  checkIdsAndTypes(crewmate.ABILITY_IDS, crewmate.ABILITY_TYPES);

  it('ability types should not reference an invalid class', function () {
    const invalidClass = !!Object.values(crewmate.ABILITY_TYPES).find((a) => a.class && !crewmate.getClass(a.class));
    expect(invalidClass).to.be.false;
  });

  it('ability types should not reference an invalid title', function () {
    const invalidTitle = !!Object.values(crewmate.ABILITY_TYPES).find((a) => 
      !!Object.keys(a.titles || {}).find((t) => !crewmate.getTitle(t))
    );
    expect(invalidTitle).to.be.false;
  });

  it('ability types should not reference an invalid trait', function () {
    const invalidTrait = !!Object.values(crewmate.ABILITY_TYPES).find((a) => 
      !!Object.keys(a.traits || {}).find((t) => !crewmate.getTrait(t))
    );
    expect(invalidTrait).to.be.false;
  });
});