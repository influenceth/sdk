import { expect } from 'chai';
import Merkle from '../../src/utils/MerkleTree.js';

const testValues = ['0x1', '0x2', '0x3', '0x4', '0x5', '0x6'];
const expected = {
  tree: [
    ['0x1', '0x2', '0x3', '0x4', '0x5', '0x6'],
    [
      '0x5bb9440e27889a364bcb678b1f679ecd1347acdedcbf36e83494f857cc58026',
      '0x262697b88544f733e5c6907c3e1763131e9f14c51ee7951258abbfb29415fbf',
      '0x1f680f4b3e66b11ac6b827ef46e7d2da4075e0dc83b7e322d590dbb7687f417',
      '0x0'
    ],
    [
      '0x38118a340bbba28e678413cd3b07a9436a5e60fd6a7cbda7db958a6d501e274',
      '0x5d768cbfb58b59a888e5ae9fe5d55d83b9b0c1d9365e28e3fe4849f8135ddc3'
    ],
    [
      '0x329d5b51e352537e8424bfd85b34d0f30b77d213e9b09e2976e6f6374ecb59'
    ]
  ],
  proofs: [
    [
      '0x2',
      '0x262697b88544f733e5c6907c3e1763131e9f14c51ee7951258abbfb29415fbf',
      '0x5d768cbfb58b59a888e5ae9fe5d55d83b9b0c1d9365e28e3fe4849f8135ddc3'
    ],
    [
      '0x1',
      '0x262697b88544f733e5c6907c3e1763131e9f14c51ee7951258abbfb29415fbf',
      '0x5d768cbfb58b59a888e5ae9fe5d55d83b9b0c1d9365e28e3fe4849f8135ddc3'
    ],
    [
      '0x4',
      '0x5bb9440e27889a364bcb678b1f679ecd1347acdedcbf36e83494f857cc58026',
      '0x5d768cbfb58b59a888e5ae9fe5d55d83b9b0c1d9365e28e3fe4849f8135ddc3'
    ],
    [
      '0x3',
      '0x5bb9440e27889a364bcb678b1f679ecd1347acdedcbf36e83494f857cc58026',
      '0x5d768cbfb58b59a888e5ae9fe5d55d83b9b0c1d9365e28e3fe4849f8135ddc3'
    ],
    [
      '0x6',
      '0x0',
      '0x38118a340bbba28e678413cd3b07a9436a5e60fd6a7cbda7db958a6d501e274'
    ],
    [
      '0x5',
      '0x0',
      '0x38118a340bbba28e678413cd3b07a9436a5e60fd6a7cbda7db958a6d501e274'
    ]
  ]
};

describe('Merkle Tree', function () {
  describe('generateRoot', function () {
    it('should create a root correctly based on the values provided', function () {
      let root;
      const expectedRoot = expected.tree[3][0];
      root = Merkle.generateRoot([1, 2, 3, 4, 5, 6]);
      expect(root).to.eql(expectedRoot);

      root = Merkle.generateRoot([1n, 2n, 3n, 4n, 5n, 6n]);
      expect(root).to.eql(expectedRoot);

      root = Merkle.generateRoot(['0x1', '0x2', '0x3', '0x4', '0x5', '0x6']);
      expect(root).to.eql(expectedRoot);
    });
  });

  describe('generateTree', function () {
    it('should create a merkle tree correctly based on the values provided', function () {
      const tree = Merkle.generateTree([1, 2, 3, 4, 5, 6]);
      expect(tree).to.have.lengthOf(4);
      expect(tree[0].length).to.eql(6);
      expect(tree[0]).to.include.members(['0x1', '0x2', '0x3', '0x4', '0x5', '0x6']);
      expect(tree[1]).to.include.members(expected.tree[1]);
      expect(tree[2]).to.include.members(expected.tree[2]);
      expect(tree[3]).to.include.members(expected.tree[3]);
    });
  });

  describe('generateProof', function () {
    it('should create a proof for the specified inded based on the provided values', function () {
      testValues.forEach((value, index) => {
        const proof = Merkle.generateProof(testValues, index);
        expect(proof).have.lengthOf(3);
        expect(proof).to.include.members(expected.proofs[index]);
      });
    });
  });

  describe('generateProofFromTree', function () {
    it('should create a valid proof from the specified tree', function () {
      testValues.forEach((value, index) => {
        const proof = Merkle.generateProofFromTree(expected.tree, index);
        expect(proof).to.have.lengthOf(3);
        expect(proof).to.include.members(expected.proofs[index]);
      });
    });
  });

  describe('verify', function () {
    it('should return true if the leaf is valid per the root and proof', function () {
      const root = expected.tree[3][0];
      testValues.forEach((value, index) => {
        const isValid = Merkle.verify(value, root, expected.proofs[index]);
        expect(isValid).to.eql(true);
      });
    });

    it('should return false if the leaf is not valid per the root and proof', function () {
      const root = expected.tree[3][0];
      [7, 8, 9, 10, 11, 12].forEach((value, index) => {
        const isValid = Merkle.verify(value, root, expected.proofs[index]);
        expect(isValid).to.eql(false);
      });
    });
  });
});
