import { expect } from 'chai';
import entity from '../../src/lib/entity.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Entity library', function () {
  before(function () {
    checkIdsAndTypes(entity.IDS, entity.TYPES);
  });

  it('should pack entity', function () {
    expect(entity.packEntity({ id: 123, label: entity.IDS.ASTEROID })).to.equal('0x7b0003');
    expect(entity.packEntity({ id: 123, label: entity.IDS.ASTEROID }, false)).to.equal(8060931n);
    expect(entity.packEntity({ id: 1234567890, label: entity.IDS.LOT })).to.equal('0x499602d20004');
    expect(entity.packEntity({ id: 1234567890, label: entity.IDS.LOT }, false)).to.equal(80908641239044n);
    expect(entity.packEntity({ id: 137438953471, label: entity.IDS.DEPOSIT })).to.equal('0x1fffffffff0007');
    expect(entity.packEntity({ id: 137438953471, label: entity.IDS.DEPOSIT }, false)).to.equal(9007199254675463n);
  });

  it('should unpack entity', function () {
    expect(entity.unpackEntity('0x7b0003')).to.deep.equal({ id: 123, label: entity.IDS.ASTEROID });
    expect(entity.unpackEntity(8060931n)).to.deep.equal({ id: 123, label: entity.IDS.ASTEROID });
    expect(entity.unpackEntity(80908641239044n)).to.deep.equal({ id: 1234567890, label: entity.IDS.LOT });
    expect(entity.unpackEntity(9007199254675463n)).to.deep.equal({ id: 137438953471, label: entity.IDS.DEPOSIT });
  });

  it('should create entity from position', function () {
    const expected = { id: 6881662889623553, label: entity.IDS.LOT };
    expect(entity.fromPosition({ asteroidId: 1, lotIndex: 1602262 })).to.deep.equal(expected);
  });

  it('should create position from entity', function () {
    const expected = { asteroidId: 1, lotIndex: 1602262 };
    expect(entity.toPosition({ id: 6881662889623553, label: entity.IDS.LOT })).to.deep.equal(expected);
  });

  describe('areEqual', function () {
    it('should compare two entities', function () {
      let result;
      result = entity.areEqual(
        { id: 1, label: 1 },
        { id: 1, label: 1 }
      );
      expect(result).to.equal(true);

      result = entity.areEqual(
        { label: 5, id: 1 },
        { id: 1, label: 5 }
      );
      expect(result).to.equal(true);

      result = entity.areEqual(
        { label: 5, id: 1 },
        { id: 2, label: 5 }
      );
      expect(result).to.equal(false);
    });

    it('should compare uuid entities', function () {
      expect(entity.areEqual('1234', '1234')).to.equal(true);
      expect(entity.areEqual('1234', '1235')).to.equal(false);
      expect(entity.areEqual(1234, 1234)).to.equal(true);
      expect(entity.areEqual(1234n, 1234n)).to.equal(true);
    });

    it('should return false if one of the two entities is empty', function () {
      let result;
      result = entity.areEqual({ id: 1, label: 1 }, null);
      expect(result).to.equal(false);

      result = entity.areEqual(null, { id: 1, label: 1 });
      expect(result).to.equal(false);
    });

    it('should throw an error if the values are not valid entities', function () {
      const fn = function () {
        entity.areEqual({ id: 1 }, { label: 5 });
      };
      expect(fn).to.throw('Invalid entities');
    });
  });
});
