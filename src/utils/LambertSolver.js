import * as math from 'mathjs';
self.Buffer = self.Buffer || require('buffer').Buffer; // eslint-disable-line no-restricted-globals
const cephes = require('cephes');

const pi = Math.PI;

/**
 * Solves Lambert problem using Dario Izzo's devised algorithm and based on python implementation
 * found at https://github.com/jorgepiloto/lamberthub which is, in turn, based on the implementation
 * found at https://github.com/poliastro/poliastro.
 * 
 * Reference for original algorithm: Izzo, D. (2015). Revisiting Lambert’s problem. Celestial Mechanics
 * and Dynamical Astronomy, 121(1), 1-15.
 * 
 * Returns:
 * v1: Initial velocity vector.
 * v2: Final velocity vector.
 *
 * @param {number} mu Gravitational parameter, equivalent to GM of attractor body.
 * @param {Array.<number>} r1 Initial position vector
 * @param {Array.<number>} r2 Final position vector
 * @param {number} tof Time of flight in seconds
 * @param {number} M Number of revolutions. Must be an integer equal or greater than 0 value.
 * @param {boolean} prograde If true, specifies prograde motion. Otherwise, retrograde motion is imposed.
 * @param {boolean} low_path If two solutions are available, it selects between high or low path.
 * @param {number} maxiter Maximum number of iterations.
 * @param {number} atol Absolute tolerance.
 * @param {number} rtol Relative tolerance.
 */
const solver = async (
  mu,
  r1,
  r2,
  tof,
  M = 0,
  prograde = true,
  low_path = true,
  maxiter = 35,
  atol = 1e-5,
  rtol = 1e-7
) => {
  await cephes.compiled;

  // Check that input parameters are safe
  validateGravitationalParam(mu);
  validatePositions(r1, r2);

  // Chord
  const c = math.subtract(r2, r1);
  const c_norm = math.norm(c);
  const r1_norm = math.norm(r1);
  const r2_norm = math.norm(r2);

  // Semiperimeter
  const s = math.multiply(math.add(r1_norm, r2_norm, c_norm), 0.5);

  // Versors
  const i_r1 = math.divide(r1, r1_norm);
  const i_r2 = math.divide(r2, r2_norm);
  let i_h = math.cross(i_r1, i_r2)
  i_h = math.divide(i_h, math.norm(i_h));

  // Geometry of the problem
  let ll = Math.sqrt(1 - Math.min(1.0, c_norm / s));

  // Compute the fundamental tangential directions
  let i_t1, i_t2;

  if (i_h[2] < 0) {
    ll = -ll;
    i_t1 = math.cross(i_r1, i_h);
    i_t2 = math.cross(i_r2, i_h);
  } else {
    i_t1 = math.cross(i_h, i_r1);
    i_t2 = math.cross(i_h, i_r2);
  }

  // Correct transfer angle parameter and tangential vectors regarding orbit's inclination
  if (!prograde) {
    ll = -ll;
    i_t1 = math.multiply(-1, i_t1);
    i_t2 = math.multiply(-1, i_t2);
  }

  // Non dimensional time of flight
  const T = Math.sqrt(2 * mu / Math.pow(s, 3)) * tof;

  // Find solutions and filter them
  const [ x, y ] = _findXY(ll, T, M, maxiter, atol, rtol, low_path);

  // Reconstruct
  const gamma = Math.sqrt(mu * s / 2);
  const rho = (r1_norm - r2_norm) / c_norm;
  const sigma = Math.sqrt(1 - Math.pow(rho, 2));

  // Compute the radial and tangential components at initial and final position vectors
  const [ V_r1, V_r2, V_t1, V_t2 ] = _reconstruct(x, y, r1_norm, r2_norm, ll, gamma, rho, sigma);
  
  // Solve for the initial and final velocity
  const v1 = math.add(math.multiply(V_r1, math.divide(r1, r1_norm)), math.multiply(V_t1, i_t1));
  const v2 = math.add(math.multiply(V_r2, math.divide(r2, r2_norm)), math.multiply(V_t2, i_t2));

  return [ v1, v2 ];
};

const validateGravitationalParam = (mu) => {
  if (mu <= 0) throw new Error('Gravitational parameter must be positive');
};

const validatePositions = (r1, r2) => {
  validatePosition(r1);
  validatePosition(r2);
  if (r1.filter(e => r2.includes(e)).length === 3) throw new Error('Initial and final positions can not be the same');
};

const validatePosition = (r) => {
  if (r.length !== 3) throw new Error('Position vector must be three dimensional');
  if (r.find(e => e !== 0) === undefined) throw new Error('Position can not be at origin');
};

