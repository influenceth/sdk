import * as math from 'mathjs';
import { ADALIA_GAUSSIAN_CONSTANT, GM_ADALIA, M_PER_AU } from '../constants';

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
   * Adapted from rv2coe in https://github.com/poliastro/poliastro/blob/main/src/poliastro/core/elements.py
   * 
   * Returns:
   * KeplerianOrbit
   *
   * @param {Array.<number>} r Position vector (m)
   * @param {Array.<number>} v Velocity vector (m / s)
   * @param {number} tol Tolerance for eccentricity and inclination checks, default to 1e-8
   */
  static fromPositionAndVelocity(r, v, tol = 1E-8) {
    const k = GM_ADALIA;
    const h = math.cross(r, v);
    const n = math.cross([0, 0, 1], h);
    const e = math.divide(
      math.subtract(
        math.multiply(math.dot(v, v) - k / math.norm(r), r),
        math.multiply(math.dot(r, v), v)
      ),
      k
    );
  
    const ecc = math.norm(e);
    const p = math.dot(h, h) / k;
    const inc = Math.acos(h[2] / math.norm(h));
  
    const circular = ecc < tol;
    const equatorial = Math.abs(inc) < tol;
    
    let raan, argp, nu;
    if (equatorial && !circular) {
      raan = 0;
      argp = Math.atan2(e[1], e[0]) % (2 * Math.PI);
      nu = Math.atan2(math.dot(h, math.cross(e, r)) / math.norm(h), math.dot(r, e));
    } else if (!equatorial && circular) {
      raan = Math.atan2(n[1], n[0]) % (2 * Math.PI);
      argp = 0;
      nu = Math.atan2(math.dot(r, math.cross(h, n)) / math.norm(h), math.dot(r, n));
    } else if (equatorial && circular) {
      raan = 0;
      argp = 0;
      nu = Math.atan2(r[1], r[0]) % (2 * Math.PI);
    } else {
      const a = p / (1 - (ecc ** 2));
      const ka = k * a;
      if (a > 0) {
        const e_se = math.dot(r, v) / Math.sqrt(ka);
        const e_ce = math.norm(r) * math.dot(v, v) / k - 1;
        const E = Math.atan2(e_se, e_ce);
        nu = 2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(E / 2));
      } else {
        const e_sh = math.dot(r, v) / Math.sqrt(-ka);
        const e_ch = math.norm(r) * (math.norm(v) ** 2) / k - 1;
        const F = Math.log((e_ch + e_sh) / (e_ch - e_sh)) / 2;
        nu = 2 * Math.atan(Math.sqrt((ecc + 1) / (ecc - 1)) * Math.tanh(F / 2));
      }
  
      raan = Math.atan2(n[1], n[0]) % (2 * Math.PI);
      const px = math.dot(r, n);
      const py = math.dot(r, math.cross(h, n)) / math.norm(h);
      argp = (Math.atan2(py, px) - nu) % (2 * Math.PI);
    }
  
    nu = (nu + Math.PI) % (2 * Math.PI) - Math.PI;
  
    // Semi-latus rectum of parameter (m) --> Semi-major axis (AU)
    let aM = p / (1 - ecc ** 2);
    let aAU = aM / M_PER_AU;

    // True Anomaly --> Mean anomaly at epoch
    let meanAnomaly;
    if (ecc <= 1) { // elliptical
      const eccAnomaly = 2 * Math.atan(Math.sqrt((1 - ecc) / (1 + ecc)) * Math.tan(nu / 2));
      meanAnomaly = eccAnomaly - ecc * Math.sin(eccAnomaly);
    } else { // hyperbolic
      const eccAnomaly = Math.acosh((ecc + Math.cos(nu)) / (1 + ecc * Math.cos(nu)));
      meanAnomaly = ecc * Math.sinh(eccAnomaly) - eccAnomaly;
    }
  
    return new KeplerianOrbit({
      a: aAU,
      e: ecc,
      i: inc,
      o: raan,  // Right ascension of the ascending node == Longitude of ascending node
      w: argp,  // Argument of Perigee == Argument of periapsis
      m: meanAnomaly
    });
  }

  /**
    * The distance in AU from center of the ellipse to the object
    * @param t Angular parameter (in radians)
    */
  getRadius (t) {
    const a = this.a;
    const e = this.e;
    return a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(t));
  }

  /**
   * Returns Cartesian coordinates at a specific angular parameter
   * @param t Angular parmeter (in radians)
   */
  getPosByAngle (t) {
    const i = this.i;
    const o = this.o;
    const w = this.w;

    // Distance to the point from the orbit focus.
    const r = this.getRadius(t);

    // Cartesian transformation
    const x = r * (Math.cos(o) * Math.cos(t + w) - Math.sin(o) * Math.sin(t + w) * Math.cos(i));
    const y = r * (Math.sin(o) * Math.cos(t + w) + Math.cos(o) * Math.sin(t + w) * Math.cos(i));
    const z = r * (Math.sin(t + w) * Math.sin(i));

    const point = { x, y, z };
    return point;
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
    const thirdLaw = 0.000006421078688030129; // GM / 4*pi*pi in AU DAY (a is AU and period returned in days)
    return Math.sqrt(Math.pow(this.a, 3) / thirdLaw);
  }

  /**
   * Retrieves Cartesian coordinates in AU at a specified elapsed time
   * @param elapsed Time in days (in-game) since game START_TIMESTAMP
   */
  getPositionAtTime (elapsed) {
    const a = this.a;
    const e = this.e;
    const i = this.i;
    const o = this.o;
    const w = this.w;
    const m = this.m;

    // Calculate the longitude of perihelion
    const p = w + o;

    // Calculate mean motion based on assumption that mass of asteroid <<< Sun
    const n = ADALIA_GAUSSIAN_CONSTANT / Math.sqrt(Math.pow(a, 3)); // Mean motion

    // Calculate the mean anomaly at elapsed time
    const M = m + (n * elapsed);

    // Estimate the eccentric and true anomolies using an iterative approximation
    let v;
    if (e < 1) {
      let E1;
      let E = M;
      let lastDiff = 1;
  
      while (lastDiff > 0.0000001) {
        E1 = M + (e * Math.sin(E));
        lastDiff = Math.abs(E1 - E);
        E = E1;
      }

      v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
  
    } else {
      let F1;
      let F = M; // Initial guess for hyperbolic eccentric anomaly
      let lastDiff = 1;
      let maxIterations = 100;
      let iteration = 0;
      
      while (lastDiff > 0.0000001 && iteration < maxIterations) {
        F1 = F - (e * Math.sinh(F) - F - M) / (e * Math.cosh(F) - 1);
        lastDiff = Math.abs(F1 - F);
        F = F1;
        iteration++;
      }

      v = 2 * Math.atan(Math.tanh(F / 2) / Math.sqrt((e - 1)/(e + 1)));
    }

    // Calculate in heliocentric polar and then convert to cartesian
    const r = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(v)); // Current radius in AU

    const pos = {
      x: r * (Math.cos(o) * Math.cos(v + p - o) - (Math.sin(o) * Math.sin(v + p - o) * Math.cos(i))),
      y: r * (Math.sin(o) * Math.cos(v + p - o) + Math.cos(o) * Math.sin(v + p - o) * Math.cos(i)),
      z: r * Math.sin(v + p - o) * Math.sin(i)
    };

    return {
      x: +pos.x.toFixed(10),
      y: +pos.y.toFixed(10),
      z: +pos.z.toFixed(10)
    };
  }

  getTrueAnomalyAtPos (pos) {
    const e = this.e;
    const i = this.i;
    const o = this.o;
    const w = this.w;

    // Calculate the argument of latitude (u)
    const u = Math.atan2(pos.z / Math.sin(i), (pos.x * Math.cos(o) + pos.y * Math.sin(o)));

    // Calculate the eccentric anomaly (E) or hyperbolic eccentric anomaly (F) based on the type of orbit
    // then calculate the true anomaly (v)
    let E, F, v;

    // Elliptical orbit
    if (e < 1) {
      E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan((u - w) / 2));
      // Correct E for quadrant ambiguity
      if (u < w) {
        E += 2 * Math.PI;
      }
      v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));

    // Hyperbolic orbit
    } else {
      F = 2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan((u - w) / 2));
      v = 2 * Math.atan(Math.sqrt((e + 1) / (e - 1)) * Math.tanh(F / 2));
    }

    return v;
  }
};

export default KeplerianOrbit;
