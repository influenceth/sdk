// Influence global constants
export const MASTER_SEED = 'influence';
export const START_TIMESTAMP = 1609459200; // Zero date timestamp for orbits
export const SIMPLEX_POLY_FIT = {
  1: [ 0.044363, -1.691305, 22.890226, -127.26599, 384.093578, -585.849871, 432.255245, -123.520867 ],
  2: [ 0.886138, -19.560496, 171.895764, -780.710568, 1982.691002, -2760.093607, 1966.990019, -561.983908 ],
  3: [ 2.75314, -54.294211, 436.709616, -1853.146288, 4457.656165, -6012.337815, 4229.255422, -1208.348687 ],
  4: [ 4.946477, -93.277096, 722.781378, -2974.553545, 6984.401811, -9284.281121, 6490.303429, -1854.261907 ],
  5: [ 6.437368, -119.240111, 910.080242, -3698.603667, 8599.626521, -11363.502, 7923.709174, -2263.946507 ],
  6: [ 7.125128, -131.167199, 995.987525, -4030.690599, 9340.774795, -12317.84992, 8581.643077, -2451.950926 ],
  7: [ 7.454902, -136.335868, 1029.961111, -4152.599493, 9598.577316, -12638.88522, 8799.663357, -2514.297191 ],
  8: [ 7.600375, -138.959786, 1049.498858, -4230.063342, 9774.497289, -12867.80471, 8958.24734, -2559.623732 ],
};

export const GRAVITATIONAL_CONSTANT = 6.674315E-11; // m3 kg-1 s-2
export const ADALIA_MASS = 1.7033730830877265E30; // kg
export const GM_ADALIA = 1.1368848519048659e20; // m3 s-2 (GRAVITATIONAL_CONSTANT * ADALIA_MASS)
export const ADALIA_GAUSSIAN_CONSTANT = 0.015921477825967683; // days, au
export const M_PER_AU = 149597870691;
export const S_PER_DAY = 86400;

export default {
  MASTER_SEED,
  START_TIMESTAMP
};
