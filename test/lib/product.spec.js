import { expect } from 'chai';
import product from '../../src/lib/product.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Product library', function () {
  checkIdsAndTypes(product.IDS, product.TYPES);

  it('should get list by category', async function () {
    let products = product.getListByCategory(product.CATEGORIES.VOLATILE);
    expect(products).to.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8 ]);

    products = product.getListByCategory(product.CATEGORIES.ELECTRONICS_OPTICS);
    expect(products).to.deep.equal([ 173, 186, 212 ]);
  });

  it('should get list by classification', async function () {
    let products = product.getListByClassification(product.CLASSIFICATIONS.RAW_MATERIAL);
    expect(products).to.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ]);

    products = product.getListByClassification(product.CLASSIFICATIONS.SHIP_COMPONENT);
    expect(products).to.deep.equal([ 144, 145, 146, 147, 148, 149, 150, 165, 166, 167, 168, 207, 208, 221, 222, 224, 225, 226, 227, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245 ]);
  });
});