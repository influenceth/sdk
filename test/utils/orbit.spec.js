import { expect } from 'chai';
import KeplerianOrbit from '../../src/utils/KeplerianOrbit.js';

describe.only('Orbital library', function () {
  it('should test', function () {
    const r = [-2.40712148e+08, -5.33205617e+07, -3.08985988e+04];
    const v = [-9.48200182e-03, -2.39904988e+01,  5.65009148e-02];
    const orbit = KeplerianOrbit.fromStateVectors(r, v);
  });
});
