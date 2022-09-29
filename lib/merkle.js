const { hash } = require('starknet');

const pedersenHash = (a, b) => {
  let aSorted = BigInt(a);
  let bSorted = BigInt(b);

  if (aSorted > bSorted) {
    aSorted = BigInt(b);
    bSorted = BigInt(a);
  }

  return BigInt(hash.pedersen([ aSorted, bSorted ]));
};

// Generates merkle root from values list each pair of values must be in sorted order
const generateMerkleRoot = (values) => {
  if (values.length === 1) return values[0];
  if (values.length % 2 !== 0) values.push(0);

  const nextLevel = getNextLevel(values)
  return generateMerkleRoot(nextLevel);
};

// Generates merkle proof from an index of the value list each pair of values must be in sorted order
const generateMerkleProof = (values, index) => {
  return generateProofHelper(values, index, []);
};

// Checks the validity of a merkle proof the last element of the proof should be the root
const verifyMerkleProof = (leaf, proof) => {
  const root = proof.pop();
  let curr = BigInt(leaf);

  for (const proofElem of proof) {
    curr = pedersenHash(curr, proofElem);
  }

  return curr === root;
};

const getNextLevel = (level) => {
  const nextLevel = [];

  for (let i = 0; i < level.length; i += 2) {
    const node = pedersenHash(level[i], level[i + 1]);
    nextLevel.push(node);
  }

  return nextLevel;
};

const generateProofHelper = (level, index, proof) => {
  if (level.length === 1) return proof;
  if (level.length % 2 !== 0) level.push(0n);

  const nextLevel = getNextLevel(level);
  let indexParent = 0

  for (let i = 0; i < level.length; i++) {
    if (i === index) {
      indexParent = Math.floor(i / 2);

      if (i % 2 === 0) {
        proof.push(BigInt(level[index + 1]));
      } else {
        proof.push(BigInt(level[index - 1]));
      }
    }
  }

  return generateProofHelper(nextLevel, indexParent, proof);
};

const generateMerkleProofFromTree = (tree, index) => {
  return generateProofFromTreeHelper(tree, index, 0, []);
};

const generateProofFromTreeHelper = (tree, index, currentLevel, proof) => {
  const level = tree[currentLevel];
  if (level.length === 1) return proof;
  if (level.length % 2 !== 0) level.push(0n);

  currentLevel++;
  const nextLevel = tree[currentLevel];
  let indexParent = 0

  for (let i = 0; i < level.length; i++) {
    if (i === index) {
      indexParent = Math.floor(i / 2);

      if (i % 2 === 0) {
        proof.push(BigInt(level[index + 1]));
      } else {
        proof.push(BigInt(level[index - 1]));
      }
    }
  }

  return generateProofFromTreeHelper(tree, indexParent, currentLevel, proof);
};

module.exports = {
  generateMerkleRoot,
  generateMerkleProof,
  verifyMerkleProof,
  generateMerkleProofFromTree
};
