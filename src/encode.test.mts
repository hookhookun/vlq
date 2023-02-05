import ava from 'ava';
import {encode} from './encode.mjs';

const toString = (ab: ArrayBuffer): string => {
    let result = '';
    for (const byte of new Uint8Array(ab)) {
        result += byte.toString(2).padStart(8, '0');
    }
    return result;
};

const test = (
    data: Array<number>,
    expected: string,
    chunkSize?: number,
): void => {
    ava(`${data.join(',')} ${chunkSize}`, (t) => {
        const actual = encode(data, chunkSize);
        t.is(toString(actual), expected);
    });
};

test(
    [0, 1, 2, 3, 0, 1, 2, 3],
    [
        '00000011',
        '000',
        '001',
        '010',
        '011',
        '000',
        '001',
        '010',
        '011',
        '10000000',
    ].join(''),
    2,
);

test(
    [0, 1, 2, 3, 0, 1, 2, 3],
    [
        '00000010',
        '00',
        '01',
        '11',
        '00',
        '11',
        '01',
        '00',
        '01',
        '11',
        '00',
        '11',
        '01',
        '10000000',
    ].join(''),
);
