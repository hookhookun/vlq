import ava from 'ava';
import {getBitLength} from './getBitLength.mjs';

const test = (value: number, expected: number): void => {
    ava(`${value} -> ${expected}`, (t) => {
        t.is(getBitLength(value), expected);
    });
};

test(0, 1);
test(1, 1);
test(2, 2);
test(3, 2);
test(4, 3);
test(7, 3);
test(8, 4);
test(15, 4);
test(16, 5);
test(31, 5);
test(32, 6);
