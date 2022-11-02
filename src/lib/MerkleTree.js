import { hash } from 'starknet';

class MerkleTree {
  /**
   * Sorted version of Pedersen hash
   *
   * @param {Number<BigInt>|<String>}
   * @param {Number<BigInt>|<String>}
  */
  static #sortedHash (a, b) {
    let aSorted = BigInt(a);
    let bSorted = BigInt(b);

    if (aSorted > bSorted) {
      aSorted = BigInt(b);
      bSorted = BigInt(a);
    }

    return BigInt(hash.pedersen([aSorted, bSorted]));
  }

  static #getNextLevel (level) {
    const nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      const node = MerkleTree.#sortedHash(level[i], level[i + 1]);
      nextLevel.push(node);
    }

    return nextLevel;
  };

  static #generateProof (level, index, proof) {
    if (level.length === 1) return proof;
    if (level.length % 2 !== 0) level.push(0n);

    const nextLevel = MerkleTree.#getNextLevel(level);
    let indexParent = 0;

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

    return MerkleTree.#generateProof(nextLevel, indexParent, proof);
  };

  static #generateProofFromTree (tree, index, currentLevel, proof) {
    const level = tree[currentLevel];
    if (level.length === 1) return proof;
    if (level.length % 2 !== 0) level.push(0n);

    currentLevel++;
    let indexParent = 0;

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

    return MerkleTree.#generateProofFromTree(tree, indexParent, currentLevel, proof);
  };

  /**
   * Generates merkle root from values list.
   * (Each pair of values must be in sorted order)
   *
   * @param {Array<BigInt|String>}
   * @return {BigInt}
  */
  static generateRoot (values) {
    if (values.length === 1) return values[0];
    if (values.length % 2 !== 0) values.push(0);

    const nextLevel = MerkleTree.#getNextLevel(values);
    return MerkleTree.generateRoot(nextLevel);
  };

  /**
   * Generates a merkle tree (includes root)
   *
   * @param {Array.<BigInt|String>}
   * @return {Array.<BigInt>}
  */
  static generateTree (values, tree = []) {
    if (values.length === 1) {
      tree.push(values);
      return tree;
    }

    if (values.length % 2 !== 0) values.push(0);

    tree.push(values);
    const nextLevel = MerkleTree.#getNextLevel(values);
    return MerkleTree.generateTree(nextLevel, tree);
  };

  /**
    * Generates merkle proof from an index of the value.
    * (Each pair of values must be in sorted order)
    *
    * @param {Array.<BigInt|String>}
    * @param {Number}
    * @return {Array.<BigInt>}
  */
  static generateProof (values, index) {
    return MerkleTree.#generateProof(values, index, []);
  };

  /**
   * Generates a merkle proof from a tree generated with generateTree
   *
   * @param {Array.<BigInt|String>}
   * @param {Number}
   * @param {Array.<BigInt|String>}
  */
  static generateProofFromTree (tree, index) {
    return MerkleTree.#generateProofFromTree(tree, index, 0, []);
  };

  /**
   * Checks the validity of a merkle proof
   *
   * @param {BigInt|String}
  */
  static verify (leaf, root, proof) {
    let curr = BigInt(leaf);

    for (const proofElem of proof) {
      curr = MerkleTree.#sortedHash(curr, proofElem);
    }

    return BigInt(curr) === BigInt(root);
  };
}

export default MerkleTree;
