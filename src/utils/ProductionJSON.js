import Asteroid from '../lib/asteroid.js';
import Building from '../lib/building.js';
import Process from '../lib/process.js';
import Processor from '../lib/processor.js';
import Product from '../lib/product.js';
import Ship from '../lib/ship.js';

/**
 * The production chains JSON can be generated by calling `new ProductionJSON().generateJSON()`
 */
class ProductionJSON {
  constructor () {
    this.productionChainsJSON = {
      _hash: {}, // helper for clients to detect changes in the JSON
      buildings: [],
      processes: [],
      products: [],
      spectralTypes: []
    };

    /**
     * Expected format: `{"1": 3, "2": 5, ...}`
     */
    this.processorIdToBuildingId = {};

    /**
     * Expected format: `{"1": "S1", "2": "S2", ...}`
     */
    this.shipIdToProductId = {};

    /**
     * Expected format: `{"1": "B1", "2": "B2", ...}`
     */
    this.buildingIdToProductId = {};

    /**
     * Expected format: `{"1": "11", "2": "22", ...}`
     */
    this.rawMaterialIdToMiningProcessId = {};
  }

  /**
   * Convert seconds to hours, avoiding floating point precision issues
   */
  getHoursFromSeconds (seconds) {
    return String(Number((seconds / 3600).toPrecision(10)));
  }

  /**
   * Returned format: [{"productId": "2", "unitsPerSR": 1}, {"productId": "23", "unitsPerSR": 8}, ...]
   */
  getFormattedInputsOrOutputs (inputsOrOutputs) {
    const formattedInputsOrOutputs = [];
    Object.entries(inputsOrOutputs).forEach(([productId, unitsPerSR]) => {
      formattedInputsOrOutputs.push({
        productId: String(productId),
        unitsPerSR: String(unitsPerSR)
      });
    });
    return formattedInputsOrOutputs;
  }

