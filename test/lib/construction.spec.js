import { expect } from 'chai';
import construction from '../../src/lib/construction.js';

describe('Construction library', function () {
  it('should get construction time', function () {
    const time = construction.getConstructionTime(1);
    expect(time).to.equal(72000);
  });

  it('should get construction time with bonus', function () {
    const time = construction.getConstructionTime(9, 1.25);
    expect(time).to.equal(483840);
  });
});
