[![npm version](https://badge.fury.io/js/@influenceth%2Fsdk.svg)](https://badge.fury.io/js/@influenceth%2Fsdk)

# Influence SDK
Utilities / SDK / API docs for interacting with Influence. The SDK is licensed under permissive open source licenses to encourage its use.
More information can be found in the LICENSE files.

## Contracts

### Ethereum Mainnet Addresses
- Asteroid NFT: 0x6e4c6D9B0930073e958ABd2ABa516b885260b8Ff
- CrewmateV1 NFT: 0x746Db7B1728aF413C4e2b98216C6171B2FC9D00e
- CrewmateV2 NFT: 0xB5CC57cD1f9a9bE85a50604b0591A53d89Bd4884
- Crew NFT: 0x3F83184227663E6B6Fa1B0e7Ea64FcA505C2bA6a
- Ship NFT: 0xE1791C021261FAFbE095b843cdA40A2F9812D233
- SWAY Token: 0x9DE7f7a6c0B00902983c6f0658E157A8a684Cfd5

### Starknet Mainnet Addresses
- Influence Dispatcher: 0x0422d33a3638dcc4c62e72e1d6942cd31eb643ef596ccac2351e0e21f6cd4bf4
- Asteroid NFT: 0x0603cf837055c64d026a3c5a9e3a83036cea6c4a3f68a9e19f7a687d726fe817
- Crewmate NFT: 0x0241b9c4ce12c06f49fee2ec7c16337386fa5185168f538a7631aacecdf3df74
- Crew NFT: 0x07280a807c8b79379bec87919433b7b836b93a92e6d71b24ee99f4ffe33dd337
- Ship NFT: 0x04369e47e647ab5fc4d36cee26590276b99a89a83fc3306462d21d366611fde3
- SWAY Token: 0x004878d1148318a31829523ee9c6a5ee563af6cd87f90a30809e5b0d27db8a9b

### ABIs
Smart contract ABIs can be included with `import { starknetContracts, ethereumContracts } from '@influenceth/sdk'` and utilized with Starknetjs, Ethers, Web3js.

### Components
All state in Influence is stored as components on the Dispatcher contract and can be accessed via a special system action `ReadComponent`.
Components are addressed by a key, typically the entity, and component name. For some components, the key is complex and includes multiple fields.
For example, the `Crew` component is addressed by the crew's packed entity UUID:
```js
Dispatcher.call('run_system', Dispatcher.callData.compile('run_system', {
  name: 'ReadComponent', calldata: [ 'Crew', 1, Entity.packEntity({ label: Entity.IDS.CREW, id: 4938 }) ]
}));
```

ABI types / schemas for all components can be found in `./contracts/starknet_components.json`.

## API
1. The API is whitelist only, please request access to the #community-devs channel in the Influence Discord: https://discord.gg/influenceth to receive an API key.
2. If possible, prefer using the exports here: https://www.dropbox.com/sh/5g3ww8wi9n0p4s6/AADcR0lgL8iKTQrpiWUC37Oxa?dl=0 rather than adding additional load to the API.
3. These endpoints are located at https://api.influenceth.io (or https://api-prerelease.influenceth.io for Sepolia testnet)

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
- I love Influence
