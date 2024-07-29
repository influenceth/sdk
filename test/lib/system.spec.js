import { expect } from 'chai';
import System from '../../src/lib/system.js';

describe('System library', function () {
  it('should calculate transfer with confirmation correctly', function () {
    const memo = [ '0x18963b000000010004', '0x1', '0x20001' ];
    const res = System.getTransferWithConfirmationCall(
      '0x048242eCa329A05AF1909FA79CB1f9A4275FF89B987d405ec7de08F73b85588F', // recipient
      288000000000n, // amount
      memo, // memo
      '0x0422d33a3638dcc4c62e72e1d6942cd31eb643ef596ccac2351e0e21f6cd4bf4', // consumerAddress
      '0x004878d1148318a31829523ee9c6a5ee563af6cd87f90a30809e5b0d27db8a9b' // swayAddress
    );

    expect(res.calldata[2]).to.equal('391657046600747861218231272590579428497284744805173769485101711199588109906');
  });

  it('should toBigInt properly', function () {
    expect(System.toBigInt('0x18963b000000010004')).to.equal(453547103898344423428n);
    expect(System.toBigInt('28800000.01')).to.equal(28800000n);
  });
});