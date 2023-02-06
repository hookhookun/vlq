// @ts-check
import {URL} from 'node:url';
import * as fs from 'node:fs/promises';
import {execSync} from 'node:child_process';
import ts from 'typescript';

const rootDir = new URL('./', import.meta.url);
const cjsDir = new URL('cjs/', import.meta.url);
const mjsFiles = await fs.readdir(cjsDir);
/**
 * @param {ts.Node} node
 * @param {ts.SourceFile} source
 * @returns {Generator<ts.Node>}
 */
const walkSource = function* (node, source) {
    yield node;
    for (const child of node.getChildren(source)) {
        yield* walkSource(child, source);
    }
};
/**
 * @param {string} fileName
 * @param {string} code
 * @returns {Generator<ts.StringLiteral>}
 */
const listFilePathStringLiterals = function* (fileName, code) {
    const source = ts.createSourceFile(fileName, code, ts.ScriptTarget.ES5);
    switch (fileName.slice(fileName.lastIndexOf('.'))) {
        case '.mjs':
            for (const node of walkSource(source, source)) {
                if (ts.isCallExpression(node)) {
                    const {arguments: [argument], expression} = node;
                    if (ts.isIdentifier(expression) && ts.isStringLiteral(argument)) {
                        yield argument;
                    }
                }
            }
            break;
        case '.mts':
            for (const node of walkSource(source, source)) {
                if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                    const {moduleSpecifier} = node;
                    if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
                        yield moduleSpecifier;
                    }
                }
            }
            break;
        default:
    }
};
/**
 * @param {string} fileName
 * @param {string} code
 * @returns {Generator<ts.StringLiteral>}
 */
const listRelativeFilePathStringLiteralsFromLast = function* (fileName, code) {
    /** @type {Array<ts.StringLiteral>} */
    const result = [];
    for (const stringLiteral of listFilePathStringLiterals(fileName, code)) {
        if (stringLiteral.text.startsWith('.')) {
            result.push(stringLiteral);
        }
    }
    for (const stringLiteral of result.sort((a, b) => b.end - a.end)) {
        yield stringLiteral;
    }
};
execSync('npx tsc --module CommonJS --outDir cjs', {cwd: rootDir, stdio: 'inherit'});
await Promise.all(
    mjsFiles.map(async (fileName) => {
        const file = new URL(fileName, cjsDir);
        let code = await fs.readFile(file, 'utf8');
        for (const {text, end} of listRelativeFilePathStringLiteralsFromLast(fileName, code)) {
            const q = code[end - 1];
            const start = end - text.length - q.length * 2;
            switch (text.slice(text.lastIndexOf('.'))) {
                case '.mjs':
                    code = `${code.slice(0, start)}${q}${text.slice(0, -3)}cjs${q}${code.slice(end)}`;
                    break;
                default:
            }
        }
        await Promise.all([
            fs.unlink(new URL(fileName, cjsDir)),
            fs.writeFile(new URL(fileName.replace(/\.m([jt])s$/, '.c$1s'), cjsDir), code),
        ]);
    }),
);
