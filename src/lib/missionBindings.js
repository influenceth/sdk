import { CallData, ec, shortString } from 'starknet';
import Entity from './entity.js';
import { toUnsignedBigInt } from './mission.js';
const ACTION_KINDS = ['Sample', 'Extraction', 'Process', 'Downstream', 'Delivery', 'EconomicDelivery'];
const u64 = (value) => toUnsignedBigInt(value, 64);
const entityFields = (entity) => ({ label: u64(entity.label), id: u64(entity.id) });
const fingerprint = (fields) => BigInt(ec.starkCurve.poseidonHashMany(CallData.compile(fields).map(BigInt)));

export const getActionEvidenceSlot = ({ kind, entity, slot = 0 }) => {
  if (!['Built', 'Used', ...ACTION_KINDS].includes(kind)) throw new RangeError(`Unsupported action evidence kind: ${kind}`);
  const packed = Entity.packEntity({ label: toUnsignedBigInt(entity.label, 16), id: u64(entity.id) }, false);
  return BigInt(ec.starkCurve.poseidonHashMany([BigInt(shortString.encodeShortString(kind)), packed, u64(slot)]));
};

export const getBuildingFingerprint = (entity, building) => fingerprint({
  entity: entityFields(entity),
  building_type: u64(building.building_type),
  planned_at: u64(building.planned_at),
  finish_time: u64(building.finish_time)
});
