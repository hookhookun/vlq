import ava from 'ava';
import {findEfficientChunkSize} from './findEfficientChunkSize';

const test = (
    {data, expected}: {
        data: Array<number>,
        expected?: ReturnType<typeof findEfficientChunkSize>,
    },
): void => {
    ava(`${data.join(',')} -> ${expected ? JSON.stringify(expected) : 'Error'}`, (t) => {
        t.deepEqual(
            findEfficientChunkSize(data),
            expected,
        );
    });
};

test({
    data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    expected: {chunkSize: 1, encodedBitLength: 20},
});
test({
    data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 4],
    expected: {chunkSize: 1, encodedBitLength: 26},
});
test({
    data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 8388607],
    expected: {chunkSize: 1, encodedBitLength: 66},
});
test({
    data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 8388608],
    expected: {chunkSize: 2, encodedBitLength: 66},
});
