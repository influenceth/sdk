import { expect } from 'chai';
import process from '../../src/lib/process.js';
import processor from '../../src/lib/processor.js';
import product from '../../src/lib/product.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Process library', function () {
  checkIdsAndTypes(process.IDS, process.TYPES);

  it('should have valid processor types', function () {
    Object.values(process.TYPES).forEach((p) => {
      expect(Object.values(processor.IDS).includes(p.processorType)).to.be.true;
    });
  });

  it('should have valid input and output products', function () {
    Object.values(process.TYPES).forEach((p) => {
      Object.keys(p.inputs).forEach((i) => {
        expect(!!product.TYPES[i]).to.be.true;
        expect(p.inputs[i]).to.be.greaterThan(0);
      });
      Object.keys(p.outputs).forEach((i) => {
        expect(!!product.TYPES[i]).to.be.true;
        expect(p.outputs[i]).to.be.greaterThan(0);
      });
    });
  });

  it('should get list by processor type', function () {
    let processes = process.getListByProcessorType(processor.IDS.BIOREACTOR);
    expect(processes.map((p) => p.i)).to.deep.equal([ 45, 89, 98, 104, 176, 177, 178, 180, 240, 241, 242 ]);
  });

  it('should calculate outputs with target and bonus', function () {
    let outputs = process.getOutputs(process.IDS.AMMONIA_CATALYTIC_CRACKING, 100, product.IDS.HYDROGEN);
    expect(outputs.find(v => v.id == product.IDS.HYDROGEN).amount).to.equal(600);
    expect(outputs.find(v => v.id == product.IDS.PURE_NITROGEN).amount).to.equal(1700);

    outputs = process.getOutputs(process.IDS.AMMONIA_CATALYTIC_CRACKING, 100, product.IDS.HYDROGEN, 1.5);
    expect(outputs.find(v => v.id == product.IDS.HYDROGEN).amount).to.equal(600);
    expect(outputs.find(v => v.id == product.IDS.PURE_NITROGEN).amount).to.equal(2266);

    outputs = process.getOutputs(process.IDS.AMMONIA_CATALYTIC_CRACKING, 100, product.IDS.PURE_NITROGEN, 1.5);
    expect(outputs.find(v => v.id == product.IDS.HYDROGEN).amount).to.equal(400);
    expect(outputs.find(v => v.id == product.IDS.PURE_NITROGEN).amount).to.equal(3400);
  });
});