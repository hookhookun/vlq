/* eslint-disable no-undef */
import {encodeToArrayBuffer, decodeToArray} from './lib/index.mjs';

{
    const encoded = encodeToArrayBuffer([0, 1, 0, 1]);
    console.info(Buffer.from(encoded).toString('hex'));
    console.info(Buffer.from(encoded).toString('base64url'));
    console.info(decodeToArray(encoded));
}

{
    const encoded = encodeToArrayBuffer([1, 2, 3, 4], 1);
    console.info(Buffer.from(encoded).toString('hex'));
    console.info(Buffer.from(encoded).toString('base64url'));
    console.info(decodeToArray(encoded));
}

{
    const encoded = encodeToArrayBuffer([1, 2, 3, 4], 2);
    console.info(Buffer.from(encoded).toString('hex'));
    console.info(Buffer.from(encoded).toString('base64url'));
    console.info(decodeToArray(encoded));
}

{
    const encoded = encodeToArrayBuffer([10, 20, 30, 40]);
    console.info(Buffer.from(encoded).toString('hex'));
    console.info(Buffer.from(encoded).toString('base64url'));
    console.info(decodeToArray(encoded));
}

{
    const encoded = encodeToArrayBuffer([100, 200, 300, 400]);
    console.info(Buffer.from(encoded).toString('hex'));
    console.info(Buffer.from(encoded).toString('base64url'));
    console.info(decodeToArray(encoded));
}
