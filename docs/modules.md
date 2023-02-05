[@hookun/vlq](README.md) / Exports

# @hookun/vlq

## Table of contents

### Variables

- [bitsInByte](modules.md#bitsinbyte)
- [chunkSizeChunkBits](modules.md#chunksizechunkbits)
- [chunkSizeOffset](modules.md#chunksizeoffset)

### Functions

- [decode](modules.md#decode)
- [decodeToArray](modules.md#decodetoarray)
- [encode](modules.md#encode)
- [encodeToArrayBuffer](modules.md#encodetoarraybuffer)

## Variables

### bitsInByte

• `Const` **bitsInByte**: ``8``

#### Defined in

[constants.mts:1](https://github.com/hookhookun/vlq/blob/24c5d9b/src/constants.mts#L1)

___

### chunkSizeChunkBits

• `Const` **chunkSizeChunkBits**: ``3``

#### Defined in

[constants.mts:2](https://github.com/hookhookun/vlq/blob/24c5d9b/src/constants.mts#L2)

___

### chunkSizeOffset

• `Const` **chunkSizeOffset**: ``1``

#### Defined in

[constants.mts:3](https://github.com/hookhookun/vlq/blob/24c5d9b/src/constants.mts#L3)

## Functions

### decode

▸ **decode**(`encoded`): `Generator`<`number`, `any`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoded` | `ArrayBuffer` |

#### Returns

`Generator`<`number`, `any`, `unknown`\>

#### Defined in

[decode.mts:52](https://github.com/hookhookun/vlq/blob/24c5d9b/src/decode.mts#L52)

___

### decodeToArray

▸ **decodeToArray**(`encoded`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoded` | `ArrayBuffer` |

#### Returns

`number`[]

#### Defined in

[decode.mts:63](https://github.com/hookhookun/vlq/blob/24c5d9b/src/decode.mts#L63)

___

### encode

▸ **encode**(`data`, `requestedChunkSize?`): `Generator`<`number`, `any`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Iterable`<`number`\> |
| `requestedChunkSize?` | `number` |

#### Returns

`Generator`<`number`, `any`, `unknown`\>

#### Defined in

[encode.mts:115](https://github.com/hookhookun/vlq/blob/24c5d9b/src/encode.mts#L115)

___

### encodeToArrayBuffer

▸ **encodeToArrayBuffer**(`data`, `requestedChunkSize?`): `ArrayBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Iterable`<`number`\> |
| `requestedChunkSize?` | `number` |

#### Returns

`ArrayBuffer`

#### Defined in

[encode.mts:120](https://github.com/hookhookun/vlq/blob/24c5d9b/src/encode.mts#L120)
