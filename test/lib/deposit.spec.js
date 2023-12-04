import { expect } from 'chai';
import Deposit from '../../src/lib/deposit.js';

describe('CoreSample library', function () {
  it('should get the lower and upper bounds for a sample', function () {
    const { lower, upper } = Deposit.getSampleBounds(0.15, 0);
    expect(lower).to.equal(0);
    expect(upper).to.equal(1500e6);
  });

  it('should get the lower and upper bounds for a sample with penalty', function () {
    const { lower, upper } = Deposit.getSampleBounds(0.15, 1000e6, 0.75);
    expect(lower).to.equal(1000e6);
    expect(upper).to.equal(1375e6);
  });

  it('should get the lower and upper bounds for a sample with bonus', function () {
    const { lower, upper } = Deposit.getSampleBounds(0.15, 1000e6, 1.5);
    expect(Math.round(lower)).to.equal(1166.666667e6);
    expect(upper).to.equal(1500e6);
  });

  it('should get the core sample time', async function () {
    let time = Deposit.getSampleTime();
    expect(time).to.equal(Deposit.SAMPLE_TIME);

    time = Deposit.getSampleTime(1.3);
    expect(time).to.equal(66462);
  });
});

