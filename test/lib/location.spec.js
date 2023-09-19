import { expect } from 'chai';
import entity from '../../src/lib/entity.js';
import location from '../../src/lib/location.js';

describe('Location library', function () {
  it('should format from entity', function () {
    expect(location.fromEntityFormat({ id: 123, label: entity.IDS.ASTEROID })).to.deep.equal({ asteroidId: 123 });
  });

  it('should format to entity', function () {
    expect(location.toEntityFormat({ asteroidId: 123 })).to.deep.equal({ id: 123, label: entity.IDS.ASTEROID });
  });

  it('should format lot correctly', function () {
    const expected = { id: 6881662889623553, label: entity.IDS.LOT };
    expect(location.toEntityFormat({ asteroidId: 1, lotId: 1602262 })).to.deep.equal(expected);
  });
});
