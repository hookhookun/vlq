import {getBitLength} from './getBitLength.mjs';
import {getTotalBitLength} from './getTotalBitLength.mjs';

export const findEfficientChunkSize = (
    data: Array<number>,
    bitLengthList = data.map(getBitLength),
): {chunkSize: number, bitLength: number} => {
    let minEncodedBitLength = Infinity;
    let candidate = 1;
    for (let chunkSize = 1; chunkSize <= 31; chunkSize++) {
        const encodedBitLength = getTotalBitLength(data, chunkSize, bitLengthList);
        if (encodedBitLength < minEncodedBitLength) {
            minEncodedBitLength = encodedBitLength;
            candidate = chunkSize;
        }
    }
    return {chunkSize: candidate, bitLength: minEncodedBitLength};
};
