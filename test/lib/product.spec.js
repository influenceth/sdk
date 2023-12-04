import { expect } from 'chai';
import product from '../../src/lib/product.js';
import { checkIdsAndTypes } from '../testUtils.js';

describe('Product library', function () {
  checkIdsAndTypes(product.IDS, product.TYPES);

  it('should get list by category', async function () {
    let products = product.getListByCategory(product.CATEGORIES.VOLATILE);
    expect(products).to.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8 ]);

    products = product.getListByCategory(product.CATEGORIES.ELECTRO_OPTICAL);
    expect(products).to.deep.equal([ 173, 186, 211, 212 ]);
  });

  it('should get list by classification', async function () {
    let products = product.getListByClassification(product.CLASSIFICATIONS.RAW_MATERIAL);
    expect(products).to.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ]);

    products = product.getListByClassification(product.CLASSIFICATIONS.MANUFACTURED_GOOD);
    expect(products).to.deep.equal([ 41, 42, 43, 44, 66, 67, 68, 69, 70, 71, 72, 74, 97, 99, 100, 101, 102, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 132, 133, 136, 152, 153, 154, 155, 156, 157, 158, 162, 169, 171, 172, 173, 174, 175, 181, 183, 186, 187, 201, 202, 203, 204, 205, 206, 209, 210, 211, 212, 213, 214, 215, 219 ]);
  });
});