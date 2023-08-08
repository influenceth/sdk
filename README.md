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
- Asteroids snapshot: https://influence.infura-ipfs.io/ipfs/QmXHV29r6KeqVMLVDnbru44hRLQGi46qnSCqU53BRtJkfG
- Asteroids Merkle Tree: https://influence.infura-ipfs.io/ipfs/QmVS9yNQWMumTJ6wJLrMetKxyiEysuKZaoGjaTMQJTmjty
- Crewmate snapshot: https://influence.infura-ipfs.io/ipfs/QmPjtFx2b8gx4kBEX3xZmCafmyWdfDj8UkNqfQGmFvtg4U

A utility is also available at `utils/generateAsteroidMerkle.js` to generate the Merkle tree from the snapshot.

## Contract ABIs
Smart contract ABIs can be included with `import { starknetContracts, ethereumContracts } from '@influenceth/sdk'` and utilized with Starknetjs, Ethers, Web3js.

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
