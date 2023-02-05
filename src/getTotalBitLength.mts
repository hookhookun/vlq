import {getBitLength} from './getBitLength.mjs';

export const getTotalBitLength = (
    data: Array<number>,
    chunkSize: number,
    bitLengthList = data.map(getBitLength),
): number => {
    let sum = 0;
    for (const bitLength of bitLengthList) {
        sum += Math.ceil(bitLength / chunkSize);
    }
    return (1 + chunkSize) * sum;
};
