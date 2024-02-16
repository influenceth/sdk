import fs from 'fs';
import ProductionJSON from '../utils/ProductionJSON.js';

/**
 * Expected syntax:
 * npm run export-production-chains file=example.json
 */

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [k, v = true] = arg.split('=');
  acc[k] = v;
  return acc;
}, {});

const file = args.file;

if (file && typeof file === 'string') {
  const json = new ProductionJSON().generateJSON();
  const jsonString = JSON.stringify(json, null, '\t');
  fs.writeFile(`./${file}`, jsonString, err => {
    if (err) {
      console.log(`ERROR writing file "${file}"`, err);
    } else {
      console.log(`DONE exporting JSON to file "${file}"`);
    }
  });
} else {
  console.log('WARNING: missing "file" argument');
  console.log('Expected syntax: "npm run export-production-chains file=example.json"');
}
