import {bitsInByte, chunkSizeBits, maxChunkSize} from './constants.mjs';

const getBitLength = (value: number): number => value === 0 ? 1 : Math.ceil(Math.log2(value + 1));

const getBitLengthMap = (data: Array<number>): Map<number, number> => {
    const bitLengthMap = new Map<number, number>();
    for (const value of data) {
        const bitLength = getBitLength(value);
        bitLengthMap.set(bitLength, (bitLengthMap.get(bitLength) || 0) + 1);
    }
    return bitLengthMap;
};

const getTotalBitLength = (bitLengthMap: Map<number, number>, chunkSize: number): number => {
    let chunkCount = 0;
    for (const [bitLength, count] of bitLengthMap) {
        chunkCount += Math.ceil(bitLength / chunkSize) * count;
    }
    return (1 + chunkSize) * chunkCount;
};

const calculateEfficientChunkSize = (lengthMap: Map<number, number>): number => {
    let minTotalBitLength = Infinity;
    let candidate = 1;
    for (let chunkSize = 1; chunkSize <= maxChunkSize; chunkSize++) {
        const totalBitLength = getTotalBitLength(lengthMap, chunkSize);
        if (totalBitLength < minTotalBitLength) {
            minTotalBitLength = totalBitLength;
            candidate = chunkSize;
        }
    }
    return candidate;
};

const getChunkSize = (data: Array<number>, requestedChunkSize?: number): number => {
    if (requestedChunkSize) {
        if (!(Number.isInteger(requestedChunkSize) && 0 < requestedChunkSize)) {
            throw new Error('chunkSize must be a positive integer.');
        }
        if (maxChunkSize < requestedChunkSize) {
            throw new Error(`chunkSize cannot be larger than ${maxChunkSize}.`);
        }
        return requestedChunkSize;
    } else {
        return calculateEfficientChunkSize(getBitLengthMap(data));
    }
};

const listEncodedBlocks = function* (data: Array<number>, chunkSize: number): Generator<number> {
    const base = 1 << chunkSize;
    const mask = base - 1;
    const dataLength = data.length;
    for (let dataIndex = 0; dataIndex < dataLength; dataIndex++) {
        const valueToBeEncoded = data[dataIndex];
        for (let chunkIndex = Math.ceil(getBitLength(valueToBeEncoded) / chunkSize); 0 < chunkIndex--;) {
            yield (0 < chunkIndex ? base : 0) | ((valueToBeEncoded >> (chunkSize * chunkIndex)) & mask);
        }
    }
    yield base;
};

const listEncodedBytes = function* (data: Array<number>, chunkSize: number): Generator<number> {
    const blockSize = chunkSize + 1;
    let byte = chunkSize << (bitsInByte - chunkSizeBits);
    let writtenBits = chunkSizeBits;
    for (const block of listEncodedBlocks(data, chunkSize)) {
        let consumedBits = 0;
        while (consumedBits < blockSize) {
            const remainingBits = blockSize - consumedBits;
            const writableBits = bitsInByte - writtenBits;
            const bitsToWrite = Math.min(writableBits, remainingBits);
            const maskedBlock = (block & ((1 << remainingBits) - 1)) >> (remainingBits - bitsToWrite);
            byte |= maskedBlock << (writableBits - bitsToWrite);
            consumedBits += bitsToWrite;
            writtenBits += bitsToWrite;
            if (writtenBits === bitsInByte) {
                writtenBits = 0;
                yield byte;
                byte = 0;
            }
        }
    }
    if (0 < writtenBits) {
        yield byte;
    }
};

export const encode = (
    data: Array<number>,
    requestedChunkSize?: number,
): Generator<number> => listEncodedBytes(data, getChunkSize(data, requestedChunkSize));

export const encodeToArrayBuffer = (data: Array<number>, requestedChunkSize?: number): ArrayBuffer => {
    const chunkSize = getChunkSize(data, requestedChunkSize);
    const totalBitLength = (1 + chunkSize) * data.reduce((s, value) => s + Math.ceil(getBitLength(value) / chunkSize), 0);
    const totalByteLength = Math.ceil((totalBitLength + chunkSize + 1 + chunkSizeBits) / bitsInByte);
    const view = new DataView(new ArrayBuffer(totalByteLength));
    let byteOffset = 0;
    for (const byte of listEncodedBytes(data, chunkSize)) {
        view.setUint8(byteOffset++, byte);
    }
    return view.buffer;
};
