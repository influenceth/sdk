export const entityTypes = {
  CREW: 1,
  CREWMATE: 2,
  ASTEROID: 3,
  LOT: 4,
  PRODUCT: 5,
  DEPOSIT: 10,
  ORDER: 11,
  DELIVERY: 12,
  PUBLIC_POLICY: 13,
  WHITELIST_POLICY: 14,
  PREPAID_POLICY: 15,
  CONTRACT_POLICY: 16,
  WAREHOUSE: 20,
  EXTRACTOR: 21,
  REFINERY: 22,
  BIOREACTOR: 23,
  FACTORY: 24,
  SHIPYARD: 25,
  SPACEPORT: 26,
  MARKETPLACE: 27,
  HABITAT: 28,
  LIGHT_TRANSPORT: 30,
  HEAVY_TRANSPORT: 31,
  SHUTTLE: 32
};

export class Entity {
  constructor (label, id) {
    this.label = this.constructor.format(label).label;
    this.id = id;
  }

  static format (data) {
    if (!data.label) throw new Error('Entity label required');
    let labelId;

    if (Number.isInteger(data.label) && Object.values(entityTypes).includes(data.label)) {
      labelId = data.label;
    } else {
      labelId = entityTypes[data.label.toUpperCase()];
    }

    if (!labelId) throw new Error(`Unknown entity label: ${data.label}`);
    return { ...data, label: labelId };
  }
}
