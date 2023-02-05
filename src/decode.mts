import {bitsInByte, chunkSizeBits} from './constants.mjs';

const listBlocks = function* (view: DataView, blockSize: number) {
    let block = 0;
    let writtenBits = 0;
    const {byteLength} = view;
    let remainingBits = bitsInByte - chunkSizeBits;
    for (let i = 0; i < byteLength; i++) {
        const byte = view.getUint8(i);
        while (0 < remainingBits) {
            const bitsToWrite = Math.min(remainingBits, blockSize - writtenBits);
            const masked = (byte & ((1 << remainingBits) - 1)) >> (remainingBits - bitsToWrite);
            remainingBits -= bitsToWrite;
            writtenBits += bitsToWrite;
            if (blockSize <= writtenBits) {
                yield block | masked;
                block = 0;
                writtenBits = 0;
            } else {
                block |= masked << (blockSize - writtenBits);
            }
        }
        remainingBits = bitsInByte;
    }
};

export const decode = function* (encoded: ArrayBuffer): Generator<number> {
    const view = new DataView(encoded);
    const chunkSize = view.getUint8(0) >> (bitsInByte - chunkSizeBits);
    const chunkMask = (1 << chunkSize) - 1;
    let value = 0;
    for (const block of listBlocks(view, chunkSize + 1)) {
        value |= block & chunkMask;
        if (block <= chunkMask) {
            yield value;
            value = 0;
        } else if (0 < (block & chunkMask)) {
            value = value << chunkSize;
        } else {
            break;
        }
    }
};

export const decodeToArray = (encoded: ArrayBuffer) => [...decode(encoded)];
