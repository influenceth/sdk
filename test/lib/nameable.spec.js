import { expect } from 'chai';
import nameable from '../../src/lib/nameable.js';

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
    expect(nameable.isNameValid('', config)).to.be.false;
    expect(nameable.isNameValid('N', config)).to.be.false;
    expect(nameable.isNameValid('NameableName', config)).to.be.false;
    expect(nameable.isNameValid('Nameable', config)).to.be.true;
  });

  if ('should validate on contents', function () {
    expect(nameable.isNameValid('Nameable', { alpha: true, num: true, sym: true })).to.be.true;
    expect(nameable.isNameValid('Nameable!', { alpha: true, num: true, sym: false })).to.be.true;
    expect(nameable.isNameValid('Nameable14', { alpha: true, num: true, sym: true })).to.be.true;
    expect(nameable.isNameValid('Nameable 14', { alpha: true, num: true, sym: true })).to.be.true;
    expect(nameable.isNameValid('Nameable 14!', { alpha: true, num: true, sym: true })).to.be.true;
    expect(nameable.isNameValid('14!', { alpha: true, num: true, sym: true })).to.be.true;
    expect(nameable.isNameValid('14', { alpha: true, num: true, sym: true })).to.be.true;

    expect(nameable.isNameValid('Nameable', { alpha: true, num: true, sym: false })).to.be.true;
    expect(nameable.isNameValid('Nameable!', { alpha: true, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable14', { alpha: true, num: true, sym: false })).to.be.true;
    expect(nameable.isNameValid('Nameable 14', { alpha: true, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable 14!', { alpha: true, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('14!', { alpha: true, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('14', { alpha: true, num: true, sym: false })).to.be.true;

    expect(nameable.isNameValid('Nameable', { alpha: true, num: false, sym: true })).to.be.true;
    expect(nameable.isNameValid('Nameable!', { alpha: true, num: false, sym: true })).to.be.true;
    expect(nameable.isNameValid('Nameable14', { alpha: true, num: false, sym: true })).to.be.true;
    expect(nameable.isNameValid('Nameable 14', { alpha: true, num: false, sym: true })).to.be.false;
    expect(nameable.isNameValid('Nameable 14!', { alpha: true, num: false, sym: true })).to.be.false;
    expect(nameable.isNameValid('14!', { alpha: true, num: false, sym: true })).to.be.false;
    expect(nameable.isNameValid('14', { alpha: true, num: false, sym: true })).to.be.false;

    expect(nameable.isNameValid('Nameable', { alpha: true, num: false, sym: false })).to.be.true;
    expect(nameable.isNameValid('Nameable!', { alpha: true, num: false, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable14', { alpha: true, num: false, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable 14', { alpha: true, num: false, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable 14!', { alpha: true, num: false, sym: false })).to.be.false;
    expect(nameable.isNameValid('14!', { alpha: true, num: false, sym: false })).to.be.false;
    expect(nameable.isNameValid('14', { alpha: true, num: false, sym: false })).to.be.false;

    expect(nameable.isNameValid('Nameable', { alpha: false, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable!', { alpha: false, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable14', { alpha: false, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable 14', { alpha: false, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('Nameable 14!', { alpha: false, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('14!', { alpha: false, num: true, sym: false })).to.be.false;
    expect(nameable.isNameValid('14', { alpha: false, num: true, sym: false })).to.be.true;
  });
});
