import { test, expect, beforeAll } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff, { readFile, genLineDiff } from '../src/cli.js';

const flatData1 = {
  host: 'hexlet.io',
  timeout: '50',
  proxy: '123.234.53.22',
  follow: 'false',
};
const flatData2 = {
  timeout: '20',
  verbose: 'true',
  host: 'hexlet.io',
};
const flatDataDiff = '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}';

let path1;
let path2;
beforeAll(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  path1 = getFixturePath('file1.json');
  path2 = getFixturePath('file2.json');
});

test('test readFile()', () => {
  expect(readFile(path1, 'json')).toEqual(flatData1);
  expect(readFile(path2, 'json')).toEqual(flatData2);
});

test('test genLineDiff()', () => {
  expect(genLineDiff('timeout', flatData1, flatData2)).toEqual('  - timeout: 50\n  + timeout: 20');
  expect(genLineDiff('proxy', flatData1, flatData2)).toEqual('  - proxy: 123.234.53.22');
  expect(genLineDiff('verbose', flatData1, flatData2)).toEqual('  + verbose: true');
  expect(genLineDiff('host', flatData1, flatData2)).toEqual('    host: hexlet.io');
});

test('test genDiff()', () => {
  expect(genDiff(path1, path2)).toEqual(flatDataDiff);
});
