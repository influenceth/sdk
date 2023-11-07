import { expect } from 'chai';

import lot from '../../src/lib/lot.js';

describe('Lot library', function () {
  it('toId should generate id from asteroidId and lotIndex', function () {
    expect(lot.toId(1, 2)).to.equal(8589934593);
  });

  it('toId should fail with null', function () {
    expect(lot.toId(1, 0)).to.equal(null);
  });

  it('toIndex should generate lotIndex from lotId', function () {
    expect(lot.toIndex(8589934593)).to.equal(2);
    expect(lot.toIndex(6939301350735873)).to.equal(1615682);
  });

  it('toIndex should fail with -1', function () {
    expect(lot.toIndex(0)).to.equal(-1);
  });

  it('toPosition should generate asteroidId and lotIndex from lotId', function () {
    expect(lot.toPosition(8589934593)).to.deep.equal({ asteroidId: 1, lotIndex: 2 });
    expect(lot.toPosition(6939301350735873)).to.deep.equal({ asteroidId: 1, lotIndex: 1615682 });
  });

  it('toPosition should fail with null', function () {
    expect(lot.toPosition(0)).to.equal(null);
  });
});