import astro from './astro.js';
import { ADALIA_GAUSSIAN_CONSTANT, ADALIA_MASS } from '../constants.js';

const KM_PER_AU = 1.495978707e8;
const GM_ADALIA = astro.GRAVITATIONAL_CONSTANT * ADALIA_MASS;

/**
 * Class that defines an orbit and provides convenience conversion methods
 */
class KeplerianOrbit {
  constructor (elements) {
    this.a = elements.a; // Semi-major axis
    this.e = elements.e; // Eccentricity
    this.i = elements.i; // Inclination
    this.o = elements.o; // Longitude of ascending node
    this.w = elements.w; // Argument of periapsis
    this.m = elements.m; // Mean anomaly at epoch
  }

  /**
   * Returns KeplerianOrbit for the orbital defined by a given position and velocity
   *
   * @param {Array.<number>} r Position vector (km)
   * @param {Array.<number>} v Velocity vector (km / s)
   * @returns {KeplerianOrbit}
   */
  static fromStateVectors(r, v) {
    const { p, ecc: e, inc: i, raan: o, argp: w, nu } = astro.stateToClassic(GM_ADALIA, r, v);

    // Semi-latus rectum of parameter (km) --> Semi-major axis (AU)
    let a = p / (1 - e ** 2) / KM_PER_AU;

    // True Anomaly --> Mean anomaly
    let m = e < 1 ? astro.E_to_M(nu_to_E(nu, e), e) : astro.F_to_M(nu_to_F(nu, e), e);

    return new KeplerianOrbit({ a, e, i, o, w, m });
  }

  /**
    * The distance in AU from center of the ellipse to the object
    * @param t Angular parameter (in radians)
    */
  getRadius (t) {
    const { a, e } = this;
    return a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(t));
  }

  /**
   * Returns Cartesian coordinates at a specific angular parameter
   * @param t Angular parmeter (in radians)
   */
  getPosByAngle (t) {
    const { i, o, w } = this;

    // Distance to the point from the orbit focus.
    const r = this.getRadius(t);

    // Cartesian transformation
    return {
      x: r * (Math.cos(o) * Math.cos(t + w) - Math.sin(o) * Math.sin(t + w) * Math.cos(i)),
      y: r * (Math.sin(o) * Math.cos(t + w) + Math.cos(o) * Math.sin(t + w) * Math.cos(i)),
      z: r * (Math.sin(t + w) * Math.sin(i))
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
    const nu = e < 1 ? astro.M_to_nu(M, e) : astro.F_to_nu(M, e);

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
      return astro.E_to_nu(E, e);
    } else {
      // Hyperbolic orbit
      const F = 2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan((u - w) / 2));
      return astro.F_to_nu(F, e);
    }
  }
};

export default KeplerianOrbit;
