import { expect } from 'chai';
import { generateMerkleTree } from '../../src/utils/generateAsteroidMerkle.js';

const asteroids = [
  {"i":1,"name":"Adalia Prime","owner":"0xeF0133437AB8DA5C5E8873b61189610E2d8Cb4F5","r":375142,"spectralType":0,"bonuses":1,"scanStatus":2,"purchaseOrder":0,"orbital":{"a":2.192,"e":0.325,"i":0.002443460952792061,"o":3.4108969571725183,"w":5.283809777487633,"m":0.9480628496833199}},
  {"i":104,"name":null,"owner":"0x4e5028805dc865766194FaDd00c101A49bfFa16f","r":41314,"spectralType":4,"bonuses":25,"scanStatus":2,"purchaseOrder":365,"orbital":{"a":1.912,"e":0.147,"i":0.05969026041820607,"o":2.4717352866743694,"w":0.3218387140677544,"m":3.9975021187678124}},
  {"i":250000,"name":"The Lasteroid","owner":"0x5930C8185f03E659835bEEB77d13aeAa3EaD1F2b","r":1023,"spectralType":2,"bonuses":2051,"scanStatus":2,"purchaseOrder":267,"orbital":{"a":3.912,"e":0.038,"i":0.2698279023583233,"o":2.2516492679978843,"w":1.5184364492350666,"m":0.30578168494940655}}
];

describe('Generate Asteroid Merkle', function () {
  it('should generate a merkle tree with asteroids', function () {
    let tree = generateMerkleTree(asteroids);
    expect(tree[0][0]).to.equal('0x4021e1495d2c6906f94cd5a8d28593a6857e70c5409a172555a377068640b8c');
    expect(tree[0][1]).to.equal('0x2222c4ac5ef85837696d786a5b0b84c437d7f037e46e4fecfb8b54433b4b5e7');
    expect(tree[0][2]).to.equal('0x7d6c55be8d4ae81f7f25c325836b3565293a8cfbc8db6decca2999c750396e7');
  });
});
