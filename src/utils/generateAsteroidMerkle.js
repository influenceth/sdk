import { hash } from 'starknet';
import { constants } from '@influenceth/astro';

import MerkleTree from './MerkleTree.js';
import Asteroid from '../lib/asteroid.js';

const generateMerkleTree = (snapshot) => {
  // Generate the leaves for the tree
  const leaves = generateLeaves(snapshot);

  // Generate the tree
  return MerkleTree.generateTree(leaves);
};

const generateLeaves = (snapshot, start = 0, finish = 0) => {
  let leaves = [];
  if (finish === 0) { finish = snapshot.length; }

  for (let i = start; i < finish; i++) {
    const asteroid = snapshot[i];
    leaves.push(asteroidHash(transformAsteroid(asteroid)));
  }

  return leaves;
}

const transformAsteroid = (asteroid) => {
  return {
    id: BigInt(asteroid.i),
    spectralType: BigInt(asteroid.spectralType + 1),
    mass: BigInt(Math.round(Asteroid.getMass(asteroid.spectralType + 1, asteroid.r / 1000))) * 2n ** 64n,
    radius: BigInt(asteroid.r) * 2n ** 32n / 1000n,
    a: BigInt(Math.round(asteroid.orbital.a * 1000)) * BigInt(constants.AU) * 2n ** 64n / 1000n / 1000n,
    ecc: BigInt(Math.round(asteroid.orbital.e * 1000)) * 2n ** 64n / 1000n,
    inc: BigInt(asteroid.orbital.i * 2 ** 64),
    raan: BigInt(asteroid.orbital.o * 2 ** 64),
    argp: BigInt(asteroid.orbital.w * 2 ** 64),
    m: BigInt(asteroid.orbital.m * 2 ** 64),
    purchaseOrder: asteroid.purchaseOrder,
    scanStatus: asteroid.scanStatus,
    bonuses: asteroid.bonuses
  };
};

const asteroidHash = function (t) {
  let hashed = hash.pedersen([t.id, t.spectralType])
  hashed = hash.pedersen([hashed, t.mass]);
  hashed = hash.pedersen([hashed, t.radius]);
  hashed = hash.pedersen([hashed, t.a]);
  hashed = hash.pedersen([hashed, t.ecc]);
  hashed = hash.pedersen([hashed, t.inc]);
  hashed = hash.pedersen([hashed, t.raan]);
  hashed = hash.pedersen([hashed, t.argp]);
  hashed = hash.pedersen([hashed, t.m]);
  hashed = hash.pedersen([hashed, t.purchaseOrder]);
  hashed = hash.pedersen([hashed, t.scanStatus]);
  hashed = hash.pedersen([hashed, t.bonuses]);
  return hashed;
};

export { generateMerkleTree, generateLeaves };
