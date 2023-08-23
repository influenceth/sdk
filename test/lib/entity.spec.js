import { expect } from 'chai';
import entity from '../../src/lib/entity.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Entity library', function () {
  checkIdsAndTypes(entity.IDS, entity.TYPES);

  it('should pack entity', function () {
    expect(entity.packEntity({ id: 123, label: entity.IDS.ASTEROID })).to.equal(8060931n);
    expect(entity.packEntity({ id: 1234567890, label: entity.IDS.LOT })).to.equal(80908641239044n);
    expect(entity.packEntity({ id: 137438953471, label: entity.IDS.DEPOSIT })).to.equal(9007199254675463n);
  });

  it('should unpack entity', function () {
    expect(entity.unpackEntity(8060931n)).to.deep.equal({ id: 123, label: entity.IDS.ASTEROID });
    expect(entity.unpackEntity(80908641239044n)).to.deep.equal({ id: 1234567890, label: entity.IDS.LOT });
    expect(entity.unpackEntity(9007199254675463n)).to.deep.equal({ id: 137438953471, label: entity.IDS.DEPOSIT });
  });
});
