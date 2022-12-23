import { expect } from 'chai';
import { snoise, recursiveSNoise } from '../../src/utils/simplex.js';

describe('Simpplex library', function () {
  it('should generate correct values for single octave', function () {
    let noise = snoise([0.0, 0.0, 0.0]);
    expect(Number(noise.toFixed(5))).to.equal(-0.43587);
    noise = snoise([0.5, -1.23, 1.63]);
    expect(Number(noise.toFixed(5))).to.equal(0.72507);
    noise = snoise([-1.94, -1.25, -1.63]);
    expect(Number(noise.toFixed(5))).to.equal(0.15408);
    noise = snoise([-9.99, 8.25, 6.98]);
    expect(Number(noise.toFixed(5))).to.equal(-0.79204);
    noise = snoise([-0.005, 12.578, -2.87]);
    expect(Number(noise.toFixed(5))).to.equal(-0.40012);
  });

  it('should return correct values for multiple octave', function () {
    let noise = recursiveSNoise([0.0, 0.0, 0.0], 0.5, 2);
    expect(Number(noise.toFixed(4))).to.equal(-0.4359);
    noise = recursiveSNoise([0.5, -1.23, 1.63], 0.5, 3);
    expect(Number(noise.toFixed(4))).to.equal(0.3282);
    noise = recursiveSNoise([-1.94, -1.25, -1.63], 0.5, 4);
    expect(Number(noise.toFixed(4))).to.equal(0.1354);
    noise = recursiveSNoise([-9.99, 8.25, 6.98], 0.5, 5);
    expect(Number(noise.toFixed(4))).to.equal(-0.3678);
    noise = recursiveSNoise([-0.005, 12.578, -2.87], 0.5, 6);
    expect(Number(noise.toFixed(4))).to.equal(-0.1822);
  });
});
