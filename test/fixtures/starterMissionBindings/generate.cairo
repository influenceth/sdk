use core::debug::PrintTrait;
use influence::components::{Deposit, Extractor, Processor, ProcessType, Building, Delivery};
use influence::types::{Entity, EntityTrait, InventoryItem};
use influence::systems::missions::starter::{key, building_fingerprint};
use cubit::f64::Fixed;

fn packed(entity: Entity) -> felt252 { entity.into() }

fn dump<T, impl S: Serde<T>, impl D: Drop<T>>(name: felt252, value: @T) -> felt252 {
    let mut serialized = array![];
    Serde::<T>::serialize(value, ref serialized);
    let hash = poseidon::poseidon_hash_span(serialized.span());
    name.print();
    serialized.print();
    hash.print();
    hash
}

#[test]
fn sdk_binding_fixtures() {
    let entity = Entity { label: 5, id: 9007199254740993 };
    let destination = Entity { label: 5, id: 77 };
    let kinds = array!['Built', 'Sample', 'Extraction', 'Process', 'Downstream', 'Delivery', 'EconomicDelivery'];
    let mut i = 0;
    loop {
        if i == kinds.len() { break; }
        let kind = *kinds.at(i);
        let hash = dump(kind, @(kind, packed(entity), 2_u64));
        assert(hash == key(kind, entity, 2), 'key mismatch');
        i += 1;
    };
    dump('key_label', @('Process', packed(Entity { label: 7, ..entity }), 2_u64));
    dump('key_id', @('Process', packed(Entity { id: 9007199254740994, ..entity }), 2_u64));
    dump('key_slot', @('Process', packed(entity), 3_u64));
    dump('key_zero', @('Built', packed(entity), 0_u64));
    let building = Building { status: 3, building_type: 5, planned_at: 1700000000, finish_time: 1700001000 };
    let hash = dump('building', @(entity, building.building_type, building.planned_at, building.finish_time));
    assert(hash == building_fingerprint(entity, building), 'building mismatch');
    let deposit = Deposit { status: 1, resource: 6, initial_yield: 500001, remaining_yield: 450000, finish_time: 1700001001, yield_eff: Fixed { mag: 9007199254740993, sign: true } };
    dump('sample', @deposit);
    dump('sample_changed', @Deposit { finish_time: 1700001002, ..deposit });
    let extractor = Extractor { extractor_type: 1, status: 1, output_product: 6, yield: 123456789, destination, destination_slot: 2, finish_time: 1700001002 };
    dump('extraction', @extractor);
    let processor = Processor { processor_type: 1, status: 1, running_process: 23, output_product: 2, recipes: Fixed { mag: 9007199254740995, sign: false }, secondary_eff: Fixed { mag: 5368709121, sign: true }, destination, destination_slot: 2, finish_time: 1700001003 };
    let definition = ProcessType { setup_time: 7200, recipe_time: 56160, batched: false, processor_type: 1, inputs: array![InventoryItem { product: 24, amount: 1800 }, InventoryItem { product: 1, amount: 3 }].span(), outputs: array![InventoryItem { product: 23, amount: 1600 }, InventoryItem { product: 2, amount: 200 }].span() };
    dump('process', @(processor, definition));
    dump('process_changed', @(processor, ProcessType { recipe_time: 56161, ..definition }));
    let delivery = Delivery { status: 4, origin: entity, origin_slot: 2, dest: destination, dest_slot: 3, finish_time: 1700001004, contents: array![InventoryItem { product: 129, amount: 9007199254740993 }, InventoryItem { product: 2, amount: 7 }].span() };
    dump('delivery', @(delivery.origin, delivery.origin_slot, delivery.dest, delivery.dest_slot, delivery.finish_time, delivery.contents));
    let complete = Delivery { status: 2, ..delivery };
    dump('delivery_complete', @(complete.origin, complete.origin_slot, complete.dest, complete.dest_slot, complete.finish_time, complete.contents));
}