/**
 * Reconstruct solution velocity vectors
 */
const _reconstruct = (x, y, r1, r2, ll, gamma, rho, sigma) => {
  const V_r1 = gamma * ((ll * y - x) - rho * (ll * y + x)) / r1;
  const V_r2 = -gamma * ((ll * y - x) + rho * (ll * y + x)) / r2;
  const V_t1 = gamma * sigma * (y + ll * x) / r1;
  const V_t2 = gamma * sigma * (y + ll * x) / r2;

  return [ V_r1, V_r2, V_t1, V_t2 ];
};

/**
 * Computes all x, y for given number of revolutions.
 */
const _findXY = (ll, T, M, maxiter, atol, rtol, low_path) => {
  // For abs(ll) == 1 the derivative is not continuous
  if (Math.abs(ll) >= 1) throw new Error('Derivative is not continuous');

  let M_max = Math.floor(T / Math.PI);
  const T_00 = Math.acos(ll) + ll * Math.sqrt(1 - Math.pow(ll, 2)) // T_xM

  // Refine maximum number of revolutions if necessary
  if (T < (T_00 + M_max * Math.PI) && M_max > 0) {
    const T_min = _computeTMin(ll, M_max, maxiter, atol, rtol);
    if (T < T_min) M_max -= 1;
  }

  // Check if a feasible solution exist for the given number of revolutions
  // This departs from the original paper in that we do not compute all solutions
  if (M > M_max) throw new Error('No feasible solution, try lower M!');

  // Initial guess
  const x_0 = _initialGuess(T, ll, M, low_path);

  // Start Householder iterations from x_0 and find x, y
  const x = _householder(x_0, T, ll, M, atol, rtol, maxiter);
  const y = _computeY(x, ll);

  return [ x, y ];
};

const _computeY = (x, ll) => Math.sqrt(1 - Math.pow(ll, 2) * (1 - Math.pow(x, 2)));

const _computePsi = (x, y, ll) => {
  // The auxiliary angle psi is computed using Eq.(17) by the appropriate inverse function
  if (-1 <= x && x < 1) {
    // Elliptic motion - Use arc cosine to avoid numerical errors
    return Math.acos(x * y + ll * (1 - Math.pow(x, 2)));
  } else if (x > 1) {
    // Hyperbolic motion - The hyperbolic sine is bijective
    return Math.asinh((y - x * ll) * Math.sqrt(Math.pow(x, 2) - 1));
  } else {
    // Parabolic motion
    return 0.0;
  }
};

const _tofEquation = (x, T0, ll, M) => _tofEquationY(x, _computeY(x, ll), T0, ll, M);

const _tofEquationY = (x, y, T0, ll, M) => {
  let T_;

  // Time of flight equation with externally computated y
  if (M === 0 && Math.sqrt(0.6) < x && x < Math.sqrt(1.4)) {
    const eta = y - ll * x;
    const S_1 = (1 - ll - x * eta) * 0.5;
    const Q = 4 / 3 * cephes.hyp2f1(3, 1, 5 / 2, S_1);
    T_ = (Math.pow(eta, 3) * Q + 4 * ll * eta) * 0.5;
  } else {
    const psi = _computePsi(x, y, ll);
    T_ = math.divide(
      math.divide(psi + M * pi, Math.sqrt(Math.abs(1 - Math.pow(x, 2)))) - x + ll * y,
      (1 - Math.pow(x, 2))
    );
  }

  return T_ - T0;
};

const _tofEquationP = (x, y, T, ll) => (3 * T * x - 2 + 2 * Math.pow(ll, 3) * x / y) / (1 - Math.pow(x, 2));

const _tofEquationP2 = (x, y, T, dT, ll) => {
  return (3 * T + 5 * x * dT + 2 * (1 - Math.pow(ll, 2)) * Math.pow(ll, 3) / Math.pow(y, 3)) / (1 - Math.pow(x, 2));
};

const _tofEquationP3 = (x, y, _, dT, ddT, ll) => {
  return (7 * x * ddT + 8 * dT - 6 * (1 - Math.pow(ll, 2)) * Math.pow(ll, 5) * x / Math.pow(y, 5)) /
    (1 - Math.pow(x, 2));
};

