import { expect } from 'chai';
import astro from '../../src/utils/astro.js';
import KeplerianOrbit from '../../src/utils/KeplerianOrbit.js';

describe.only('Orbital library', function () {
  it('should calculate eccentric anomaly from mean anomaly', function () {
    expect(astro.M_to_E(1, 0.5).toFixed(7)).to.equal('1.4987011');
    expect(astro.M_to_E(2, 0.25).toFixed(7)).to.equal('2.2018514');
    expect(astro.M_to_E(3, 0.125).toFixed(7)).to.equal('3.0156956');
    expect(astro.M_to_E(4, 0.9).toFixed(7)).to.equal('3.6009583');
    expect(astro.M_to_E(5, 0.99).toFixed(7)).to.equal('4.1581841');
    expect(astro.M_to_E(-4, 0.5).toFixed(7)).to.equal('-3.7246928');
  });

  it('should calculate true eccentric anomaly from mean anomaly', function () {
    expect(astro.M_to_F(1, 1.1).toFixed(7)).to.equal('1.5928117');
    expect(astro.M_to_F(2, 1.5).toFixed(7)).to.equal('1.6126858');
    expect(astro.M_to_F(3, 2.0).toFixed(7)).to.equal('1.5628462');
    expect(astro.M_to_F(4, 5.0).toFixed(7)).to.equal('0.8616757');
    expect(astro.M_to_F(-4, 5.0).toFixed(7)).to.equal('-0.8616757');
  });

  it('should calculate true anomaly from eccentric anomaly', function () {
    expect(astro.E_to_nu(-4, 0.125).toFixed(7)).to.equal('2.3743532');
    expect(astro.E_to_nu(-2, 0.5).toFixed(7)).to.equal('-2.4315800');
    expect(astro.E_to_nu(0, 0.75).toFixed(7)).to.equal('0.0000000');
    expect(astro.E_to_nu(2, 0.9).toFixed(7)).to.equal('2.8490840');
    expect(astro.E_to_nu(4, 0.99).toFixed(7)).to.equal('-3.0767304');
  });

  it('should calculate true anomaly from hyperbolic eccentric anomaly', function () {
    expect(astro.F_to_nu(-5, 1.125).toFixed(7)).to.equal('-2.6594996');
    expect(astro.F_to_nu(-3, 1.5).toFixed(7)).to.equal('-2.2237955');
    expect(astro.F_to_nu(-1, 2.75).toFixed(7)).to.equal('-1.1895181');
    expect(astro.F_to_nu(1, 2.9).toFixed(7)).to.equal('1.1696349');
    expect(astro.F_to_nu(3, 3.99).toFixed(7)).to.equal('1.7265870');
  });

  it('should calculate true anomaly from mean anomaly', function () {
    // Elliptical
    expect(astro.M_to_nu(0.9480628496833199, 0.325).toFixed(7)).to.equal('1.5891713');
    expect(astro.M_to_nu(2.042558823608964, 0.05).toFixed(7)).to.equal('2.1290652');
    expect(astro.M_to_nu(27, 0.5).toFixed(7)).to.equal('2.6063312');

    // Hyperbolic
    expect(astro.M_to_nu(27, 2.5).toFixed(7)).to.equal('1.9053011');
    expect(astro.M_to_nu(-14, 5.5).toFixed(7)).to.equal('-1.4133834');
  });

  it('should generate classical elements from state vectors', function () {
    const k = 398600.44180000003;
    const r = [ 6.52536812e3,  6.86153183e3,  6.44911861e3];
    const v = [ 4.90227865e0,  5.53313957e0, -1.97571010e0];

    const { p, ecc, inc, raan, argp, nu } = astro.stateToClassic(k, r, v);
    expect(p.toFixed(3)).to.equal((11067.790).toFixed(3));
    expect(ecc.toFixed(7)).to.equal((0.83285).toFixed(7));
    expect(inc.toFixed(7)).to.equal((1.5336208137274174).toFixed(7));
    expect(raan.toFixed(7)).to.equal((3.9774308323698775).toFixed(7));
    expect(argp.toFixed(7)).to.equal((0.9316567547145732).toFixed(7));
    expect(nu.toFixed(7)).to.equal((1.611549764828964).toFixed(7));
  });

  it('should generate classical elements from state vectors for hyperbolic orbits', function () {
    const k = 3.9860047e14;
    const r = [ -8173532.704990985, -16011738.121722244, -202722.41788328032 ];
    const v = [ 6580.954362290776, -4052.9254479420347, -948.6406516239671 ];
    const { p, ecc, inc, raan, argp, nu } = astro.stateToClassic(k, r, v);
    expect(p.toFixed(3)).to.equal((48848563.341).toFixed(3));
    expect(ecc.toFixed(7)).to.equal((1.7311).toFixed(7));
    expect(inc.toFixed(7)).to.equal((0.122138).toFixed(7));
    expect(raan.toFixed(7)).to.equal((1.00681).toFixed(7));
    expect(argp.toFixed(7)).to.equal((3.10686).toFixed(7));
    expect(nu.toFixed(7)).to.equal((0.12741601769795755).toFixed(7));
  });

  it('should generate state vectors from classical elements', function () {
    const k = 398600.44180000003;
    const el = [ 11067.79, 0.83285, 1.5336208137274174, 3.9774308323698775, 0.9316567547145732, 1.611549764828964 ];
    const [ r, v ] = astro.classicToState(k, ...el);
    expect(r[0].toFixed(5)).to.equal((6.52536812e3).toFixed(5));
    expect(r[1].toFixed(5)).to.equal((6.86153183e3).toFixed(5));
    expect(r[2].toFixed(5)).to.equal((6.44911861e3).toFixed(5));
    expect(v[0].toFixed(5)).to.equal((4.90227865e0).toFixed(5));
    expect(v[1].toFixed(5)).to.equal((5.53313957e0).toFixed(5));
    expect(v[2].toFixed(5)).to.equal((-1.97571010e0).toFixed(5));
  });

  it('should generate state vectors from classical elements for hyperbolic orbits', function () {
    const k = 3.9860047e14;
    const el = [ 4.884856334147761e7, 1.7311, 0.122138, 1.00681, 3.10686, 0.12741601769795755 ];
    const [ r, v ] = astro.classicToState(k, ...el);
    expect(r[0].toFixed(5)).to.equal((-8173532.70499).toFixed(5));
    expect(r[1].toFixed(5)).to.equal((-16011738.12172).toFixed(5));
    expect(r[2].toFixed(5)).to.equal((-202722.41788).toFixed(5));
    expect(v[0].toFixed(5)).to.equal((6580.95436).toFixed(5));
    expect(v[1].toFixed(5)).to.equal((-4052.92545).toFixed(5));
    expect(v[2].toFixed(5)).to.equal((-948.64065).toFixed(5));
  });

  // TODO: add parabolic tests for state <-> classical
});
