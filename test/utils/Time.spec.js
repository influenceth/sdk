import { expect } from 'chai';
import Time from '../../src/utils/Time.js';

describe('Time', function () {

  it('should get time from game clock adays', function () {
    let t = Time.fromGameClockADays(10000);
    expect(t.unixTimeMS).to.equal(1654668000e3);

    t = Time.fromGameClockADays(0);
    expect(t.unixTimeMS).to.equal(Time.CLOCK_ZERO_TIMESTAMP * 1000);
  });

  it('should get time from orbit adays', function () {
    let t = Time.fromOrbitADays(10000);
    expect(t.unixTimeMS).to.equal(1645459200e3);

    t = Time.fromOrbitADays(0);
    expect(t.unixTimeMS).to.equal(Time.ORBIT_ZERO_TIMESTAMP * 1000);
  });

  it('should get time from unix time', function () {
    let t = Time.fromUnixTime(1654668000e3);
    expect(t.unixTimeMS).to.equal(1654668000e3);
  });

  it('should get time from unix time (if given in sec)', function () {
    let t = Time.fromUnixTime(1654668000, false);
    expect(t.unixTimeMS).to.equal(1654668000e3);
  });

  it('should convert to game clock adays', function () {
    let t = Time.fromUnixTime(1654668000e3);
    expect(t.toGameClockADays()).to.equal(10000);
  });

  it('should convert to game clock adays (formatted)', function () {
    let t = Time.fromUnixTime(1654668000e3);
    expect(t.toGameClockADays(true)).to.equal('10,000.00');
  });

  it('should convert to orbit adays', function () {
    let t = Time.fromUnixTime(1654668000e3);
    expect(t.toOrbitADays()).to.equal(12558);
  });

  it('should convert to date', function () {
    let t = Time.fromUnixTime(1654668000e3);
    expect(t.toDate().toISOString()).to.equal('2022-06-08T06:00:00.000Z');
  });

  it('should handle identities', function () {
    expect(Time.fromGameClockADays(10000).toGameClockADays()).to.equal(10000);
    expect(Time.fromOrbitADays(10000).toOrbitADays()).to.equal(10000);
    expect(Time.fromUnixTime(1700000000e3).toDate().getTime()).to.equal(1700000000e3);
  });
});