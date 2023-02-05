import * as fs from 'fs';
import * as path from 'path';
import ava from 'ava';

ava('generate index.ts', async (t) => {
    const names: Array<string> = [];
    for (const name of await fs.promises.readdir(__dirname)) {
        if (!name.endsWith('.test.ts') && name !== 'index.ts') {
            names.push(name.slice(0, name.indexOf('.')));
        }
    }
    const expected = names.map((name) => `export * from './${name}';`).concat('').join('\n');
    t.log(expected);
    const actual = await fs.promises.readFile(path.join(__dirname, 'index.ts'), 'utf8');
    t.is(actual, expected);
});
