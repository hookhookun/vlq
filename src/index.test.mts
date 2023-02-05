import * as fs from 'fs';
import ava from 'ava';

const directory = new URL('.', import.meta.url);

ava('generate index.ts', async (t) => {
    const names: Array<string> = [];
    for (const name of await fs.promises.readdir(directory)) {
        if (!name.endsWith('.test.mts') && name !== 'index.mts') {
            names.push(name.slice(0, name.indexOf('.')));
        }
    }
    const expected = names.map((name) => `export * from './${name}.mjs';`).concat('').join('\n');
    t.log(expected);
    const actual = await fs.promises.readFile(new URL('index.mts', directory), 'utf8');
    t.is(actual, expected);
});
