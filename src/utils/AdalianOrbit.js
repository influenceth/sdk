import { angles, constants, Orbit } from '@influenceth/astro';

import { GM_ADALIA } from '../constants.js';

const MU = GM_ADALIA / (1000 ** 3); // Convert to km^3 / s^2

/**
 * Class that defines an orbit and provides convenience conversion methods
 */
class AdalianOrbit {
  constructor (el = {}, options = { units: 'AU' }) {
    const a = el.a; // Semi-major axis
    const e = el.ecc || el.e; // Eccentricity
    const i = el.inc || el.i; // Inclination
    const o = el.raan || el.o; // Longitude of ascending node
    const w = el.argp || el.w; // Argument of periapsis
    const m = el.m; // Mean anomoly at epoch
    let p = el.p; // Semi-latus rectum
    let nu = el.nu; // True anomaly

    if (!p && a) {
      const units = options.units === 'AU' ? constants.AU / 1000 : 1;
      p = el.a * (1 - e ** 2) * units; // Convert to semi-latus rectum in km
    }

    if (!nu && m) nu = angles.M_to_nu(m, e); // Convert to true anomaly
    this.orbit = Orbit.fromClassicElements(MU, p, e, i, o, w, nu);
  }

  /**
   * Returns AdalianOrbit for the orbital defined by a given position and velocity
   *
   * @param {Array.<number>} r Position vector (m)
   * @param {Array.<number>} v Velocity vector (m / s)
   * @returns {AdalianOrbit}
   */
  static fromStateVectors (r, v) {
    const adalianOrbit = new AdalianOrbit();

    adalianOrbit.orbit = Orbit.fromStateVectors(
      MU,
      r.map((x) => x / 1000), // convert to km for astro
      v.map((x) => x / 1000) // convert to km / s for astro
    );

    return adalianOrbit;
  }

  /**
    * The distance in AU from center of the ellipse to the object
    * @param nu True anomaly / angular parameter (in radians)
    */
  getRadius (nu) {
    return this.orbit.radius * 1000; // Convert km -> m
  }

  /**
   * Returns Cartesian coordinates at a specific angular parameter
   * @param nu True anomaly / angular parmeter (in radians)
   */
  getPosByAngle (nu) {
    const { r } = this.orbit.sampleAtAngle(nu);
    return { x: r[0] * 1000, y: r[1] * 1000, z: r[2] * 1000 }; // Convert km -> m
  }

  /**
   * Returns an numPoints sized array of uniformly (in radians) separated points along the orbit path
   * @param numPoints Number of points to create along an orbit
   */
  getSmoothOrbit (numPoints) {
    const points = this.orbit.ephem(numPoints);
    return points.map((rv) => {
      return { x: rv.r[0] * 1000, y: rv.r[1] * 1000, z: rv.r[2] * 1000 };
    });
  }

  /**
   * Retrieves the orbital period in days
   */
  getPeriod () {
    return this.orbit.period / 86400; // Convert seconds -> days
  }

  /**
   * Retrieves Cartesian coordinates in AU at a specified elapsed time
   * @param elapsed Time in days (in-game) since Time.START_TIMESTAMP
   */
  getPositionAtTime (elapsed) {
    const tof = elapsed * 86400; // Convert days to seconds
    const { r } = this.orbit.sampleAtEpoch(tof);
    return { x: r[0] * 1000, y: r[1] * 1000, z: r[2] * 1000 }; // Convert km -> m
  }

  getTrueAnomalyAtPos (pos) {
    const { ecc: e, inc: i, raan: o, argp: w } = this.orbit;

    // Calculate the argument of latitude (u)
    const u = Math.atan2(pos.z / Math.sin(i), (pos.x * Math.cos(o) + pos.y * Math.sin(o)));

    // Calculate the eccentric anomaly (E) or hyperbolic eccentric anomaly (F) based on the type of orbit
    // then calculate the true anomaly (nu)
    if (e < 1) {
      // Elliptical orbit
      let E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan((u - w) / 2));
      if (u < w) E += 2 * Math.PI; // Correct E for quadrant ambiguity
      return angles.E_to_nu(E, e);
    } else {
      // Hyperbolic orbit
      const F = 2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan((u - w) / 2));
      return angles.F_to_nu(F, e);
    }
  }
};

export default AdalianOrbit;
