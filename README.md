# influence-utils
Utilities / SDK / API docs for interacting with Influence

## Utilities
1. Install the utilities in your project with `npm install --save influence-utils`
2. Include with either `import utils from 'influence-utils'` or import { toBonuses } from 'influence-utils' to include specific methods
3. Find documentation for (most) methods at https://github.com/Influenceth/influence-utils/blob/master/index.js

## Contract ABIs
Ethereum smart contract ABIs can be included with `import { contracts } from 'influence-utils'` and utilized with either Etherjs or Web3.

## API
1. The API is whitelist only, please request access to the #community-devs channel in the Influence Discord: https://discord.gg/UHMqbznhJS to receive an API key.
2. If possible, prefer using the exports here: https://www.dropbox.com/sh/5g3ww8wi9n0p4s6/AADcR0lgL8iKTQrpiWUC37Oxa?dl=0 rather than putting additional load on the API.
3. These endpoints are located at https://api.influenceth.io (or api-staging for testnet)

### Authenticating
1. Once you have a client_id and client_secret retrieve a JWT token by sending a `POST` request to `/v1/auth.token` with the following JSON body:
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

### GET /v1/asteroids
Returns an array of asteroids matching the given query. This can be a heavy query depending on the specific set of filters and will be rate-limited. Recommend utilizing the export at https://www.dropbox.com/sh/5g3ww8wi9n0p4s6/AADcR0lgL8iKTQrpiWUC37Oxa?dl=0 instead.

Pagination is supported and preferred if possible. Pagination params:
- `perPage=10`
- `page=3`

If you need a total to support pagination, call your query along with `count=true`.

Query params include:
- `radiusMin=1000` & `radiusMax=376000`
- `spectralType=0,3,7`
- `axisMin=0.8` & `axisMax=4`
- `incMin=0` & `incMax=0.7`
- `eccMin=0` & `eccMax=1`
- `ownedBy=owned,unowned`

Example response:
```json
[
    {
        "i": 1,
        "orbital": {
            "a": 2.192,
            "e": 0.325,
            "i": 0.002443460952792061,
            "o": 3.4108969571725183,
            "w": 5.283809777487633,
            "m": 0.9480628496833199
        }
    },
    {
        "i": 2,
        "orbital": {
            "a": 1.645,
            "e": 0.125,
            "i": 0.31956978604016173,
            "o": 2.198591258737257,
            "w": 3.9414770497787943,
            "m": 3.036000233844136
        }
    },
    {
        "i": 3,
        "orbital": {
            "a": 1.765,
            "e": 0.165,
            "i": 0.08342673824532895,
            "o": 4.1469023027385274,
            "w": 4.5211008943661115,
            "m": 3.912330051270489
        }
    },
    {
        "i": 4,
        "orbital": {
            "a": 3.912,
            "e": 0.05,
            "i": 0.03246312408709453,
            "o": 0.13194689145077132,
            "w": 4.191582731589582,
            "m": 2.042558823608964
        }
    },
    {
        "i": 5,
        "orbital": {
            "a": 1.43,
            "e": 0.265,
            "i": 0.08412486994612668,
            "o": 4.698251813443536,
            "w": 4.508883589602151,
            "m": 2.8974210912357865
        }
    },
    {
        "i": 6,
        "orbital": {
            "a": 2.447,
            "e": 0.269,
            "i": 0.04974188368183839,
            "o": 2.1395991300198487,
            "w": 3.312111321509639,
            "m": 0.9262462340333908
        }
    }
]
```
### GET /v1/asteroids/:id
Returns the full details for a specific asteroid with the given token ID

Example response:
```json
{
    "orbital": {
        "a": 2.192,
        "e": 0.325,
        "i": 0.002443460952792061,
        "o": 3.4108969571725183,
        "w": 5.283809777487633,
        "m": 0.9480628496833199
    },
    "p": {
        "x": 2.625601517,
        "y": -0.1567431091,
        "z": 0.0020761233
    },
    "events": [],
    "i": 1,
    "r": 375142,
    "baseName": "TG-29980",
    "seed": "0xc724751ccde05a7706fc8a93757fa3783eda21e98941d100b254017f455576ab",
    "spectralType": 0,
    "name": "TG-29980",
    "rawBonuses": 1,
    "scanning": false,
    "owner": "0x...",
    "purchaseOrder": 0,
    "asteroidId": 1,
    "radius": 375142,
    "position": {
        "x": 2.625601517,
        "y": -0.1567431091,
        "z": 0.0020761233
    },
    "scanned": true,
    "bonuses": [
        {
            "name": "Yield0",
            "level": 0,
            "modifier": 0,
            "type": "yield"
        },
        {
            "name": "Volatile0",
            "level": 0,
            "modifier": 0,
            "type": "volatile"
        },
        {
            "name": "Organic0",
            "level": 0,
            "modifier": 0,
            "type": "organic"
        }
    ]
}
```

### GET /v1/asteroids/ownedCount
Returns a count of the total number of asteroids minted (excluding Adalia Prime).

### GET /v1/crew
Requires the `owner` wallet address as a `GET` param and returns all owned crew members

Example response:
```json
[
    {
        "i": 1,
        "owner": "0x...",
        "crewCollection": 2,
        "sex": 2,
        "body": 7,
        "crewClass": 3,
        "title": 6,
        "outfit": 11,
        "hair": 8,
        "facialFeature": 0,
        "hairColor": 3,
        "headPiece": 1,
        "bonusItem": 0,
        "id": null
    },
    {
        "i": 2,
        "owner": "0x...",
        "crewCollection": 2,
        "sex": 2,
        "body": 11,
        "crewClass": 2,
        "title": 20,
        "outfit": 11,
        "hair": 6,
        "facialFeature": 1,
        "hairColor": 2,
        "headPiece": 2,
        "bonusItem": 0
    }
]
```

