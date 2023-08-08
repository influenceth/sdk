import { expect } from 'chai';
import Name from '../../src/lib/name.js';

const sample = {
  empty: '',
  short: '',
  long: '',
  alpha: '',
  num: '',
  sym: '',
};

const config = { min: 4, max: 28, alpha: true, num: true, sym: true };

describe('Nameable library', function () {
  if ('should validate on length', function () {
    const config = { min: 4, max: 10, alpha: true };
    expect(Name.isNameValid('', config)).to.be.false;
    expect(Name.isNameValid('N', config)).to.be.false;
    expect(Name.isNameValid('NameableName', config)).to.be.false;
    expect(Name.isNameValid('Nameable', config)).to.be.true;
  });

  if ('should validate on contents', function () {
    expect(Name.isNameValid('Nameable', { alpha: true, num: true, sym: true })).to.be.true;
    expect(Name.isNameValid('Nameable!', { alpha: true, num: true, sym: false })).to.be.true;
    expect(Name.isNameValid('Nameable14', { alpha: true, num: true, sym: true })).to.be.true;
    expect(Name.isNameValid('Nameable 14', { alpha: true, num: true, sym: true })).to.be.true;
    expect(Name.isNameValid('Nameable 14!', { alpha: true, num: true, sym: true })).to.be.true;
    expect(Name.isNameValid('14!', { alpha: true, num: true, sym: true })).to.be.true;
    expect(Name.isNameValid('14', { alpha: true, num: true, sym: true })).to.be.true;

    expect(Name.isNameValid('Nameable', { alpha: true, num: true, sym: false })).to.be.true;
    expect(Name.isNameValid('Nameable!', { alpha: true, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable14', { alpha: true, num: true, sym: false })).to.be.true;
    expect(Name.isNameValid('Nameable 14', { alpha: true, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable 14!', { alpha: true, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('14!', { alpha: true, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('14', { alpha: true, num: true, sym: false })).to.be.true;

    expect(Name.isNameValid('Nameable', { alpha: true, num: false, sym: true })).to.be.true;
    expect(Name.isNameValid('Nameable!', { alpha: true, num: false, sym: true })).to.be.true;
    expect(Name.isNameValid('Nameable14', { alpha: true, num: false, sym: true })).to.be.true;
    expect(Name.isNameValid('Nameable 14', { alpha: true, num: false, sym: true })).to.be.false;
    expect(Name.isNameValid('Nameable 14!', { alpha: true, num: false, sym: true })).to.be.false;
    expect(Name.isNameValid('14!', { alpha: true, num: false, sym: true })).to.be.false;
    expect(Name.isNameValid('14', { alpha: true, num: false, sym: true })).to.be.false;

    expect(Name.isNameValid('Nameable', { alpha: true, num: false, sym: false })).to.be.true;
    expect(Name.isNameValid('Nameable!', { alpha: true, num: false, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable14', { alpha: true, num: false, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable 14', { alpha: true, num: false, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable 14!', { alpha: true, num: false, sym: false })).to.be.false;
    expect(Name.isNameValid('14!', { alpha: true, num: false, sym: false })).to.be.false;
    expect(Name.isNameValid('14', { alpha: true, num: false, sym: false })).to.be.false;

    expect(Name.isNameValid('Nameable', { alpha: false, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable!', { alpha: false, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable14', { alpha: false, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable 14', { alpha: false, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('Nameable 14!', { alpha: false, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('14!', { alpha: false, num: true, sym: false })).to.be.false;
    expect(Name.isNameValid('14', { alpha: false, num: true, sym: false })).to.be.true;
  });
});
