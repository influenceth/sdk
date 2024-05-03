[![npm version](https://badge.fury.io/js/@influenceth%2Fsdk.svg)](https://badge.fury.io/js/@influenceth%2Fsdk)

# Influence SDK
Utilities / SDK / API docs for interacting with Influence. The SDK is licensed under permissive open source licenses to encourage its use.
More information can be found in the LICENSE files.

## Starknet Migration Information
Prior to the launch of Influence: Exploitation, a snapshot was taken of the asteroid and crewmate collections which
have lived on Ethereum since the "Arrival" sale. As of block number `17794088` the asteroid ownership and names, and
the crewmate names were saved, to be seeded into the initial Influence state on Starknet. Additionally, the asteroid
bonuses, purchase order, spectral type, radius, and orbital elements were saved to support a Merkle-tree driven seed
of the information on Starknet.

Copies of both snapshots and the asteroid Merkle tree are preserved on IPFS here:
- Asteroids snapshot: https://influence.infura-ipfs.io/ipfs/QmdJ7kY74efg8PvcbZ7AzuVdfZAksUiAVUL7koznvYWUq4
- Asteroids Merkle Tree: https://influence.infura-ipfs.io/ipfs/QmVS9yNQWMumTJ6wJLrMetKxyiEysuKZaoGjaTMQJTmjty
- Crewmate snapshot: https://influence.infura-ipfs.io/ipfs/QmPjtFx2b8gx4kBEX3xZmCafmyWdfDj8UkNqfQGmFvtg4U

A utility is also available at `utils/generateAsteroidMerkle.js` to generate the Merkle tree from the snapshot.

## Snapshot Details
At the time of the snapshot:
- 8,650 asteroids had been used to mint an Arvad Crewmate
- an additional 13 Arvad Department heads had been minted
- The last crewmate minted on L1 was ID: 8663
- 11,468 asteroids had been minted
- 2,450 of the first 11,100 minted can still be used to mint an Arvad Crewmate
- The last 368 asteroids are eligible to claim an Adalian Crewmate on L2
- The first 1,859 asteroids are eligible to claim an Arrival Starter Pack on L2

## Contracts

### ABIs
Smart contract ABIs can be included with `import { starknetContracts, ethereumContracts } from '@influenceth/sdk'` and utilized with Starknetjs, Ethers, Web3js.

### Components
All state in Influence is stored as components on the Dispatcher contract and can be accessed via a special system action `ReadComponent`.
Components are addressed by a key, typically the entity, and component name. For some components, the key is complex and includes multiple fields.
Call the `ReadComponent` system like: `Dispatcher.run_system('ReadComponent', { name: 'ComponentName', path: [ entity, key2, ... ]}`

Below is a list of schemas for all components:

* `Building` with keys `[ entityUuid ]` and response:
```
status: u64,
building_type: u64,
planned_at: u64, // time construction started
finish_time: u64 // time construction will finish
```
* `Celestial` with keys `[ entityUuid ]` and response:
```
celestial_type: u64,
mass: f128::Fixed, // mass in tonnes
radius: f64::Fixed, // radius in km
purchase_order: u64,
scan_status: u64,
scan_finish_time: u64,
bonuses: u64, // in bonus order either true or false (1st bit is empty, used to indicate scan status)
abundances: felt252 // abundances in resource type order in thousandths
```
* `Control` with keys `[ entityUuid ]` and response:
```
controller: Entity
```
* `Crew` with keys `[ entityUuid ]` and response:
```
delegated_to: ContractAddress,
roster: Span<u64>, // up to 5 crewmates
last_fed: u64, // timestamp in seconds when the crew *would have had* full food
ready_at: u64, // timestamp in seconds
action_type: u64, // the type of the last action taken by the crew
action_target: Entity, // the target of the last action taken by the crew
action_round: u64, // the committed round to use for randomness for action events,
action_weight: u64, // the weight of the last action taken by the crew (based on time / value)
action_strategy: u64 // the randomness strategy used for random events
```
* `Crewmate` with keys `[ entityUuid ]` and response:
```
status: u64,
collection: u64,
class: u64,
title: u64,
appearance: u128,
cosmetic: Span<u64>, // up to 6 traits
impactful: Span<u64> // up to 6 traits
```
* `Delivery` with keys `[ entityUuid ]` and response:
```
status: u64,
origin: Entity,
origin_slot: u64,
dest: Entity,
dest_slot: u64,
finish_time: u64,
contents: Span<InventoryItem>
```
* `Deposit` with keys `[ entityUuid ]` and response:
```
status: u64,
resource: u64,
initial_yield: u64,
remaining_yield: u64,
finish_time: u64, // time when core sampling is complete
yield_eff: f64::Fixed
```
* `Dock` with keys `[ entityUuid, slot ]` and response:
```
dock_type: u64,
docked_ships: u64, // current # of docked ships
ready_at: u64 // when the next ship can arrive or depart
```
* `DryDock` with keys `[ entityUuid, slot ]` and response:
```
dry_dock_type: u64,
status: u64,
output_ship: Entity,
finish_time: u64
```
* `Exchange` with keys `[ entityUuid ]` and response:
```
exchange_type: u64,
maker_fee: u64, // fee in ten thousandths (i.e. 0.25% == 25)
taker_fee: u64, // fee in ten thousandths
orders: u64, // count of open orders
allowed_products: Span<u64> // whitelist of products allowed for trading on exchange
```
* `Extractor` with keys `[ entityUuid, slot ]` and response:
```
extractor_type: u64,
status: u64,
output_product: u64,
yield: u64, // in units
destination: Entity,
destination_slot: u64,
finish_time: u64 // time when extractor run completes
```
* `Inventory` with keys `[ entityUuid, slot ]` and response:
```
inventory_type: u64,
status: u64,
mass: u64, // in g
volume: u64, // in cm^3
reserved_mass: u64, // in g
reserved_volume: u64, // in cm^3
contents: Span<InventoryItem>
```
* `Location` with keys `[ entityUuid ]` and response:
```
location: Entity
```
* `Name` with keys `[ entityUuid ]` and response:
```
name: String
```
* `Orbit` with keys `[ entityUuid ]` and response:
```
a: f128::Fixed, // semi-major axis (km)
ecc: f128::Fixed, // eccentricity
inc: f128::Fixed, // inclination (rad)
raan: f128::Fixed, // right ascension of the ascending node (rad)
argp: f128::Fixed, // argument of periapsis (rad)
m: f128::Fixed // mean anomaly (rad)
```
* `Order` with keys `[ crewEntityUuid, exchangeEntityUuid, orderType, product, price, storageEntityUuid, storageSlot ]` and response:
```
status: u64,
amount: u64,
valid_time: u64,
maker_fee: u64 // in units of 1/10000
```
* `PrivateSale` with keys `[ entityUuid ]` and response:
```
status: u64,
amount: u64
```
* `Processor` with keys `[ entityUuid ]` and response:
```
processor_type: u64,
status: u64,
running_process: u64,
output_product: u64, // the prioritized output product
recipes: Fixed, // in number of recipes
secondary_eff: Fixed, // efficiency of crew in reducing secondary output penalty
destination: Entity,
destination_slot: u64,
finish_time: u64
```
* `Ship` with keys `[ entityUuid ]` and response:
```
ship_type: u64,
status: u64,
ready_at: u64, // IRL unix time
variant: u64, // ship cosmetic variant (per ship type)
emergency_at: u64, // IRL unix time
transit_origin: Entity,
transit_departure: u64, // in-game time since EPOCH
transit_destination: Entity,
transit_arrival: u64 // in-game time since EPOCH
```
* `Station` with keys `[ entityUuid, slot ]` and response:
```
station_type: u64,
population: u64 // current population in # of crews
```
* `ContractPolicy` with keys `[ targetEntityUuid, permission ]` and response:
```
address: ContractAddress
```
* `PrepaidPolicy` with keys `[ targetEntityUuid, permission ]` and response:
```
rate: u64, // rate in SWAY per hour (3600 IRL seconds)
initial_term: u64, // initial term in seconds
notice_period: u64 // notice period in seconds
```
* `PublicPolicy` with keys `[ targetEntityUuid, permission ]` and response:
```
public: bool
```
* `ContractAgreement` with keys `[ targetEntityUuid, permission, permittedEntityUuid ]` and response:
```
address: ContractAddress
```
* `PrepaidAgreement` with keys `[ targetEntityUuid, permission, permittedEntityUuid ]` and response:
```
rate: u64, // rate in SWAY hour (3600 IRL seconds)
initial_term: u64, // initial term in seconds (0 makes it open ended)
notice_period: u64, // notice in seconds
start_time: u64, // time of agreement start (unix timestamp)
end_time: u64, // time of end based on payments (unix timestamp)
notice_time: u64 // time of notice
```
* `WhitelistAgreement` with keys `[ targetEntityUuid, permission, permittedEntityUuid ]` and response:
```
whitelisted: bool
```

## API
1. The API is whitelist only, please request access to the #community-devs channel in the Influence Discord: https://discord.gg/UHMqbznhJS to receive an API key.
2. If possible, prefer using the exports here: https://www.dropbox.com/sh/5g3ww8wi9n0p4s6/AADcR0lgL8iKTQrpiWUC37Oxa?dl=0 rather than adding additional load to the API.
3. These endpoints are located at https://api.influenceth.io (or api-goerli for testnet)

### Authenticating
1. Once you have a client_id and client_secret retrieve a JWT token by sending a `POST` request to `/v1/auth/token` with the following JSON body:
```json
{
  "grant_type": "client_credentials",
  "client_id": "[client_id]",
  "client_secret": "[client_secret]"
}
```
2. You'll receive back a JSON object with the token which does not expire (you can always request a new one if needed):
```json
{
  "access_token": "[access_token]",
  "token_type": "bearer"
}
```
3. Include the token in the header for any requests to the API as: `Authorization: Bearer [access_token]`
