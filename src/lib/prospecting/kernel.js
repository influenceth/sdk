// Circuit-compatible v7 transition kernel. Public APIs validate inputs before entering this module.
import { poseidon2Hash } from '@zkpassport/poseidon2';
import { followError } from './followApproach.js';
const hash = (values) => poseidon2Hash(values.map(BigInt)).toString();
export const RULES = 7;
export const ACCIDENTS = { stuck: 5, collapse: 5, caveIn: 8, recoveryAfterCaveIn: 80 };
export const HEADINGS = [
  [1000, 0],
  [1000, 414],
  [707, 707],
  [414, 1000],
  [0, 1000],
  [-414, 1000],
  [-707, 707],
  [-1000, 414],
  [-1000, 0],
  [-1000, -414],
  [-707, -707],
  [-414, -1000],
  [0, -1000],
  [414, -1000],
  [707, -707],
  [1000, -414]
];
export const WIDTHS = [
  [100, 200, 350],
  [100, 150, 200],
  [100, 180, 250]
];
export const BONUSES = [
  [0, 15, 35],
  [0, 55, 110],
  [0, 30, 60]
];
export const CUTS = {
  width: [
    [15, 60],
    [60, 95],
    [35, 85]
  ],
  hardness: [
    [65, 95],
    [15, 60],
    [35, 85]
  ]
};
export const zero = () => Array(15).fill(0);
// known, lot, depth, grade, clue, heading, nextDepth, widthDone, assayDone,
// widthPercent, rateBonus, recoveryPercent, qualityBps, xCmOffset, zCmOffset
export function actionHash (context, i, a) {
  return hash(
    [7001, context, i, a.method, a.target, a.source, a.depth, a.salt].map(
      String
    )
  );
}
export function draws (context, i, commitment, randomness, salt) {
  const h = BigInt(
    hash([7002, context, i, commitment, randomness, salt].map(String))
  );
  return Array.from({ length: 7 }, (_, j) =>
    Number((h >> BigInt(32 * j)) & 0xffffffffn)
  );
}
export const percent = (word) => Math.floor((word * 100) / 4294967296);
export function unpackMeta (meta) {
  let n = BigInt(meta);
  const lot = Number(n & ((1n << 21n) - 1n));
  n >>= 21n;
  const x = Number(n & ((1n << 20n) - 1n));
  n >>= 20n;
  const z = Number(n & ((1n << 20n) - 1n));
  n >>= 20n;
  return { lot, x, z, abundance: Number(n) };
}
export function packMeta ({ lot, x, z, abundance }) {
  return (
    BigInt(lot) +
    (BigInt(x) << 21n) +
    (BigInt(z) << 41n) +
    (BigInt(abundance) << 61n)
  ).toString();
}
export function transition (
  state,
  history,
  context,
  i,
  a,
  meta,
  blockedApproaches,
  randomness,
  quality = 10000
) {
  const fail = (m) => {
    throw Error(m);
  };
  const v = state.map((c) => c.slice());
  const m = unpackMeta(meta);
  const src = v[a.source];
  const target = v[a.target];
  if (
    !src ||
    !target ||
    ![0, 1, 2].includes(a.method) ||
    a.depth < 0 ||
    a.depth > 4
  ) { fail('invalid action'); }
  const follow = a.method === 0;
  const sourceHit = src[0] && src[3] > 0;
  if (follow) {
    if (a.target !== i) fail('follow target index');
    const error = followError(v, history, state.origin, src, m.lot, a.depth,
      Number((BigInt(blockedApproaches) >> BigInt(a.source)) & 1n) === 1);
    if (error) fail(error);
  } else if (
    !target[0] ||
    !target[3] ||
    target[1] !== m.lot ||
    target[2] !== a.depth ||
    (a.method === 1 ? target[7] : target[8])
  ) { fail('invalid measurement'); }
  const commitment = actionHash(context, i, a);
  const d = draws(context, i, commitment, randomness, a.salt);
  const roll = percent(d[0]);
  const event =
    roll < ACCIDENTS.stuck
      ? 1
      : follow && sourceHit && roll < ACCIDENTS.stuck + ACCIDENTS.collapse
        ? 2
        : a.method === 1 && roll < ACCIDENTS.stuck + ACCIDENTS.caveIn
          ? 3
          : 0;
  if (event !== 1 && event !== 2) {
    if (follow) {
      const chance = followChance(src, m, a.depth);
      const hit = d[1] * 1000000 < chance * 4294967296;
      let grade = 0;
      const g = percent(d[2]);
      if (hit) {
        grade = sourceHit
          ? g < 70
            ? src[3]
            : g < 85
              ? Math.min(3, src[3] + 1)
              : Math.max(1, src[3] - 1)
          : g < 50
            ? 1
            : g < 85
              ? 2
              : 3;
      }
      v[i] = [
        1,
        m.lot,
        a.depth,
        grade,
        percent(d[3]) < 40 ? 0 : percent(d[3]) < 70 ? 1 : 2,
        d[5] % 16,
        Math.max(0, Math.min(4, a.depth + (d[6] % 3) - 1)),
        0,
        0,
        100,
        0,
        100,
        quality,
        m.x,
        m.z
      ];
    } else if (a.method === 1) {
      const c = v[a.target];
      c[7] = 1;
      if (event === 3) c[11] = ACCIDENTS.recoveryAfterCaveIn;
      else {
        const cuts = CUTS.width[c[4]];
        const r = percent(d[4]);
        c[9] = WIDTHS[c[4]][r < cuts[0] ? 0 : r < cuts[1] ? 1 : 2];
      }
    } else {
      const c = v[a.target];
      const cuts = CUTS.hardness[c[4]];
      const r = percent(d[4]);
      c[8] = 1;
      c[10] = BONUSES[c[4]][r < cuts[0] ? 0 : r < cuts[1] ? 1 : 2];
    }
  }
  v.origin = state.origin;
  return {
    state: v,
    commitment,
    event,
    sourceLot: src[1],
    sourceDepth: src[2],
    lot: m.lot,
    depth: a.depth
  };
}
export function claim (cell, abundance) {
  if (!cell[0] || !cell[3]) throw Error('unproductive claim');
  const quantity = Number(
    (875n *
      BigInt(abundance) *
      BigInt(60 + 20 * cell[3]) *
      BigInt(cell[9]) *
      BigInt(cell[11]) *
      BigInt(cell[12])) /
      1000000000000n
  );
  return { lot: cell[1], quantity, rate: 90 + cell[10] };
}
export function digest (
  context,
  quality,
  origin,
  meta,
  blockedApproaches,
  commitments,
  randomness,
  result
) {
  const header =
    7003n +
    (BigInt(meta.length) << 14n) +
    (BigInt(quality) << 18n) +
    (BigInt(origin) << 32n) +
    (BigInt(result.lot) << 53n) +
    (BigInt(result.quantity) << 74n) +
    (BigInt(result.rate) << 106n);
  const data = [context, header];
  for (let i = 0; i < meta.length; i++) {
    data.push(
      BigInt(meta[i]) +
        (BigInt(randomness[i]) << 81n) +
        (BigInt(blockedApproaches[i]) << 145n),
      commitments[i]
    );
  }
  return hash(data.map(String));
}

export function followChance (src, m, depth) {
  const [hx, hz] = HEADINGS[src[5]];
  const dx = m.x - src[13];
  const dz = m.z - src[14];
  const dot = dx * hx + dz * hz;
  const aligned =
    m.lot === src[1] ||
    (dot >= 0 &&
      4n * BigInt(dot) ** 2n >=
        BigInt(dx * dx + dz * dz) * BigInt(hx * hx + hz * hz));
  return src[0] && src[3] > 0
    ? (aligned ? (depth === src[6] ? 75 : 55) : 40) * 10000
    : 200000 + Math.floor((2 * m.abundance) / 5);
}
