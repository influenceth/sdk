import * as math from 'mathjs';

export const GRAVITATIONAL_CONSTANT = 6.67430E-11; // m3 kg-1 s-2
export const S_PER_DAY = 86400;

/**
 * Converts from classical orbital elements to state vectors
 *
 * @param k Standard gravitational parameter (km^3 / s^2)
 * @param p Semi latus rectum or parameter
 * @param ecc Eccentricity
 * @param inc Inclination (rad)
 * @param raan Longitude of ascending node (rad)
 * @param argp Argument of periapsis (rad)
 * @param nu True anomaly (rad)
 */
const classicToState = (k, p, ecc, inc, raan, argp, nu) => {
  const pqw = math.dotMultiply(
    [[ Math.cos(nu), Math.sin(nu), 0 ], [ -Math.sin(nu), ecc + Math.cos(nu), 0 ]],
    [[0, 0, 0].fill(p / (1 + ecc * Math.cos(nu)), 0, 3), [0, 0, 0].fill(Math.sqrt(k / p), 0, 3)]
  );

  let rm = _rotation_matrix(raan, 2);
  rm = math.multiply(rm, _rotation_matrix(inc, 0));
  rm = math.multiply(rm, _rotation_matrix(argp, 2));

  return math.multiply(pqw, math.transpose(rm));
};

/**
 * Converts from state vectors to classical orbital elements
 *
 * @param k Standard gravitational parameter (km^3 / s^2)
 * @param r Position vector (km)
 * @param v Velocity vector (km / s)
 * @param tol Tolerance for eccentricity and inclination checks
 * @returns {Object} Classical orbital elements { p, ecc, inc, raan, argp, nu }
 */
const stateToClassic = (k, r, v, tol = 1e-8) => {
  let raan, argp, nu;

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

  if (equatorial && !circular) {
    // Equatorial elliptical orbit
    raan = 0;
    argp = Math.atan2(e[1], e[0]) % (2 * Math.PI);
    nu = Math.atan2(math.dot(h, math.cross(e, r)) / math.norm(h), math.dot(r, e));
  } else if (!equatorial && circular) {
    // Non-equatorial circular orbit
    raan = _modulo(Math.atan2(n[1], n[0]), (2 * Math.PI));
    argp = 0;
    nu = Math.atan2(math.dot(r, math.cross(h, n)) / math.norm(h), math.dot(r, n));
  } else if (equatorial && circular) {
    // Equatorial circular orbit
    raan = 0;
    argp = 0;
    nu = _modulo(Math.atan2(r[1], r[0]), (2 * Math.PI));
  } else {
    const a = p / (1 - (ecc ** 2));
    const ka = k * a;

    // TODO: handle parabolic orbits
    if (a > 0) {
      // Elliptical orbit
      const e_se = math.dot(r, v) / Math.sqrt(ka);
      const e_ce = math.norm(r) * math.dot(v, v) / k - 1;
      const E = Math.atan2(e_se, e_ce);
      nu = E_to_nu(E, ecc);
    } else {
      // Hyperbolic orbit
      const e_sh = math.dot(r, v) / Math.sqrt(-ka);
      const e_ch = math.norm(r) * (math.norm(v) ** 2) / k - 1;
      const F = Math.log((e_ch + e_sh) / (e_ch - e_sh)) / 2;
      nu = F_to_nu(F, ecc);
    }

    raan = _modulo(Math.atan2(n[1], n[0]), (2 * Math.PI));
    const px = math.dot(r, n);
    const py = math.dot(r, math.cross(h, n)) / math.norm(h);
    argp = _modulo((Math.atan2(py, px) - nu), (2 * Math.PI));
  }

  // Shift true anomaly into range of -pi to pi
  nu = ((nu % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

  return { p, ecc, inc, raan, argp, nu };
}

// Converts eccentric anomaly to mean anomaly
const E_to_M = (E, ecc) => {
  return E - ecc * Math.sin(E);
};

// Converts mean anomaly to eccentric anomaly
const M_to_E = (M, ecc) => {
  let E1, fVal, fDer, step;
  let E = M < 0 ? M - ecc : M + ecc; // Initial guess for elliptical eccentric anomaly
  let maxIterations = 50;

  for (let i = 0; i < maxIterations; i++) {
    fVal = E_to_M(E, ecc) - M;
    fDer = 1 - ecc * Math.cos(E);
    step = fVal / fDer;
    E1 = E - step;

    if (Math.abs(E1 - E) < 1e-7) {
      break;
    } else {
      E = E1;
    }
  }

  return E1;
}

// Converts eccentric anomaly to true anomaly
const E_to_nu = (E, ecc) => {
  return 2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(E / 2));
}

// Converts true anomaly to eccentric anomaly
const nu_to_E = (nu, ecc) => {
  return 2 * Math.atan(Math.sqrt((1 - ecc) / (1 + ecc)) * Math.tan(nu / 2));
}

// Converts true anomaly to hyperbolic eccentric anomaly
const F_to_M = (F, ecc) => {
  return ecc * Math.sinh(F) - F;
};

// Converts mean anomaly to hyperbolic eccentric anomaly
const M_to_F = (M, ecc) => {
  let F1, fVal, fDer, step;
  let F = Math.asinh(M / ecc); // Initial guess for hyperbolic eccentric anomaly
  let maxIterations = 50;

  for (let i = 0; i < maxIterations; i++) {
    fVal = F_to_M(F, ecc) - M;
    fDer  = ecc * Math.cosh(F) - 1;
    step = fVal / fDer;
    F1 = F - step;

    if (Math.abs(F1 - F) < 1e-7) {
      break;
    } else {
      F = F1;
    }
  }

  return F;
}

// Converts hyperbolic eccentric anomaly to true anomaly
const F_to_nu = (F, ecc) => {
  return 2 * Math.atan(Math.sqrt((ecc + 1) / (ecc - 1)) * Math.tanh(F / 2));
}

// Converts true anomaly to hyperbolic eccentric anomaly
const nu_to_F = (nu, ecc) => {
  return Math.acosh((ecc + Math.cos(nu)) / (1 + ecc * Math.cos(nu)));
}

// Converts mean anomaly to true anomaly
const M_to_nu = (M, ecc) => {
  if (ecc < 1) {
    // Shift mean anomaly into range of -pi to pi
    M = _modulo((M + Math.PI), (2 * Math.PI)) - Math.PI;
    return E_to_nu(M_to_E(M, ecc), ecc);
  } else {
    return F_to_nu(M_to_F(M, ecc), ecc);
  }
}

// Implements modulo (as distinct from the remainder operator)
const _modulo = (x, y) => ((x % y) + y) % y;

/**
 * Generates a rotation matrix
 *
 * @param {Array} angle
 * @param {Integer} axis
 */
const _rotation_matrix = (angle, axis) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const a1 = _modulo((axis + 1), 3);
  const a2 = _modulo((axis + 2), 3);

  const R = math.zeros([3, 3]);
  R[axis][axis] = 1;
  R[a1][a1] = c;
  R[a1][a2] = -s;
  R[a2][a1] = s;
  R[a2][a2] = c;

  return R;
};

export default {
  classicToState,
  stateToClassic,
  E_to_M,
  M_to_E,
  E_to_nu,
  nu_to_E,
  F_to_M,
  M_to_F,
  F_to_nu,
  nu_to_F,
  M_to_nu
};
