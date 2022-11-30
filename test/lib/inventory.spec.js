import { expect } from 'chai';
import inventory from '../../src/lib/inventory.js';

describe('Inventory library', function () {
  it('should get resource details and totals with two arrays', function () {
    const { resources, totals } = inventory.getContents([ 3, 6, 8 ], [ 34523, 45642, 6743 ]);
    expect(resources[3].mass.toFixed(3)).to.equal('34.523');
    expect(resources[3].volume.toFixed(3)).to.equal('5523.680');

    expect(resources[6].mass.toFixed(3)).to.equal('45.642');
    expect(resources[6].volume.toFixed(3)).to.equal('30123.720');

    expect(resources[8].mass.toFixed(3)).to.equal('6.743');
    expect(resources[8].volume.toFixed(3)).to.equal('18880.400');

    expect(totals.mass.toFixed(3)).to.equal('86.908');
    expect(totals.volume.toFixed(3)).to.equal('54527.800');
  });

  it('should get resource details and totals with one object', function () {
    const { resources, totals } = inventory.getContents({ 3: 34523, 6: 45642, 8: 6743 });
    expect(resources[3].mass.toFixed(3)).to.equal('34.523');
    expect(resources[3].volume.toFixed(3)).to.equal('5523.680');

    expect(resources[6].mass.toFixed(3)).to.equal('45.642');
    expect(resources[6].volume.toFixed(3)).to.equal('30123.720');

    expect(resources[8].mass.toFixed(3)).to.equal('6.743');
    expect(resources[8].volume.toFixed(3)).to.equal('18880.400');

    expect(totals.mass.toFixed(3)).to.equal('86.908');
    expect(totals.volume.toFixed(3)).to.equal('54527.800');
  });
});