  getObjectHash (obj) {
    return Array.from(JSON.stringify(obj)).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);
  }

  /**
   * NOTE: The IDs of products and processes generated by this function
   * may not match the IDs from older JSON files, released prior to 2024.
   */
  generateJSON () {
    // Map processor IDs to matching building IDs, if any
    Object.entries(Processor.IDS).forEach(([key, value]) => {
      const matchingBuildingId = Building.IDS[key];
      if (matchingBuildingId) {
        this.processorIdToBuildingId[value] = matchingBuildingId;
      }
    });

    /**
     * Add "products" to the JSON, initially without:
     * - ships
     * - buildings
     */
    Object.values(Product.TYPES).forEach(productData => {
      this.productionChainsJSON.products.push({
        category: productData.category,
        id: String(productData.i),
        massKilogramsPerUnit: String(productData.massPerUnit / 1000),
        name: productData.name,
        quantized: productData.isAtomic,
        type: productData.classification,
        volumeLitersPerUnit: String(productData.volumePerUnit / 1000)
      });
    });

    let nextShipId = 0;

    // Add ships to "products" in the JSON
    Object.values(Ship.TYPES).forEach(shipData => {
      if (shipData.i === Ship.IDS.ESCAPE_MODULE) {
        // Skip "Escape Module" because it already exists as a product
        return;
      }
      nextShipId++;
      const productId = 'S' + nextShipId; // "S1", "S2" etc.
      this.productionChainsJSON.products.push({
        category: '',
        id: productId,
        massKilogramsPerUnit: String(shipData.hullMass / 1000),
        name: shipData.name,
        quantized: true,
        type: 'Ship',
        volumeLitersPerUnit: '0'
      });
      this.shipIdToProductId[shipData.i] = productId;
    });

    let nextBuildingId = 0;

    // Add buildings to "buildings" + "products" in the JSON
    Object.values(Building.TYPES).forEach(buildingData => {
      // Add building to "buildings"
      this.productionChainsJSON.buildings.push({
        id: String(buildingData.i),
        name: buildingData.name
      });
      // Add building to "products"
      if (buildingData.i === Building.IDS.EMPTY_LOT) {
        // Skip "Empty Lot" because it is not a product
        return;
      }
      nextBuildingId++;
      const productId = 'B' + nextBuildingId; // "B1", "B2" etc.
      this.productionChainsJSON.products.push({
        category: '',
        id: productId,
        massKilogramsPerUnit: '0',
        name: buildingData.name,
        quantized: true,
        type: 'Building',
        volumeLitersPerUnit: '0'
      });
      this.buildingIdToProductId[buildingData.i] = productId;
    });

    let minProcessId = null;
    let maxProcessId = 0;

    /**
     * Add "processes" to the JSON, initially without:
     * - raw materials (mining)
     * - ships (integration)
     * - buildings (construction)
     */
    Object.values(Process.TYPES).forEach(processData => {
      this.productionChainsJSON.processes.push({
        bAdalianHoursPerAction: this.getHoursFromSeconds(processData.setupTime),
        buildingId: String(this.processorIdToBuildingId[processData.processorType]),
        id: String(processData.i),
        inputs: this.getFormattedInputsOrOutputs(processData.inputs),
        mAdalianHoursPerSR: this.getHoursFromSeconds(processData.recipeTime),
        name: processData.name,
        outputs: this.getFormattedInputsOrOutputs(processData.outputs)
      });
      minProcessId = minProcessId !== null ? Math.min(minProcessId, processData.i) : processData.i;
      maxProcessId = Math.max(maxProcessId, processData.i);
    });

    /**
     * Add raw materials (mining) to "processes" in the JSON
     * - e.g. raw material "Water" => process "Water Mining"
     *
     * NOTE:
     * - Ideally, the mining processes are injected before the "main" processes.
     *   This requires the number of mining processes to be smaller than "minProcessId"
     *   (e.g. if there are 22 mining processes, "minProcessId" should be at least 23).
     *   In this case, the IDs of mining processes are incremented starting from 1.
     * - Otherwise, the mining processes are injected after the "main" processes,
     *   and their IDs are incremented starting from "maxProcessId" + 1.
     */
    const rawMaterialProductIds = Product.getListByClassification(Product.CLASSIFICATIONS.RAW_MATERIAL);
    rawMaterialProductIds.forEach((productId, idx) => {
      const processData = {
        bAdalianHoursPerAction: 'N/A',
        buildingId: String(Building.IDS.EXTRACTOR),
        id: '', // to be updated before injecting "processData"
        inputs: [],
        mAdalianHoursPerSR: 'N/A',
        name: Product.TYPES[productId].name + ' Mining', // e.g. "Water Mining"
        outputs: [{
          productId: String(productId),
          unitsPerSR: ''
        }]
      };
      if (rawMaterialProductIds.length < minProcessId) {
        processData.id = String(idx + 1);
        this.productionChainsJSON.processes.splice(idx, 0, processData);
      } else {
        processData.id = String(++maxProcessId);
        this.productionChainsJSON.processes.push(processData);
      }
      this.rawMaterialIdToMiningProcessId[productId] = processData.id;
    });

    /**
     * Add ships (integration) to "processes" in the JSON
     * - e.g. ship "Shuttle" => process "Shuttle Integration"
     */
    Object.entries(this.shipIdToProductId).forEach(([shipId, productId]) => {
      const setupTime = Ship.CONSTRUCTION_TYPES[shipId].setupTime;
      const constructionTime = Ship.CONSTRUCTION_TYPES[shipId].constructionTime;
      const inputs = Ship.CONSTRUCTION_TYPES[shipId].requirements;
      this.productionChainsJSON.processes.push({
        bAdalianHoursPerAction: this.getHoursFromSeconds(setupTime),
        buildingId: String(Building.IDS.SHIPYARD),
        id: String(++maxProcessId),
        inputs: this.getFormattedInputsOrOutputs(inputs),
        mAdalianHoursPerSR: this.getHoursFromSeconds(constructionTime),
        name: Ship.TYPES[shipId].name + ' Integration', // e.g. "Shuttle Integration"
        outputs: [{
          productId: String(productId),
          unitsPerSR: '1'
        }]
      });
    });

    /**
     * Add buildings (construction) to "processes" in the JSON
     * - e.g. building "Warehouse" => process "Warehouse Construction"
     */
    Object.entries(this.buildingIdToProductId).forEach(([buildingId, productId]) => {
      // NOTE: "setupTime" not yet defined for buildings construction, as of v2.1.0-beta.52
      const setupTime = Building.CONSTRUCTION_TYPES[buildingId].setupTime;
      const constructionTime = Building.CONSTRUCTION_TYPES[buildingId].constructionTime;
      const inputs = Building.CONSTRUCTION_TYPES[buildingId].requirements;
      this.productionChainsJSON.processes.push({
        bAdalianHoursPerAction: setupTime ? this.getHoursFromSeconds(setupTime) : 'N/A',
        buildingId: String(Building.IDS.EMPTY_LOT),
        id: String(++maxProcessId),
        inputs: this.getFormattedInputsOrOutputs(inputs),
        mAdalianHoursPerSR: this.getHoursFromSeconds(constructionTime),
        name: Building.TYPES[buildingId].name + ' Construction', // e.g. "Warehouse Construction"
        outputs: [{
          productId: String(productId),
          unitsPerSR: '1'
        }]
      });
    });

    /**
     * Populate "spectralTypes" in the JSON, using the IDs of mining processes
     * (as injected earlier in this function) associated with each spectral type.
     */
    Object.entries(Asteroid.SPECTRAL_TYPES).forEach(([spectralId, spectralData]) => {
      this.productionChainsJSON.spectralTypes.push({
        id: spectralId,
        name: spectralData.name.toUpperCase(),
        processes: spectralData.resources.map(productId => this.rawMaterialIdToMiningProcessId[productId])
      });
    });

    /**
     * Generate a hash of each sub-object (buildings, processes etc.),
     * to help clients detect when changes are introduced in the JSON.
     */
    Object.keys(this.productionChainsJSON).filter(key => key !== '_hash').forEach(key => {
      this.productionChainsJSON._hash[key] = this.getObjectHash(this.productionChainsJSON[key]);
    });

    return this.productionChainsJSON;
  }
}

export default ProductionJSON;