### GET /v1/crew/:id
Returns details for the crew member with the given token ID

Example response:
```json
{
    "i": 2,
    "owner": "0x...",
    "crewCollection": 2,
    "sex": 2,
    "body": 11,
    "crewClass": 2,
    "title": 20,
    "outfit": 11,
    "hair": 6,
    "facialFeature": 1,
    "hairColor": 2,
    "headPiece": 2,
    "bonusItem": 0
}
```
### GET /v1/crew/mintable
Requires the `owner` wallet address as a `GET` param and returns all asteroids that can be used to mint crew members

Example response:
```json
[
    {
        "orbital": {
            "a": 1.468,
            "e": 0.15,
            "i": 0.05061454830783556,
            "o": 5.5295521361684346,
            "w": 3.8781215979314,
            "m": 5.24768146197135
        },
        "p": {
            "x": -0.0954678831,
            "y": 1.4130865146,
            "z": 0.0488901288
        },
        "i": 779,
        "r": 15875,
        "baseName": "WQ-374",
        "seed": "0xf73d017683ad270dd9eb8aa200563e7db1238557abf520d9c13e7913e89916df",
        "spectralType": 6,
        "name": "WQ-374",
        "owner": "0x...",
        "purchaseOrder": 1867,
        "asteroidId": 779,
        "radius": 15875,
        "position": {
            "x": -0.0954678831,
            "y": 1.4130865146,
            "z": 0.0488901288
        },
        "scanned": false,
        "bonuses": []
    },
    {
        "orbital": {
            "a": 1.651,
            "e": 0.169,
            "i": 0.07278022980816354,
            "o": 1.6390387005478748,
            "w": 1.218239817892042,
            "m": 5.022533988464082
        },
        "p": {
            "x": 1.8097798502,
            "y": 0.4743598036,
            "z": -0.1340004644
        },
        "i": 923,
        "r": 14646,
        "baseName": "SG-1364",
        "seed": "0x5d420554ae45c5db06f182a5e3cef883ed45a197ab6dfb8fb7a955a32dc43308",
        "spectralType": 0,
        "name": "SG-1364",
        "owner": "0x...",
        "purchaseOrder": 1868,
        "asteroidId": 923,
        "radius": 14646,
        "position": {
            "x": 1.8097798502,
            "y": 0.4743598036,
            "z": -0.1340004644
        },
        "scanned": false,
        "bonuses": []
    }
]
```

### GET /v1/planets
Returns details for the five Adalian planets including orbital elements. Also available on the Dropbox at https://www.dropbox.com/sh/5g3ww8wi9n0p4s6/AADcR0lgL8iKTQrpiWUC37Oxa?dl=0 as an export.

Example (only) response:
```json
[
    {
        "orbital": {
            "a": 0.258,
            "e": 0.178,
            "i": 0.11152653920243764,
            "o": 4.833340297547896,
            "w": 0.8648106443631903,
            "m": 1.6304865872131027
        },
        "p": {
            "x": 0.0479945328,
            "y": 0.2641258032,
            "z": 0.008904696
        },
        "i": 1,
        "r": 1937420,
        "planetType": 1
    },
    {
        "orbital": {
            "a": 0.781,
            "e": 0.029,
            "i": 0.0317649923862968,
            "o": 5.578944953999875,
            "w": 1.3243558364132972,
            "m": 4.321784293788359
        },
        "p": {
            "x": 0.1390119687,
            "y": -0.7776877447,
            "z": -0.0159728284
        },
        "i": 2,
        "r": 2910672,
        "planetType": 1
    },
    {
        "orbital": {
            "a": 3.912,
            "e": 0.013,
            "i": 0.004886921905584122,
            "o": 5.893104219358853,
            "w": 1.1016518238588209,
            "m": 4.5903904656702865
        },
        "p": {
            "x": 2.0943090074,
            "y": -3.3122566014,
            "z": -0.0110789597
        },
        "i": 3,
        "r": 69120870,
        "planetType": 2
    },
    {
        "orbital": {
            "a": 7.249,
            "e": 0.042,
            "i": 0.008377580409572781,
            "o": 6.2219242504345855,
            "w": 5.75277974749851,
            "m": 3.1202996367154623
        },
        "p": {
            "x": -6.1856739718,
            "y": 4.3347561696,
            "z": 0.0330747975
        },
        "i": 4,
        "r": 41059721,
        "planetType": 2
    },
    {
        "orbital": {
            "a": 9.206,
            "e": 0.037,
            "i": 0.01239183768915974,
            "o": 1.614080492244356,
            "w": 4.5069637274249565,
            "m": 3.8613664371122542
        },
        "p": {
            "x": -8.2596043115,
            "y": -4.6259463903,
            "z": 0.1047416192
        },
        "i": 5,
        "r": 19559342,
        "planetType": 2
    }
]
```

## Image API

The following endpoints are located at https://images.influenceth.io (or images-staging for testnet)

### GET /v1/asteroids/:id/image.svg
Returns the asteroid card generally displayed in OpenSea. This will be *aggressively* rate-limited as it is a high-bandwidth call. Consider using the OpenSea API as well: https://docs.opensea.io/reference/api-overview

### GET /v1/crew/:id/image.svg
Returns the crew card generally displayed in OpenaSea. This will be *aggressivel* rate-limited as it is a high bandwidth call. Consider using the OpenSea API as well: https://docs.opensea.io/reference/api-overview
