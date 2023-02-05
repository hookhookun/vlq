import console from 'console';
import {encode, decode} from './lib/index.mjs';

const source = [100, 200, 300, 400];
const encoded = encode(source);
console.info(encoded);
console.info(decode(encoded));
