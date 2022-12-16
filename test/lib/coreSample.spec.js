import { expect } from 'chai';
import CoreSample from '../../src/lib/coreSample.js';

describe('CoreSample library', function () {
  it('should get the lower and upper bounds for a sample', function () {
    const { lower, upper } = CoreSample.getSampleBounds(0.15, 0);
    expect(lower).to.equal(0);
    expect(upper).to.equal(1500);
  });

  it('should get the lower and upper bounds for a sample with penalty', function () {
    const { lower, upper } = CoreSample.getSampleBounds(0.15, 1000, 0.75);
    expect(lower).to.equal(1000);
    expect(upper).to.equal(1375);
  });

  it('should get the lower and upper bounds for a sample with bonus', function () {
    const { lower, upper } = CoreSample.getSampleBounds(0.15, 1000, 1.5);
    expect(lower.toFixed(2)).to.equal('1166.67');
    expect(upper).to.equal(1500);
  });

  it('should get the core sample time with a bonus', async function () {
    const time = CoreSample.getSampleTime(1.3);
    expect(time).to.equal(2770);
  });
});

