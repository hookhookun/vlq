import {findEfficientChunkSize} from './findEfficientChunkSize';
import {getTotalBitLength} from './getTotalBitLength';
import {getBitLength} from './getBitLength';

const bitsInByte = 8;

const listEncodedBlocks = function* (
    data: Array<number>,
    bitLengthList: Array<number>,
    chunkSize: number,
): Generator<number> {
    const base = 1 << chunkSize;
    const mask = base - 1;
    const dataLength = data.length;
    for (let dataIndex = 0; dataIndex < dataLength; dataIndex++) {
        const valueToBeEncoded = data[dataIndex];
        for (let chunkIndex = Math.ceil(bitLengthList[dataIndex] / chunkSize); 0 < chunkIndex--;) {
            yield (0 < chunkIndex ? base : 0) | ((valueToBeEncoded >> (chunkSize * chunkIndex)) & mask);
        }
    }
    yield base;
};

const listEncodedBytes = function* (
    data: Array<number>,
    bitLengthList: Array<number>,
    chunkSize: number,
): Generator<number> {
    const blockSize = chunkSize + 1;
    yield blockSize;
    let byte = 0;
    let writtenBits = 0;
    for (const block of listEncodedBlocks(data, bitLengthList, chunkSize)) {
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
): ArrayBuffer => {
    const bitLengthList = data.map(getBitLength);
    const {chunkSize, bitLength: totalBitLength} = requestedChunkSize ? {
        chunkSize: requestedChunkSize,
        bitLength: getTotalBitLength(data, requestedChunkSize, bitLengthList),
    } : findEfficientChunkSize(data, bitLengthList);
    const view = new DataView(new ArrayBuffer(Math.ceil((totalBitLength + chunkSize + 1 + bitsInByte) / bitsInByte)));
    let byteOffset = 0;
    for (const byte of listEncodedBytes(data, bitLengthList, chunkSize)) {
        view.setUint8(byteOffset++, byte);
    }
    return view.buffer;
};
