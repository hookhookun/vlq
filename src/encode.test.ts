import ava from 'ava';
import {encode} from './encode';

const serialize = function* (ab: ArrayBuffer): Generator<string> {
    for (const byte of new Uint8Array(ab)) {
        yield byte.toString(2).padStart(8, '0');
    }
};

const toString = (ab: ArrayBuffer): string => [...serialize(ab)].join('');

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
    ].join(''),
);
