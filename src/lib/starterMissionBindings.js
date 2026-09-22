import { CallData, ec, shortString } from 'starknet';
import Entity from './entity.js';
import { toUnsignedBigInt } from './mission.js';

const ACTION_KINDS = ['Built', 'Sample', 'Extraction', 'Process', 'Downstream', 'Delivery', 'EconomicDelivery'];
const u64 = (value) => toUnsignedBigInt(value, 64);
const boolean = (value) => {
  if (typeof value !== 'boolean') throw new TypeError('Expected a boolean');
  return value;
};
const entityFields = (entity) => ({ label: u64(entity.label), id: u64(entity.id) });
const fixedFields = (fixed) => ({ mag: u64(fixed.mag), sign: boolean(fixed.sign) });
const inventoryFields = (items) => {
  if (!Array.isArray(items)) throw new TypeError('Expected an ordered inventory array');
  return items.map((item) => ({ product: u64(item.product), amount: u64(item.amount) }));
};

// Ordered objects are Cairo structs/tuples; CallData adds lengths only for spans.
const fingerprint = (fields) => BigInt(ec.starkCurve.poseidonHashMany(CallData.compile(fields).map(BigInt)));

const getActionEvidenceSlot = ({ kind, entity, slot = 0 }) => {
  if (!ACTION_KINDS.includes(kind)) throw new RangeError(`Unsupported action evidence kind: ${kind}`);
  const packed = Entity.packEntity({ label: toUnsignedBigInt(entity.label, 16), id: u64(entity.id) }, false);
  return BigInt(ec.starkCurve.poseidonHashMany([BigInt(shortString.encodeShortString(kind)), packed, u64(slot)]));
};

const getBuildingFingerprint = (entity, building) => fingerprint({
  entity: entityFields(entity),
  building_type: u64(building.building_type),
  planned_at: u64(building.planned_at),
  finish_time: u64(building.finish_time)
});

const getSampleFingerprint = (deposit) => fingerprint({
  status: u64(deposit.status),
  resource: u64(deposit.resource),
  initial_yield: u64(deposit.initial_yield),
  remaining_yield: u64(deposit.remaining_yield),
  finish_time: u64(deposit.finish_time),
  yield_eff: fixedFields(deposit.yield_eff)
});

const getExtractionFingerprint = (extractor) => fingerprint({
  extractor_type: u64(extractor.extractor_type),
  status: u64(extractor.status),
  output_product: u64(extractor.output_product),
  yield: u64(extractor.yield),
  destination: entityFields(extractor.destination),
  destination_slot: u64(extractor.destination_slot),
  finish_time: u64(extractor.finish_time)
});

const getProcessFingerprint = (processor) => fingerprint({
  processor_type: u64(processor.processor_type),
  status: u64(processor.status),
  running_process: u64(processor.running_process),
  output_product: u64(processor.output_product),
  recipes: fixedFields(processor.recipes),
  secondary_eff: fixedFields(processor.secondary_eff),
  destination: entityFields(processor.destination),
  destination_slot: u64(processor.destination_slot),
  finish_time: u64(processor.finish_time)
});

const getDeliveryFingerprint = (delivery) => fingerprint({
  origin: entityFields(delivery.origin),
  origin_slot: u64(delivery.origin_slot),
  dest: entityFields(delivery.dest),
  dest_slot: u64(delivery.dest_slot),
  finish_time: u64(delivery.finish_time),
  contents: inventoryFields(delivery.contents)
});

export default {
  getActionEvidenceSlot,
  getBuildingFingerprint,
  getSampleFingerprint,
  getExtractionFingerprint,
  getProcessFingerprint,
  getDeliveryFingerprint
};
