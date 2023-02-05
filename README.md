# @hookun/vlq

[![codecov](https://codecov.io/gh/hookun/vlq/branch/master/graph/badge.svg)](https://codecov.io/gh/hookun/vlq)
[![.github/workflows/push.yml](https://github.com/hookhookun/vlq/actions/workflows/push.yml/badge.svg)](https://github.com/hookhookun/vlq/actions/workflows/push.yml)
[![.github/workflows/publish.yml](https://github.com/hookhookun/vlq/actions/workflows/publish.yml/badge.svg)](https://github.com/hookhookun/vlq/actions/workflows/publish.yml)

A tool to encode/decode arbitrary unsigned integers using predefined-length chunk of bits.

## Usage

```javascript
import {encodeToArrayBuffer, decodeToArray} from '@hookhookun/vlq';
const data = [1, 2, 3, 4];
const encoded1 = encodeToArrayBuffer(data, 1);
console.info(Buffer.from(encoded1).toString('hex'));
// 073788
console.info(Buffer.from(encoded1).toString('base64url'));
// BzeI
console.info(decodeToArray(encoded1));
// [ 1, 2, 3, 4 ]
const encoded2 = encodeToArrayBuffer(data, 2);
console.info(Buffer.from(encoded1).toString('hex'));
// 129d10
console.info(Buffer.from(encoded1).toString('base64url'));
// Ep0Q
console.info(decodeToArray(encoded1));
// [ 1, 2, 3, 4 ]
```

## Install

```
npm install @hookun/vlq
```

## API document

[docs/modules.md](https://github.com/hookun/vlq/docs/modules.md)

## Format of encoded binary

```
Encoded     = ChunkSize -> Data -> EndOfChunks
ChunkSize   = Value(3,C-1)
Data        = *Value(C,x)
EndOfChunks = SB(C,0)
Value(n,x)  = *SB(n,x1) -> LSB(n,x0)
SB(n,x)     = 1xxxxxxxxxxx
               | <- n -> |
LSB(n,y)    = 0yyyyyyyyyyy
```

The binary representation of `ChunkSize` is 1 less than the actual value.

### Example: `Value(1+n)` and `EndOfChunks` (`EOC`)

Assume that ChunkSize is 1.

|  `x`|     `Value(1,x)`|
|----:|----------------:|
|    0|             `00`|
|    1|             `01`|
|    2|          `11 00`|
|    3|          `11 01`|
|    4|       `11 10 00`|
|    5|       `11 10 01`|
|    8|    `11 10 10 00`|
|   16| `11 10 10 10 00`|
|  EOC|             `10`|

Assume that ChunkSize is 2.

|  `x`|     `Value(2,x)`|
|----:|----------------:|
|    0|            `000`|
|    1|            `001`|
|    2|            `010`|
|    3|            `011`|
|    4|        `101 000`|
|    5|        `101 001`|
|    8|        `110 000`|
|   16|    `101 100 000`|
|   32|    `110 100 000`|
|   64|`101 100 100 000`|
|  EOC|            `100`|

Assume that ChunkSize is 3.

|  `x`|    `Value(3,x)`|
|----:|---------------:|
|    0|          `0000`|
|    1|          `0001`|
|    2|          `0010`|
|    3|          `0011`|
|    4|          `0100`|
|    8|     `1001 0000`|
|   16|     `1010 0000`|
|   32|     `1100 0000`|
|   64|`1001 1000 0000`|
|  EOC|          `1000`|

### Example: `Encoded`

Assume that Data is `[1, 2, 3, 4]` ChunkSize is 1.

```
EndOfChunks = 10
Data        = 01 11 00 11 01 11 10 00
ChunkSize   = 0000
Encoded     = 0000 01 11 00 11 01 11 10 00 10
            = ChunkSize -> Data -> EndOfChunks
            = 0000011100110111100010
            = 0000 0111 0011 0111 1000 10(00)
            =    0    7    3    7    8     8
            = 0x073788
```

Assume that Data is `[1, 2, 3, 4]` ChunkSize is 2.

```
EndOfChunks = 100
Data        = 001 010 011 101 000
ChunkSize   = 0001
Encoded     = 0001 001 010 011 101 000 100
            = ChunkSize -> Data -> EndOfChunks
            = 0001001010011101000100
            = 0001 0010 1001 1101 0001 00(00)
            =    1    2    9    d    1     0
            = 0x129d10
```

### Example: decoding `0x51450f2880`

```
Encoded =    5   1   4   5   0   f   2   8   8   0
        = 0101000101000101000011110010100010000000
          ^^^^|          <-   Data   ->          |
```
Since `ChunkSize` is 5, divide `Data` into (5+offset+flag bit)=(5+1+1)=7 bits each.

```
Data = 0001010 0010100 0011110 0101000 1000000 0
     =      10      20      30      40     EOC
     = [10, 20, 30, 40]
```

## License

[Apache License, Version 2.0](LICENSE.txt)
