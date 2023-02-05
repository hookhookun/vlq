import {bitsInByte, chunkSizeChunkBits, chunkSizeOffset} from './constants.mjs';

interface ReaderState {
    byteOffset: number,
    bitOffset: number,
}

const listBlocks = function* (view: DataView, blockSize: number, readerState: ReaderState) {
    let block = 0;
    let writtenBits = 0;
    const {byteLength} = view;
    let remainingBits = bitsInByte - readerState.bitOffset;
    for (let i = readerState.byteOffset; i < byteLength; i++) {
        const byte = view.getUint8(i);
        while (0 < remainingBits) {
            const bitsToWrite = Math.min(remainingBits, blockSize - writtenBits);
            const masked = Math.floor((byte % (2 ** remainingBits)) / (2 ** (remainingBits - bitsToWrite)));
            remainingBits -= bitsToWrite;
            readerState.bitOffset = bitsInByte - remainingBits;
            writtenBits += bitsToWrite;
            if (blockSize <= writtenBits) {
                yield block + masked;
                block = 0;
                writtenBits = 0;
            } else {
                block += masked * (2 ** (blockSize - writtenBits));
            }
        }
        remainingBits = bitsInByte;
        readerState.byteOffset += 1;
        readerState.bitOffset = 0;
    }
};

const listValues = function* (view: DataView, chunkSize: number, readerState: ReaderState) {
    const base = 2 ** chunkSize;
    let value = 0;
    for (const block of listBlocks(view, chunkSize + 1, readerState)) {
        const chunk = block % base;
        value += chunk;
        if (block < base) {
            yield value;
            value = 0;
        } else if (0 < chunk) {
            value = value * (2 ** chunkSize);
        } else {
            break;
        }
    }
};

export const decode = function* (encoded: ArrayBuffer): Generator<number> {
    const view = new DataView(encoded);
    const readerState: ReaderState = {byteOffset: 0, bitOffset: 0};
    let chunkSize = 1;
    for (const value of listValues(view, chunkSizeChunkBits, readerState)) {
        chunkSize = value + chunkSizeOffset;
        break;
    }
    yield* listValues(view, chunkSize, readerState);
};

export const decodeToArray = (encoded: ArrayBuffer) => [...decode(encoded)];
