import ava from 'ava';
import {encodeToArrayBuffer} from './encode.mjs';

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
        const actual = encodeToArrayBuffer(data, chunkSize);
        t.is(toString(actual), expected);
    });
};

test(
    [0, 1, 2, 3, 0, 1, 2, 3],
    [
        '000010',
        '000',
        '001',
        '010',
        '011',
        '000',
        '001',
        '010',
        '011',
        '1000000000',
    ].join(''),
    2,
);

test(
    [0, 1, 2, 3, 0, 1, 2, 3],
    [
        '000001',
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
        '10',
    ].join(''),
);
