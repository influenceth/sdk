import { expect } from 'chai';

export function checkIdsAndTypes(ids, types) {
  it('should not have any undefined TYPES keys', function () {
    expect(!!Object.keys(types).find((k) => k === 'undefined')).to.be.false;
  });

  it('every ID should be a TYPES key', function () {
    expect(!!Object.values(ids).find((id) => !types[id])).to.be.false;
  });
}