const _computeTMin = (ll, M, maxiter, atol, rtol) => {
  let x_T_min, T_min;

  if (ll === 1) {
    x_T_min = 0.0
    T_min = _tofEquation(x_T_min, 0.0, ll, M);
  } else {
    if (M === 0) {
      x_T_min = Infinity;
      T_min = 0.0;
    } else {
      // Set x_i > 0 to avoid problems at ll = -1
      const x_i = 0.1;
      const T_i = _tofEquation(x_i, 0.0, ll, M);
      x_T_min = _halley(x_i, T_i, ll, atol, rtol, maxiter);
      T_min = _tofEquation(x_T_min, 0.0, ll, M);
    }
  }

  return T_min;
};

const _initialGuess = (T, ll, M, low_path) => {
  let x_0;

  if (M === 0) {
    // Single revolution
    const T_0 = Math.acos(ll) + ll * Math.sqrt(1 - Math.pow(ll, 2)) + M * pi; // Equation 19
    const T_1 = 2 * (1 - Math.pow(ll, 3)) / 3; // Equation 21

    if (T >= T_0) {
      x_0 = Math.pow((T_0 / T), (2 / 3)) - 1;
    } else if (T < T_1) {
      x_0 = 5 / 2 * T_1 / T * (T_1 - T) / (1 - Math.pow(ll, 5)) + 1;
    } else {
      // This is the real condition, which is not exactly equivalent: T_1 < T < T_0
      x_0 = Math.pow((T_0 / T), (Math.log2(T_1 / T_0))) - 1;
    }

    return x_0;
  } else {
    // Multiple revolution
    const x_0l = (Math.pow(((M * pi + pi) / (8 * T)), (2 / 3)) - 1) / (
      Math.pow(((M * pi + pi) / (8 * T)), (2 / 3)) + 1);
    const x_0r = (Math.pow(((8 * T) / (M * pi)), (2 / 3)) - 1) / (
      Math.pow(((8 * T) / (M * pi)), (2 / 3)) + 1);

    // Filter out the solution
    x_0 = low_path ? Math.max(x_0l, x_0r) : Math.min(x_0l, x_0r);

    return x_0;
  }
};

/**
 * Find a minimum of time of flight equation using the Halley method.
 */
const _halley = (p0, T0, ll, atol, rtol, maxiter) => {
  for (let ii = 1; ii <= maxiter; ii++) {
    const y = _computeY(p0, ll)
    const fder = _tofEquationP(p0, y, T0, ll)
    const fder2 = _tofEquationP2(p0, y, T0, fder, ll)
    
    if (fder2 === 0) throw new Error('Derivative was zero');

    const fder3 = _tofEquationP3(p0, y, T0, fder, fder2, ll);

    // Halley step (cubic)
    const p = p0 - 2 * fder * fder2 / (2 * Math.pow(fder2, 2) - fder * fder3);

    if (Math.abs(p - p0) < rtol * Math.abs(p0) + atol) return p
    p0 = p
  }

  throw new Error('Failed to converge');
}

/**
 * Find a zero of time of flight equation using the Householder method.
 */
const _householder = (p0, T0, ll, M, atol, rtol, maxiter) => {
  for (let ii = 1; ii <= maxiter; ii++) {
    const y = _computeY(p0, ll);
    const fval = _tofEquationY(p0, y, T0, ll, M);
    const T = fval + T0;
    const fder = _tofEquationP(p0, y, T, ll)
    const fder2 = _tofEquationP2(p0, y, T, fder, ll)
    const fder3 = _tofEquationP3(p0, y, T, fder, fder2, ll)

    // Householder step (quartic)
    const p = p0 - fval * (
      (Math.pow(fder, 2) - fval * fder2 / 2)
      / (fder * (Math.pow(fder, 2) - fval * fder2) + fder3 * Math.pow(fval, 2) / 6));

    if (Math.abs(p - p0) < rtol * Math.abs(p0) + atol) return p;
    p0 = p;
  }

  throw new Error('Failed to converge');
};

export async function multiSolver(mu, r1, r2, tof, vi1, vi2, progradeOptions = [true, false], lowpathOptions = [true]) {
  let minDeltaV = null;
  let bestSolutionV1;
  let bestSolutionV2;
  for (let prograde of progradeOptions) {
    // low_path / high_path is only relevant for multi-revolution solutions
    for (let low_path of lowpathOptions) {
      try {
        const [vf1, vf2] = await solver(mu, r1, r2, tof, 0, prograde, low_path);
        const deltaV = math.norm(math.subtract(vi1, vf1)) + math.norm(math.subtract(vi2, vf2));
        if (minDeltaV === null || deltaV < minDeltaV) {
          minDeltaV = deltaV;
          bestSolutionV1 = vf1;
          bestSolutionV2 = vf2;
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return {
    v1: bestSolutionV1,
    v2: bestSolutionV2,
    deltaV: minDeltaV
  };
};

export default solver;