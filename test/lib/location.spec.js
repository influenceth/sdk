import { expect } from 'chai';
import entity from '../../src/lib/entity.js';
import location from '../../src/lib/location.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Entity library', function () {
  it('should format from entity', function () {
    expect(location.fromEntityFormat({ id: 123, label: entity.IDS.ASTEROID })).to.deep.equal({ asteroidId: 123 });
  });

  it('should format to entity', function () {
    expect(location.toEntityFormat({ asteroidId: 123 })).to.deep.equal({ id: 123, label: entity.IDS.ASTEROID });
  });
});
