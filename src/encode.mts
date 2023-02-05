import {bitsInByte, chunkSizeChunkBits, chunkSizeOffset} from './constants.mjs';

const getBitLength = (value: number): number => value === 0 ? 1 : Math.ceil(Math.log2(value + 1));

const arrayCache = new WeakMap<Iterable<number>, Array<number>>();
const iterate = function* (data: Iterable<number>): Generator<number> {
    let cached = arrayCache.get(data);
    if (cached) {
        for (const item of cached) {
            yield item;
        }
    } else {
        cached = [];
        let index = 0;
        for (const item of data) {
            yield item;
            cached[index++] = item;
        }
        arrayCache.set(data, cached);
    }
};

const getChunkSize = (data: Iterable<number>, requestedChunkSize?: number): number => {
    if (requestedChunkSize) {
        if (!(Number.isInteger(requestedChunkSize) && 0 < requestedChunkSize)) {
            throw new Error('chunkSize must be a positive integer.');
        }
        return requestedChunkSize;
    } else {
        const bitLengthMap = new Map<number, number>();
        let maxBitLength = 0;
        for (const value of iterate(data)) {
            const bitLength = getBitLength(value);
            bitLengthMap.set(bitLength, (bitLengthMap.get(bitLength) || 0) + 1);
            if (maxBitLength < bitLength) {
                maxBitLength = bitLength;
            }
        }
        let minTotalBitLength = Infinity;
        let candidate = 1;
        for (let chunkSize = 1; chunkSize <= maxBitLength; chunkSize++) {
            /** includes the end of chunks */
            let chunkCount = 1;
            for (const [bitLength, count] of bitLengthMap) {
                chunkCount += Math.ceil(bitLength / chunkSize) * count;
            }
            const totalBitLength = (1 + chunkSize) * chunkCount;
            if (totalBitLength < minTotalBitLength) {
                minTotalBitLength = totalBitLength;
                candidate = chunkSize;
            }
        }
        return candidate;
    }
};

const listEncodedBlocks = function* (data: Iterable<number>, chunkSize: number): Generator<number> {
    const base = 2 ** chunkSize;
    for (const valueToBeEncoded of iterate(data)) {
        for (let chunkIndex = Math.ceil(getBitLength(valueToBeEncoded) / chunkSize); 0 < chunkIndex--;) {
            yield (0 < chunkIndex ? base : 0) + (Math.floor(valueToBeEncoded / (2 ** (chunkSize * chunkIndex))) % base);
        }
    }
};

interface WriterState {
    byte: number,
    writtenBits: number,
}

const packBytes = function* (
    writerState: WriterState,
    blockSize: number,
    blocks: Iterable<number>,
): Generator<number> {
    let {byte, writtenBits} = writerState;
    for (const block of blocks) {
        // console.info(`b:${block.toString(2).padStart(blockSize, '0')}`);
        let consumedBits = 0;
        while (consumedBits < blockSize) {
            const remainingBits = blockSize - consumedBits;
            const writableBits = bitsInByte - writtenBits;
            const bitsToWrite = Math.min(writableBits, remainingBits);
            const maskedBlock = Math.floor((block % 2 ** remainingBits) / (2 ** (remainingBits - bitsToWrite)));
            byte += maskedBlock * (2 ** (writableBits - bitsToWrite));
            consumedBits += bitsToWrite;
            writtenBits += bitsToWrite;
            if (writtenBits === bitsInByte) {
                writtenBits = 0;
                yield byte;
                byte = 0;
            }
        }
    }
    writerState.byte = byte;
    writerState.writtenBits = writtenBits;
};

const listEncodedBytes = function* (data: Iterable<number>, chunkSize: number): Generator<number> {
    const writerState: WriterState = {byte: 0, writtenBits: 0};
    yield* packBytes(
        writerState,
        chunkSizeChunkBits + 1,
        listEncodedBlocks([chunkSize - chunkSizeOffset], chunkSizeChunkBits),
    );
    const blockSize = chunkSize + 1;
    yield* packBytes(writerState, blockSize, listEncodedBlocks(data, chunkSize));
    /** output the end of chunks */
    yield* packBytes(writerState, blockSize, [2 ** chunkSize]);
    if (0 < writerState.writtenBits) {
        yield writerState.byte;
    }
};

export const encode = (
    data: Iterable<number>,
    requestedChunkSize?: number,
): Generator<number> => listEncodedBytes(data, getChunkSize(data, requestedChunkSize));

export const encodeToArrayBuffer = (data: Iterable<number>, requestedChunkSize?: number): ArrayBuffer => {
    const arr = [...data];
    const chunkSize = getChunkSize(arr, requestedChunkSize);
    const chunkSizePartBits = (chunkSizeChunkBits + 1) * Math.ceil(getBitLength(chunkSize) / chunkSizeChunkBits);
    /** (end of chunks) + (data chunks)  */
    const dataChunkCount = 1 + arr.reduce((s, value) => s + Math.ceil(getBitLength(value) / chunkSize), 0);
    const dataPartBits = (chunkSize + 1) * dataChunkCount;
    const totalByteLength = Math.ceil((chunkSizePartBits + dataPartBits) / bitsInByte);
    const view = new DataView(new ArrayBuffer(totalByteLength));
    let index = 0;
    for (const byte of listEncodedBytes(data, chunkSize)) {
        // console.info(`(${index}/${view.byteLength}): ${byte.toString(2).padStart(8, '0')}`);
        view.setUint8(index++, byte);
    }
    return view.buffer;
};
