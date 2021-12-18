[@hookun/vlq](README.md) / Exports

# @hookun/vlq

## Table of contents

### Functions

- [decode](modules.md#decode)
- [encode](modules.md#encode)
- [findEfficientChunkSize](modules.md#findefficientchunksize)
- [getBitLength](modules.md#getbitlength)
- [getTotalBitLength](modules.md#gettotalbitlength)

## Functions

### decode

▸ `Const` **decode**(`encoded`): `Generator`<`number`, `any`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoded` | `ArrayBuffer` |

#### Returns

`Generator`<`number`, `any`, `unknown`\>

#### Defined in

[decode.ts:3](https://github.com/hookhookun/vlq/blob/0bb522a/src/decode.ts#L3)

___

### encode

▸ `Const` **encode**(`data`, `requestedChunkSize?`): `ArrayBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `number`[] |
| `requestedChunkSize?` | `number` |

#### Returns

`ArrayBuffer`

#### Defined in

[encode.ts:6](https://github.com/hookhookun/vlq/blob/0bb522a/src/encode.ts#L6)

___

### findEfficientChunkSize

▸ `Const` **findEfficientChunkSize**(`data`, `bitLengthList?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `number`[] |
| `bitLengthList` | `number`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `bitLength` | `number` |
| `chunkSize` | `number` |

#### Defined in

[findEfficientChunkSize.ts:4](https://github.com/hookhookun/vlq/blob/0bb522a/src/findEfficientChunkSize.ts#L4)

___

### getBitLength

▸ `Const` **getBitLength**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[getBitLength.ts:1](https://github.com/hookhookun/vlq/blob/0bb522a/src/getBitLength.ts#L1)

___

### getTotalBitLength

▸ `Const` **getTotalBitLength**(`data`, `chunkSize`, `bitLengthList?`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `number`[] |
| `chunkSize` | `number` |
| `bitLengthList` | `number`[] |

#### Returns

`number`

#### Defined in

[getTotalBitLength.ts:3](https://github.com/hookhookun/vlq/blob/0bb522a/src/getTotalBitLength.ts#L3)
