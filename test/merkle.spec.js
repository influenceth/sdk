import { expect } from 'chai';
import Merkle from '../src/lib/MerkleTree.js';

const testValues = [1, 2, 3, 4, 5, 6];
const expected = {
  tree: [
    [1, 2, 3, 4, 5, 6],
    [
      2592987851775965742543459319508348457290966253241455514226127639100457844774n,
      1078504723311822443900992338775481548059850561756203702548080974952533155775n,
      887847247223813684398612989470912626224213579404697697378648600264021898263n,
      0
    ],
    [
      1585031860307053614775232457055372934135351753486924178555528195594933887604n,
      2642159642802802357817745026347077277988547597516177952258099282359767915971n
    ],
    [
      89428389394322347504365134305502788910642935783044206274458641273419909977n
    ]
  ],
  proofs: [
    [
      2n,
      1078504723311822443900992338775481548059850561756203702548080974952533155775n,
      2642159642802802357817745026347077277988547597516177952258099282359767915971n
    ],
    [
      1n,
      1078504723311822443900992338775481548059850561756203702548080974952533155775n,
      2642159642802802357817745026347077277988547597516177952258099282359767915971n
    ],
    [
      4n,
      2592987851775965742543459319508348457290966253241455514226127639100457844774n,
      2642159642802802357817745026347077277988547597516177952258099282359767915971n
    ],
    [
      3n,
      2592987851775965742543459319508348457290966253241455514226127639100457844774n,
      2642159642802802357817745026347077277988547597516177952258099282359767915971n
    ],
    [
      6n,
      0n,
      1585031860307053614775232457055372934135351753486924178555528195594933887604n
    ],
    [
      5n,
      0n,
      1585031860307053614775232457055372934135351753486924178555528195594933887604n
    ]
  ]
}

describe('Merkle Tree', function () {
  describe('generateRoot', function () {
    it('should create a root correctly based on the values provided', function () {
      let root;
      const expectedRoot = expected.tree[3][0];
      root = Merkle.generateRoot([1, 2, 3, 4, 5, 6]);
      expect(root).to.eql(expectedRoot);

      root = Merkle.generateRoot([1n, 2n, 3n, 4n, 5n, 6n]);
      expect(root).to.eql(expectedRoot);

      root = Merkle.generateRoot(['0x1','0x2','0x3','0x4','0x5','0x6']);
      expect(root).to.eql(expectedRoot);
    });
  });

  describe('generateTree', function () {
    it('should create a merkle tree correctly based on the values provided', function () {
      const tree = Merkle.generateTree([1, 2, 3, 4, 5, 6]);
      expect(tree).to.have.lengthOf(4)
      expect(tree[0].length).to.eql(6);
      expect(tree[0]).to.include.members([1, 2, 3, 4, 5, 6]);
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
