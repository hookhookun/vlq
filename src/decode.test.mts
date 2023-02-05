import ava from 'ava';
import {decode} from './decode.mjs';

const test = (
    data: string,
    expected: Array<number>,
): void => {
    ava(`${data} -> ${expected.join(',')}`, (t) => {
        const byteLength = Math.ceil(data.length / 8);
        const view = new DataView(new ArrayBuffer(byteLength));
        for (let byteOffset = 0; byteOffset < byteLength; byteOffset++) {
            const biteOffset = byteOffset * 8;
            view.setUint8(
                byteOffset,
                parseInt(
                    data.slice(biteOffset, biteOffset + 8).padEnd(8, '0'),
                    2,
                ),
            );
        }
        t.deepEqual([...decode(view.buffer)], expected);
    });
};

test(
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
    [0, 1, 2, 3, 0, 1, 2, 3],
);

test(
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
    [0, 1, 2, 3, 0, 1, 2, 3],
);

test(
    [
        '00001010',
        '0000000001',
        '0000000010',
        '0000000100',
        '0000001000',
        '0000010000',
        '0000100000',
        '0001000000',
        '0010000000',
        '0100000000',
        '1000000001',
        '0000000000',
        '1000000010',
        '0000000000',
        '1000000100',
        '0000000000',
        '10000000',
    ].join(''),
    [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
);
