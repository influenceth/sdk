import { GRAVITATIONAL_CONSTANT, elements, angles } from '@influenceth/astro';
import { ADALIA_GAUSSIAN_CONSTANT, ADALIA_MASS } from '../constants.js';

export const KM_PER_AU = 1.495978707e8;
export const GM_ADALIA = GRAVITATIONAL_CONSTANT * ADALIA_MASS;

/**
 * Class that defines an orbit and provides convenience conversion methods
 */
class KeplerianOrbit {
  constructor (el) {
    this.a = el.a; // Semi-major axis
    this.e = el.e; // Eccentricity
    this.i = el.i; // Inclination
    this.o = el.o; // Longitude of ascending node
    this.w = el.w; // Argument of periapsis
    this.m = el.m; // Mean anomaly at epoch
  }

  /**
   * Returns KeplerianOrbit for the orbital defined by a given position and velocity
   *
   * @param {Array.<number>} r Position vector (km)
   * @param {Array.<number>} v Velocity vector (km / s)
   * @returns {KeplerianOrbit}
   */
  static fromStateVectors(r, v) {
    const mu = GM_ADALIA / (1000 ** 3);
    const { p, ecc: e, inc: i, raan: o, argp: w, nu } = elements.rv2coe(mu, r, v);

    // Semi-latus rectum of parameter (km) --> Semi-major axis (AU)
    let a = p / (1 - e ** 2) / KM_PER_AU;

    // True Anomaly --> Mean anomaly
    let m = e < 1 ? angles.E_to_M(angles.nu_to_E(nu, e), e) : angles.F_to_M(angles.nu_to_F(nu, e), e);

    return new KeplerianOrbit({ a, e, i, o, w, m });
  }

  /**
    * The distance in AU from center of the ellipse to the object
    * @param nu True anomaly / angular parameter (in radians)
    */
  getRadius (nu) {
    const { a, e } = this;
    return a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(nu));
  }

  /**
   * Returns Cartesian coordinates at a specific angular parameter
   * @param nu True anomaly / angular parmeter (in radians)
   */
  getPosByAngle (nu) {
    const { i, o, w } = this;

    // Distance to the point from the orbit focus.
    const r = this.getRadius(nu);

    // Cartesian transformation
    return {
      x: r * (Math.cos(o) * Math.cos(nu + w) - Math.sin(o) * Math.sin(nu + w) * Math.cos(i)),
      y: r * (Math.sin(o) * Math.cos(nu + w) + Math.cos(o) * Math.sin(nu + w) * Math.cos(i)),
      z: r * (Math.sin(nu + w) * Math.sin(i))
    };
  }

  /**
   * Returns an numPoints sized array of uniformly (in radians) separated points along the orbit path
   * @param numPoints Number of points to create along an orbit
   */
  getSmoothOrbit (numPoints) {
    const points = [];
    const delta = 2 * Math.PI / numPoints;
    let angle = 0;

    for (let i = 0; i < numPoints; i++) {
      points.push(this.getPosByAngle(angle));
      angle += delta;
    }

    return points;
  }

  /**
   * Retrieves the orbital period in days
   */
  getPeriod () {
    const { a } = this;
    return 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / GM_ADALIA);
  }

  /**
   * Retrieves Cartesian coordinates in AU at a specified elapsed time
   * @param elapsed Time in days (in-game) since game START_TIMESTAMP
   */
  getPositionAtTime (elapsed) {
    const { a, e, m } = this;

    // Calculate mean motion based on assumption that mass of orbiter <<< attractor
    const n = ADALIA_GAUSSIAN_CONSTANT / Math.sqrt(Math.pow(a, 3)); // Mean motion

    // Calculate the mean anomaly at elapsed time and derive true anomaly
    const M = m + (n * elapsed);
    const nu = e < 1 ? angles.M_to_nu(M, e) : angles.F_to_nu(M, e);

    // Get position based on true anomaly
    return this.getPosByAngle(nu);
  }

  getTrueAnomalyAtPos (pos) {
    const { e, i, o, w } = this;

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

export default KeplerianOrbit;
