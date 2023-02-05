import ava from 'ava';
import {getTotalBitLength} from './getTotalBitLength.mjs';

const test = (
    data: Array<number>,
    chunkSize: number,
    expected: number,
): void => {
    ava(`${data.join(',')} ${chunkSize} -> ${expected}`, (t) => {
        t.is(getTotalBitLength(data, chunkSize), expected);
    });
};

test([0, 1, 2, 3, 0, 1, 2, 3], 2, 24);
