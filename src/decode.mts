const bitsInByte = 8;

const listBlocks = function* (
    view: DataView,
    blockSize: number,
) {
    let block = 0;
    let writtenBits = 0;
    const {byteLength} = view;
    for (let i = 1; i < byteLength; i++) {
        const byte = view.getUint8(i);
        let remainingBits = bitsInByte;
        while (0 < remainingBits) {
            const bitsToWrite = Math.min(remainingBits, blockSize - writtenBits);
            const masked = (byte & ((1 << remainingBits) - 1)) >> (remainingBits - bitsToWrite);
            remainingBits -= bitsToWrite;
            writtenBits += bitsToWrite;
            if (blockSize <= writtenBits) {
                yield block | masked;
                block = 0;
                writtenBits = 0;
            } else {
                block |= masked << (blockSize - writtenBits);
            }
        }
    }
};

export const decode = function* (
    encoded: ArrayBuffer,
): Generator<number> {
    const view = new DataView(encoded);
    const blockSize = view.getUint8(0);
    const chunkSize = blockSize - 1;
    const chunkMask = (1 << chunkSize) - 1;
    let value = 0;
    for (const block of listBlocks(view, blockSize)) {
        value |= block & chunkMask;
        if (block <= chunkMask) {
            yield value;
            value = 0;
        } else if (0 < (block & chunkMask)) {
            value = value << chunkSize;
        } else {
            break;
        }
    }
};
